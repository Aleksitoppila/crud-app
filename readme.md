School project to create REST API and CRUD application.

    Functionality:
        - Requests full list of projects in database
        - Can add/edit/delete projects (to database via API requests)
        - Can refresh table (instead of refreshing whole webpage)
        - Filters for ID, Project Name, Description, Post Date, Contributor (link was kinda useless, would need some work)
        - Can select and deselect table contents (Mouse left click, Ctrl + Mouse left click)

        - API requests are made with these routes:
            - /api/add --> Add project to database
            - /api/getall --> Get all projects from database
            - /api/:id --> Get project with certain id from database
            - /api/delete/:id --> Delete certain project from database
            - /api/update/:id --> Update project information to database

    Things to add later:
        - Some CSS fixes
        - Add more pages
        - Remove "Search" from the navbar (initial idea for this was a id search for projects)
        - paging for the table (25, 50, 100 table rows), currently list could potentially be way too long
        - Some bugfixing

This is first CRUD application i have made, so there is lot to improve on.