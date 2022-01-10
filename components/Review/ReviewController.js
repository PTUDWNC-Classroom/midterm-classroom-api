const reviewService = require("./ReviewService")

exports.sendMessage = async (req, res, next) => {
    const info = req.body;

    const result = reviewService.handleMessage(info)

    res.json(result);   
}