const User = require("../models/user");
const Opportunity = require("../models/opportunity");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

const getPendingEvents = async (req, res, next) => {
  try {
    const events = await Opportunity.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const event = await Opportunity.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: `Event ${status.toLowerCase()} successfully`, event });
  } catch (error) {
    next(error);
  }
};

const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Opportunity.countDocuments();
    const pendingEvents = await Opportunity.countDocuments({ status: "Pending" });
    const approvedEvents = await Opportunity.countDocuments({ status: "Approved" });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        pendingEvents,
        approvedEvents,
        platformGrowth: 12 // Hardcoded for now as it would require historical data
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getPendingEvents,
  updateEventStatus,
  getPlatformAnalytics
};