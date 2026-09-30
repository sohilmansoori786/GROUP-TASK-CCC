const Opportunity = require(",/models/Opportunity");
const Application = require("./models/Application");

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
    throw new Error("Opportunity not found");
  }

  if (opportunity.deadline < new Date()) {
    throw new Error("Application deadline has passed");
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