const Shift = require("../models/Shift");

exports.list = async (req, res) => {
  try {
    const shifts = await Shift.findAll();
    res.json({ success: true, data: shifts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json({ success: true, data: shift });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create shift" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ error: "Shift not found" });
    res.json({ success: true, data: shift });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ error: "Shift not found" });

    await shift.update(req.body);
    res.json({ success: true, data: shift });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update shift" });
  }
};

exports.remove = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ error: "Shift not found" });

    await shift.destroy();
    res.json({ success: true, message: "Shift deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete shift" });
  }
};
