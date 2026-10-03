const mlService = require("../services/mlService");

const studentRecommend = async (req, res, next) => {
  try {
    const result = await mlService.studentRecommend(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const predictRegistrations = async (req, res, next) => {
  try {
    const result = await mlService.predictRegistrations(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const eventDemand = async (req, res, next) => {
  try {
    const result = await mlService.eventDemand();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const organizerAnalytics = async (req, res, next) => {
  try {
    const result = await mlService.organizerAnalytics();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const eventRisk = async (req, res, next) => {
  try {
    const result = await mlService.eventRisk(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentRecommend,
  predictRegistrations,
  eventDemand,
  organizerAnalytics,
  eventRisk
};