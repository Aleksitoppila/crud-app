// SELECTING AND DESELECTING ROW (row click and ctrl-click)
let selectedRow = null;

document.addEventListener('DOMContentLoaded', function () {
    // BUTTONS
    const projectsBody = document.getElementById('projects-body');
    const editButton = document.getElementById('edit-project-btn');
    const deleteButton = document.getElementById('delete-project-btn');
    const refreshButton = document.querySelector('.refresh-Btn');

    // SEARCH INPUTS
    const searchProjectID = document.getElementById('search-project-id');
    const searchProjectName = document.getElementById('search-project-name');
    const searchProjectDescription = document.getElementById('search-project-description');
    const searchProjectPostDate = document.getElementById('search-project-date');
    const searchProjectContributor = document.getElementById('search-project-contributor');
    const searchProjectLink = document.getElementById('search-project-link');
    
    // HANDLER FOR REFRESH BUTTON 
    refreshButton.addEventListener('click', function () {
        loadProjects();
    });

    // HANDLES ROW SELECTION FOR EDIT AND DELETE
    projectsBody.addEventListener('click', function (e) {
        const row = e.target.closest('tr');
        
        if (!row) return;

        // IF CTRL KEY PRESSED:
        if (e.ctrlKey) {
            // IF NO ROW SELECTED, SELECT CLICKED ROW
            if (!selectedRow) {
                row.classList.add('selected');
                selectedRow = row;
                editButton.disabled = false;
                deleteButton.disabled = false;
            }
            // IF CLICKED ROW IS SELECTED, DESELECT IT
            else if (row === selectedRow) {
                row.classList.remove('selected');
                selectedRow = null;
                editButton.disabled = true;
                deleteButton.disabled = true;
            }
        } else {
            // IF CTRL KEY NOT PRESSED:
            if (selectedRow) {
                selectedRow.classList.remove('selected');
            }
            row.classList.add('selected');
            selectedRow = row;
            editButton.disabled = false;
            deleteButton.disabled = false;
        }
    });

    // HANDLER FOR DELETE BUTTON
    deleteButton.addEventListener('click', async function () {
        if (!selectedRow) return;
        
        const projectId = selectedRow.getAttribute('data-id');

        try {
            const response = await fetch(`/api/delete/${projectId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.status === 200) {
                // REMOVE DELETED ROW FROM TABLE
                selectedRow.remove();
                selectedRow = null;
                editButton.disabled = true;
                deleteButton.disabled = true;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project.');
        }
    });

    // HANDLER FOR EDIT BUTTON
    editButton.addEventListener('click', async function () {
        if (!selectedRow) return;

        const projectId = selectedRow.getAttribute('data-id');
        try {
            const response = await fetch(`/api/${projectId}`);
            const project = await response.json();
            if (response.status === 200) {
                // POPULATE FORM IN MODAL WITH SELECTED PROJECT DATA
                document.getElementById('project-id').value = project._id;
                document.getElementById('projectName').value = project.projectName;
                document.getElementById('description').value = project.description;
                document.getElementById('contributor').value = project.contributor;
                document.getElementById('projectLink').value = project.projectLink;
                document.getElementById('postDate').value = new Date(project.postDate).toISOString().split('T')[0];

                // OPEN MODAL FOR EDITING
                document.getElementById('modal-title').textContent = 'Edit Project';
                document.getElementById('project-modal').style.display = 'block';
            } else {
                alert(project.message);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to load project for editing.');
        }
    });

    // HANDLER FOR ADD BUTTON
    document.getElementById('add-project-btn').addEventListener('click', function () {
        // CLEAR FORM AND SHOW MODAL FOR ADDING PROJECT
        document.getElementById('project-form').reset();
        document.getElementById('project-id').value = ''; // CLEAR INPUT FOR ID (This is hidden)
        document.getElementById('modal-title').textContent = 'Add New Project';
        document.getElementById('project-modal').style.display = 'block';
    });

    // CLOSE MODAL BUTTON
    document.getElementById('close-modal-btn').addEventListener('click', function () {
        document.getElementById('project-modal').style.display = 'none';
    });

    // HANDLER FOR FORM SUBMIT (ADD/EDIT)
    document.getElementById('project-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const projectData = {
            projectName: formData.get('projectName'),
            description: formData.get('description'),
            contributor: formData.get('contributor'),
            projectLink: formData.get('projectLink'),
            postDate: formData.get('postDate')
        };
        const projectId = formData.get('id');

        try {
            let response;
            if (projectId) {
                // IF THERE IS ID = UPDATE
                response = await fetch(`/api/update/${projectId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
            } else {
                // ELSE IT IS ADD
                response = await fetch('/api/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
            }

            const result = await response.json();
            if (response.status === 200) {
                // CLOSE MODAL AND RELOAD TABLE
                document.getElementById('project-modal').style.display = 'none';
                loadProjects(); // FUNCTION TO REFRESH PROJECTS TABLE
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Failed to submit project.');
        }
    });

    // EVENT LISTENERS FOR SEARCH INPUTS
    searchProjectID.addEventListener('input', filterRows);
    searchProjectName.addEventListener('input', filterRows);
    searchProjectDescription.addEventListener('input', filterRows);
    searchProjectPostDate.addEventListener('input', filterRows);
    searchProjectContributor.addEventListener('input', filterRows);
    searchProjectLink.addEventListener('input', filterRows);

    // FUNCTION FOR FILTERING ROWS
    function filterRows() {
        const IdFilter = searchProjectID.value.toLowerCase();
        const nameFilter = searchProjectName.value.toLowerCase();
        const descriptionFilter = searchProjectDescription.value.toLowerCase();
        const dateFilter = searchProjectPostDate.value.toLowerCase();
        const contributorFilter = searchProjectContributor.value.toLowerCase();
        const linkFilter = searchProjectLink.value.toLowerCase();

        const rows = projectsBody.querySelectorAll('tr');

        rows.forEach (row => {
            const projectId = row.cells[0].textContent.toLowerCase();
            const projectName = row.cells[1].textContent.toLowerCase();
            const description = row.cells[2].textContent.toLowerCase();
            const postDate = row.cells[3].textContent.toLowerCase();
            const contributor = row.cells[4].textContent.toLowerCase();
            const link = row.cells[5].textContent.toLowerCase();

            const isVisible = 
            (projectId.includes(IdFilter)) &&
            (projectName.includes(nameFilter)) &&
            (description.includes(descriptionFilter)) &&
            (postDate.includes(dateFilter)) &&
            (contributor.includes(contributorFilter)) &&
            (link.includes(linkFilter));

            row.style.display = isVisible ? '' : 'none';
        });
    }
});

// FUNCTION FOR LOADING ALL PROJECTS AND POPULATING TABLE
async function loadProjects() {
    try {
        const response = await fetch('/api/getall');
        const projects = await response.json();
        const projectsBody = document.getElementById('projects-body');
        projectsBody.innerHTML = ''; // CLEAR EXISTING ROWS

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', project._id);
            row.innerHTML = `
                <td id="td-id">${ project._id }</td>
                <td>${ project.projectName }</td>
                <td>${ project.description }</td>
                <td>${ new Date(project.postDate).toLocaleDateString() }</td>
                <td>${ project.contributor }</td>
                <td><a href="${ project.projectLink }" target="_blank">Link</a></td>
            `;
            projectsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// CALLING FUNCTION TO LOAD PROJECTS WHEN PAGE IS LOADED
loadProjects();
