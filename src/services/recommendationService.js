const axios = require("axios");

const getRecommendations = async (user) => {
    try {
        const response = await axios.post(
            `${process.env.ML_API_URL}/recommend`,
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

        throw new Error("Failed to get recommendations");
    }
};

module.exports = {
    getRecommendations
};
