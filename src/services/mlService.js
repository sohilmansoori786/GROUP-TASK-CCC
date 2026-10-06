const axios = require("axios");

const ML_API_URL_1 = process.env.ML_API_URL_1;
const ML_API_URL_2 = process.env.ML_API_URL_2;

// 1. Student Recommendation
const studentRecommend = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_1}/student/recommend`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 2. Predict Registrations
const predictRegistrations = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_1}/organizer/predict-registrations`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 3. Event Demand
const eventDemand = async () => {
  const response = await axios.get(
    `${ML_API_URL_1}/organizer/event-demand`
  );

  return response.data;
};

// 4. Organizer Analytics
const organizerAnalytics = async () => {
  const response = await axios.get(
    `${ML_API_URL_1}/organizer/analytics`
  );

  return response.data;
};

// 5. Event Risk
const eventRisk = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_1}/admin/event-risk`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 6. Get Domains
const getDomains = async () => {
  const response = await axios.get(
    `${ML_API_URL_2}/domains`
  );

  return response.data;
};

// 7. Categorize Domain
const categorizeDomain = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_2}/categorize`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 8. Sentiment Analysis
const analyzeSentiment = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_2}/sentiment`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 9. Batch Sentiment Analysis
const analyzeSentimentBatch = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_2}/sentiment/batch`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// 10. AI Chatbot (Gemini Assistant)
const chat = async (data) => {
  const response = await axios.post(
    `${ML_API_URL_1}/chat`,
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
  analyzeSentimentBatch,
  chat
};