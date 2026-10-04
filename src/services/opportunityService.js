const Opportunity = require("../models/opportunity");
const Application = require("../models/Appilication");

const createOpportunity = async (data, userId) => {
  return Opportunity.create({
    ...data,
    createdBy: userId
  });
};

const getOpportunities = async () => {
  return Opportunity.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

const getOpportunity = async (id) => {
  return Opportunity.findById(id)
    .populate("createdBy", "name email");
};

const applyToOpportunity = async (
  userId,
  opportunityId
) => {
  const opportunity = await Opportunity.findById(
    opportunityId
  );

  if (!opportunity) {
    const err = new Error("Opportunity not found");
    err.statusCode = 404;
    throw err;
  }

  if (opportunity.deadline < new Date()) {
    const err = new Error("Application deadline has passed");
    err.statusCode = 400;
    throw err;
  }

  const application = await Application.create({
    user: userId,
    opportunity: opportunityId
  });

  return application;
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  applyToOpportunity
};