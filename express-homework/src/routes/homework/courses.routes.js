const express = require('express');
const router = express.Router();

const availableCourses = [
    { id: 1, topic: 'JavaScript', level: 'beginner' },
    { id: 2, topic: 'Node.js', level: 'intermediate' },
    { id: 3, topic: 'React', level: 'advanced' },
    { id: 4, topic: 'Express', level: 'intermediate' },
    { id: 5, topic: 'MongoDB', level: 'beginner' }
];

router.get('/', (req, res) => {
    const { topic, level } = req.query;
    
    if (topic && level) {
        res.send(`Showing courses on ${topic} for ${level} level.`);
    } else if (topic) {
        res.send(`Showing courses on ${topic}.`);
    } else if (level) {
        res.send(`Showing courses for ${level} level.`);
    } else {
        res.json({
            message: 'Available courses',
            courses: availableCourses
        });
    }
});

module.exports = router;
