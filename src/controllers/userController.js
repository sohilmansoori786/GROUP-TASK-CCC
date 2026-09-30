const User = require("/models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        skills
      },
      {
        new: true
      }
    ).select("-password");

    res.json({
      success: true,
      message: "Skills updated",
      user
    });
  } catch (error) {
    next(error);
  }
};

const saveOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.savedOpportunities.includes(opportunityId)) {
      user.savedOpportunities.push(opportunityId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Opportunity saved"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateSkills,
  saveOpportunity
};