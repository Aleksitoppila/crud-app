const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const locals = {
        title: "REST API Project",
        description: "Website created with NodeJS, Express & MongoDb"
    }
    res.render('index', { locals } );
});

module.exports = router;