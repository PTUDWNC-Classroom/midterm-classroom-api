const reviewService = require("./ReviewService")

exports.sendMessage = async (req, res, next) => {
    const info = req.body;

    reviewService.handleMessage(info)

    res.json("hello");   
}