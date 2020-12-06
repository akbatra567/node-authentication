const express = require('express');
const router = express.Router();
const { ensureAuth } = require('./../middleware/auth');

// @desc Profile Page
// @route GET /profile
router.get('/:id', ensureAuth, (req, res) => {
    res.render('profile.index');
});



module.exports = router;