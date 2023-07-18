const express = require('express');
const slotController = require('../controllers/slotController');

const router = express.Router();

router.post('/slots', slotController.createSlot);
router.get('/slots', slotController.getAllSlots);
router.get('/slots/:id', slotController.getSlotById);
router.put('/slots/:id', slotController.updateSlotById);
router.delete('/slots/:id', slotController.deleteSlotById);

module.exports = router;
