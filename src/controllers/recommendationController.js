const {
    getRecommendations
} = require("../services/recommendationService");

const recommend = async (req, res) => {
    try {
        const recommendations = await getRecommendations(req.body);

        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error("Recommendation Controller Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    recommend
};