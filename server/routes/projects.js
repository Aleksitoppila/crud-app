// IMPORTS
const express = require('express')
const router = express.Router();
const Project = require('../models/Project')

// RETURN ALL DOCUMENTS IN COLLECTION
router.get('/getall', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// RETURN ONE ITEM WITH THE GIVEN ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById({ _id: req.params.id });    
        if (!project) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        } else {
            res.status(200).json(project);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// CREATE A NEW DOCUMENT IN THE COLLECTION
router.post('/add', async (req, res) => {
    const project = new Project({
        projectName: req.body.projectName,
        description: req.body.description,
        postDate: req.body.date,
        contributor: req.body.contributor,
        projectLink: req.body.projectLink
    });
    try { 
    const savedProjects = await project.save();
    res.status(200).json(savedProjects);
    } catch (err) {
        res.status(400).json ({ message: err.message });
    }
});

// UPDATE THE DOCUMENT WITH THE GIVEN ID
router.patch('/update/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    projectName: req.body.projectName,
                    description: req.body.description,
                    postDate: req.body.postDate,
                    contributor: req.body.contributor,
                    projectLink: req.body.projectLink
                }
            },
            { new: true }
        ); 
        if (!updatedProject) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        } else {
            res.status(200).json(updatedProject);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE THE ITEM WITH THE GIVEN ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const removedProject = await Project.findByIdAndDelete({ _id: req.params.id });   
        if (!removedProject) {
            return res.status(404).json({ message: "Project with this ID doesn't exist" });
        } else {
            res.status(200).json(removedProject);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE ALL DOCUMENTS IN A COLLECTION
router.delete('/deleteall', async (req, res) => {
    try {
        const deletedProjects = await Project.deleteMany();
        res.status(200).json({ message: `${deletedProjects.deletedCount} projects deleted` })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router;