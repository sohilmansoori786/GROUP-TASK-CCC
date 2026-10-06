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

const getDomains = async (req, res, next) => {
  try {
    const result = await mlService.getDomains();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const categorizeDomain = async (req, res, next) => {
  try {
    const result = await mlService.categorizeDomain(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const analyzeSentiment = async (req, res, next) => {
  try {
    const result = await mlService.analyzeSentiment(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const analyzeSentimentBatch = async (req, res, next) => {
  try {
    const result = await mlService.analyzeSentimentBatch(req.body);

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
  eventRisk,
  getDomains,
  categorizeDomain,
  analyzeSentiment,
  analyzeSentimentBatch
};