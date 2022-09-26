const ReviewModel = require("../models/ReviewModel");
module.exports.GetRattings = async (id) => {
  const review = await ReviewModel.find({ receiver: id });
  if (review.length > 0) {
    var totalRatings = review.reduce((sum, review) => sum + review.ratings, 0);
    // console.log("uesr rattings", Math.round(totalRatings / review.length));
    return Math.round(totalRatings / review.length);
  } else {
    return 1;
  }
};
