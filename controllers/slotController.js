const Slot = require('../models/slotModel');

const slotController = {
  createSlot: async (req, res) => {
    try {
      const { date, time, price } = req.body;

      const slot = new Slot({
        date,
        time,
        price
      });

      await slot.save();

      res.status(201).json({ message: 'Slot created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllSlots: async (req, res) => {
    try {
      const slots = await Slot.find();

      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSlotById: async (req, res) => {
    try {
      const { id } = req.params;

      const slot = await Slot.findById(id);

      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      res.json(slot);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateSlotById: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, time, price, available } = req.body;

      const slot = await Slot.findByIdAndUpdate(
        id,
        { date, time, price, available },
        { new: true }
      );

      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      res.json(slot);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteSlotById: async (req, res) => {
    try {
      const { id } = req.params;

      const slot = await Slot.findByIdAndDelete(id);

      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = slotController;
