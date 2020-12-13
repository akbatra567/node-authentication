const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('./../middleware/auth');
const Story = require('./../models/Story');
const Article = require('./../models/Article');

// @desc Blog/Landing page
// @route GET /
router.get('/', (req, res) => {
    res.render('blog/index', {
        layout: 'blog',
        title: 'Home'
    });
});

// @desc Contact Page
// @route GET /contact
router.get('/contact', (req, res) => {
    res.render('blog/contact', {
        layout: 'blog',
        title: 'Contact'
    });
});

// @desc About page
// @route GET /about
router.get('/about', (req, res) => {
    res.render('blog/about', {
        layout: 'blog',
        title: 'About Us'
    });
});


// @desc Login
// @route GET /login
router.get('/login', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
        title: 'Login'
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



// @desc Read Post
// // @route GET /
// router.get('/:slug', async (req, res) => {
//     const article = await Article.findOne({ slug: req.params.slug })
//     if (article == null) res.redirect('/')
//     res.render('articles/show', {
//         layout: 'blog',
//         article: article,
//         title: article.title
//     })
// })

module.exports = router;