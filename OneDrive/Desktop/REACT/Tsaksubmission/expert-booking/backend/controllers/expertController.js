const bcrypt = require('bcryptjs');
const Expert = require('../models/Expert');

// GET /experts — with pagination, search, filter
const getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, search = '', category = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { bio: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const [experts, total] = await Promise.all([
      Expert.find(query)
        .select('-availableSlots')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Expert.countDocuments(query),
    ]);

    res.json({
      experts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalExperts: total,
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /experts/:id
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    // Group slots by date, only future slots
    const today = new Date().toISOString().split('T')[0];
    const slotsByDate = {};

    expert.availableSlots
      .filter((slot) => slot.date >= today)
      .sort((a, b) => (a.date > b.date ? 1 : a.time > b.time ? 1 : -1))
      .forEach((slot) => {
        if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
        slotsByDate[slot.date].push(slot);
      });

    res.json({ ...expert, slotsByDate });
  } catch (err) {
    next(err);
  }
};

const searchExperts = async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 9 } = req.query;
    const query = keyword ? {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { speciality: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ],
    } : {};
    const experts = await Expert.find(query).limit(limit).skip((page - 1) * limit);
    const total = await Expert.countDocuments(query);
    res.json({ experts, totalExperts: total, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// PUT /experts/:id
const updateExpert = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Security check: ensure the user updating is actually the expert!
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { name, phone, experience, bio, hourlyRate, category } = req.body;
    let updateFields = { name, phone, experience, bio, hourlyRate, category, speciality: category, pricePerHour: hourlyRate };

    // Strip undefined inputs
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined || updateFields[key] === 'undefined') delete updateFields[key];
    });

    if (req.file) {
      updateFields.profileImage = `/uploads/${req.file.filename}`;
      updateFields.avatar = updateFields.profileImage;
    }

    const expert = await Expert.findByIdAndUpdate(id, updateFields, { new: true });
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    
    res.json({ message: 'Profile updated successfully', expert });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExperts, getExpertById, searchExperts, updateExpert };
