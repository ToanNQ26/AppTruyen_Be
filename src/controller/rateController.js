import * as rateService from "../services/rateService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const Rating = async (req, res) => {
  const { storyId, score } = req.body;
  const userid = req.user.id;

  console.log(storyId);
  const rated = await rateService.createRating(userid, storyId, score);
  res.json(
    new ApiResponse({
      message: "Rated",
      result: rated,
    })
  );
};

export const updateRated = async (req, res) => {
  const { storyId, score } = req.body;
  const userid = req.user.id;

  const ratingUpdate = await rateService.updateRating(userid, storyId, score);
  res.json(
    new ApiResponse({
      message: "Updated rating!",
      result: ratingUpdate,
    })
  );
};

export const deleteRated = async (req, res) => {
  const storyId = req.params.storyId;
  const userid = req.user.id;

  console.log("HHHHHHHHHHHH: ",storyId);
  const ratedDelete = await rateService.deleteRating(userid, storyId);
  res.json(
    new ApiResponse({
      message: "Delete rated Succcessfully!",
      result: ratedDelete,
    })
  );
};
