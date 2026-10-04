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

  const existingApplication = await Application.findOne({
    user: userId,
    opportunity: opportunityId
  });

  if (existingApplication) {
    const err = new Error("You have already applied to this opportunity");
    err.statusCode = 400;
    throw err;
  }

  const application = await Application.create({
    user: userId,
    opportunity: opportunityId
  });

  return application;
};

const getApplicants = async (opportunityId, userId) => {
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const err = new Error("Opportunity not found");
    err.statusCode = 404;
    throw err;
  }
  if (opportunity.createdBy.toString() !== userId.toString()) {
    const err = new Error("Not authorized to view applicants for this opportunity");
    err.statusCode = 403;
    throw err;
  }
  return Application.find({ opportunity: opportunityId })
    .populate("user", "name email skills")
    .sort({ createdAt: -1 });
};

const updateOpportunity = async (opportunityId, data, userId) => {
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const err = new Error("Opportunity not found");
    err.statusCode = 404;
    throw err;
  }
  if (opportunity.createdBy.toString() !== userId.toString()) {
    const err = new Error("Not authorized to update this opportunity");
    err.statusCode = 403;
    throw err;
  }
  return Opportunity.findByIdAndUpdate(opportunityId, data, { new: true });
};

const deleteOpportunity = async (opportunityId, userId) => {
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const err = new Error("Opportunity not found");
    err.statusCode = 404;
    throw err;
  }
  if (opportunity.createdBy.toString() !== userId.toString()) {
    const err = new Error("Not authorized to delete this opportunity");
    err.statusCode = 403;
    throw err;
  }
  await Application.deleteMany({ opportunity: opportunityId });
  await Opportunity.findByIdAndDelete(opportunityId);
  return { message: "Opportunity deleted successfully" };
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunity,
  applyToOpportunity,
  getApplicants,
  updateOpportunity,
  deleteOpportunity
};