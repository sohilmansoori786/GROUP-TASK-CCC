const opportunityService = require("../services/opportunityService");
const recommendationService = require("../services/recommendationService");

const createOpportunity = async (req, res, next) => {
  try {
    const opportunity =
      await opportunityService.createOpportunity(
        req.body,
        req.user.userId
      );

    res.status(201).json({
      success: true,
      message: "Opportunity created",
      opportunity
    });
  } catch (error) {
    next(error);
  }
};

const getOpportunities = async (req, res, next) => {
  try {
    const opportunities =
      await opportunityService.getOpportunities();

    res.json({
      success: true,
      count: opportunities.length,
      opportunities
    });
  } catch (error) {
    next(error);
  }
};

const getOpportunity = async (req, res, next) => {
  try {
    const opportunity =
      await opportunityService.getOpportunity(
        req.params.id
      );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found"
      });
    }

    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    next(error);
  }
};

const apply = async (req, res, next) => {
  try {
    const application =
      await opportunityService.applyToOpportunity(
        req.user.userId,
        req.params.id
      );

    res.status(201).json({
      success: true,
      message: "Application submitted",
      application
    });
  } catch (error) {
    next(error);
  }
};

const recommendations = async (req, res, next) => {
  try {
    const recommendations =
      await recommendationService.getRecommendations(
        req.user
      );

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const applicants = await opportunityService.getApplicants(
      req.params.id,
      req.user.userId
    );
    res.json({
      success: true,
      count: applicants.length,
      applicants
    });
  } catch (error) {
    next(error);
  }
};

const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.updateOpportunity(
      req.params.id,
      req.body,
      req.user.userId
    );
    res.json({
      success: true,
      message: "Opportunity updated",
      opportunity
    });
  } catch (error) {
    next(error);
  }
};

const deleteOpportunity = async (req, res, next) => {
  try {
    const result = await opportunityService.deleteOpportunity(
      req.params.id,
      req.user.userId
    );
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  apply,
  recommendations,
  getApplicants,
  updateOpportunity,
  deleteOpportunity
};