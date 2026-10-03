const axios = require("axios");

const ML_API_URL = process.env.ML_API_URL;

const studentRecommend = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/student/recommend`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

const predictRegistrations = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/organizer/predict-registrations`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

const eventDemand = async () => {
  const response = await axios.get(
    `${ML_API_URL}/organizer/event-demand`
  );

  return response.data;
};

const organizerAnalytics = async () => {
  const response = await axios.get(
    `${ML_API_URL}/organizer/analytics`
  );

  return response.data;
};

const eventRisk = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/admin/event-risk`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

module.exports = {
  studentRecommend,
  predictRegistrations,
  eventDemand,
  organizerAnalytics,
  eventRisk
};