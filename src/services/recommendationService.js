const axios = require("axios");

const getRecommendations = async (user) => {
    try {
        const response = await axios.post(
            `${process.env.ML_API_URL_1 || process.env.ML_API_URL}/student/recommend`,
            {
                domain: user.domain,
                skills: Array.isArray(user.skills)
                    ? user.skills.join(", ")
                    : user.skills,
                year: user.year,
                branch: user.branch,
                mode: user.mode || "Any",
                top_n: 10
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "ML API Error:",
            error.response?.data || error.message
        );

        const err = new Error("Failed to get recommendations");
        err.statusCode = 500;
        throw err;
    }
};

module.exports = {
    getRecommendations
};
