const express = require('express');
const vacationsForUsersController = require('../../controllers/users/vacationsForUsers');
const { protect } = require('../../middleware/is-auth');

const router = express.Router();

// @route   GET /api/vacations
// @desc    Get all vacations
// @access  Private/User
router.get('/', protect, vacationsForUsersController.getVacations);

//@route    PATCH /api/vacations/like/:id
//@desc     Update a vacation - add a follower
//@route    Private/User
router.patch(`/like/:id`, protect, vacationsForUsersController.addLike);

//@route    PATCH /api/vacations/unlike/:id
//@desc     Update a vacation - remove a follower
//@route    Private/User
router.patch(`/unlike/:id`, protect, vacationsForUsersController.removeLike);

module.exports = router;