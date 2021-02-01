const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/is-auth');

const vacationsController = require('../../controllers/admin/vacations');

//@route    GET /api/admin/vacations
//@desc     Get all vacations
//@access   Private/Admin
router.get(`/`, protect, authorize('admin'), vacationsController.getVacations);

//@route    POST /api/admin/vacations
//@desc     Add a new vacation
//@route    Private/Admin
router.post(`/`, protect, authorize('admin'), vacationsController.createVacation);

//@route    PUT /api/admin/vacations/:id
//@desc     Update a vacation
//@route    Private/Admin
router.put(`/:id`, protect, authorize('admin'), vacationsController.updateVacation);

//@route    DELETE /api/admin/vacations/:id
//@desc     Delete a vacation
//@route    Private/Admin
router.delete(`/:id`, protect, authorize('admin'), vacationsController.deleteVacation);

module.exports = router;