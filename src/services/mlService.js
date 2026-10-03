const axios = require("axios");
                                                 //9 ML api
const ML_API_URL_1 = process.env.ML_API_URL_1;
const ML_API_URL_2 = process.env.ML_API_URL_2;

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

const getDomains = async () => {
  const response = await axios.get(
    `${ML_API_URL}/domains`
  );

  return response.data;
};

const categorizeDomain = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/categorize`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

const analyzeSentiment = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/sentiment`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

const analyzeSentimentBatch = async (data) => {
  const response = await axios.post(
    `${ML_API_URL}/sentiment/batch`,
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
  eventRisk,
  getDomains,
categorizeDomain,
analyzeSentiment,
analyzeSentimentBatch
};