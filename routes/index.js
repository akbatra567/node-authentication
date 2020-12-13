const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const Story = require('./../models/Story');


// @desc Blog/Landing page
// @route GET /
router.get('/', (req, res) => {
    res.render('blog/index', {
        layout: 'blog',
    });
});


// @desc Login
// @route GET /login
router.get('/login', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});


// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id }).lean();

        res.render('dashboard', {
            title: 'Dashboard',
            name: req.user.firstName,
            stories
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


module.exports = router;