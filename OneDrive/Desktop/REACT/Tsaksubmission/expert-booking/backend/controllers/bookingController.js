const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /bookings
const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    let expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        'availableSlots.date': date,
        'availableSlots.time': timeSlot,
        'availableSlots.isBooked': false,
      },
      { $set: { 'availableSlots.$.isBooked': true } },
      { new: true }
    );

    if (!expert) {
      // It might be that the slot doesn't exist yet (arbitrary time booked), 
      // or it's already booked. Let's try to add it ONLY if it doesn't exist.
      expert = await Expert.findOneAndUpdate(
        {
          _id: expertId,
          "availableSlots": { $not: { $elemMatch: { date, time: timeSlot } } }
        },
        {
          $push: { availableSlots: { date, time: timeSlot, isBooked: true } }
        },
        { new: true }
      );

      if (!expert) {
        // If it still fails, either the expert doesn't exist or the slot IS already booked.
        const expertExists = await Expert.findById(expertId);
        if (!expertExists) return res.status(404).json({ error: 'Expert not found' });

        return res.status(409).json({
          error: 'This time slot is no longer available. Please select another slot.',
        });
      }
    }

    const booking = new Booking({
      userId: req.user.id,
      expertId,
      expertName: expert.name,
      userName, email, phone, date, timeSlot, notes,
    });

    await booking.save();

    await Expert.updateOne(
      { _id: expertId, 'availableSlots.date': date, 'availableSlots.time': timeSlot },
      { $set: { 'availableSlots.$.bookingId': booking._id } }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`expert-${expertId}`).emit('slot-booked', { expertId, date, timeSlot, bookingId: booking._id });
    }

    res.status(201).json({ message: 'Booking created successfully!', booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'This time slot was just booked by someone else. Please select another slot.',
      });
    }
    next(err);
  }
};

// GET /bookings?email=
const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const bookings = await Booking.find({ email: email.toLowerCase().trim() })
      .populate('expertId', 'name category avatar')
      .sort({ createdAt: -1 }).lean();
    res.json({ bookings });
  } catch (err) { next(err); }
};

// PATCH /bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (status === 'cancelled') {
      await Expert.updateOne(
        { _id: booking.expertId, 'availableSlots.date': booking.date, 'availableSlots.time': booking.timeSlot },
        { $set: { 'availableSlots.$.isBooked': false, 'availableSlots.$.bookingId': null } }
      );
      const io = req.app.get('io');
      if (io) io.to(`expert-${booking.expertId}`).emit('slot-released', { expertId: booking.expertId, date: booking.date, timeSlot: booking.timeSlot });
    }
    res.json({ message: 'Booking status updated', booking });
  } catch (err) { next(err); }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('expertId', 'name category avatar').sort({ date: 1, timeSlot: 1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const getExpertBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ expertId: req.params.expertId }).sort({ date: 1, timeSlot: 1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// GET /bookings/expert/:expertId/earnings
const getExpertEarnings = async (req, res, next) => {
  try {
    const { expertId } = req.params;
    const completedBookings = await Booking.countDocuments({ expertId, status: 'completed' });
    const expert = await Expert.findById(expertId).select('hourlyRate').lean();
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    const totalEarnings = completedBookings * (expert.hourlyRate || 0);
    res.json({ totalEarnings, completedSessions: completedBookings });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getBookingsByEmail, updateBookingStatus, getUserBookings, getExpertBookings, getExpertEarnings };