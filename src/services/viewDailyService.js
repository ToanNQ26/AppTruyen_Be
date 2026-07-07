import StoryViewDaily from "../model/StoryViewDaily.js";
import Story from "../model/Story.js";

export async function increaseView(storyId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Promise.all([
    Story.findByIdAndUpdate(
      storyId,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    ),

    StoryViewDaily.findOneAndUpdate(
      {
        storyId,
        date: today,
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ),
  ]);
}

export async function getTopDaily(limit = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return StoryViewDaily.aggregate([
    {
      $match: {
        date: today,
      },
    },
    {
      $sort: {
        views: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "stories",
        localField: "storyId",
        foreignField: "_id",
        as: "story",
      },
    },
    {
      $unwind: "$story",
    },
    {
       $replaceRoot: {
        newRoot: "$story"
      }
    },
  ]);
}

export async function getTopWeekly(limit = 10) {
  const now = new Date();

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  return StoryViewDaily.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },

    {
      $group: {
        _id: "$storyId",
        viewsmonth: { $sum: "$views" }
      }
    },

    {
      $lookup: {
        from: "stories",
        localField: "_id",
        foreignField: "_id",
        as: "story"
      }
    },

    { $unwind: "$story" },

    // 👉 giữ views + story cùng tồn tại
    {
      $project: {
        _id: "$story._id",
        title: "$story.title",
        slug: "$story.slug",
        author: "$story.author",
        coverUrl: "$story.coverUrl",
        storyType: "$story.storyType",
        viewsmonth: 1,
        views: "$story.views",
        followersCount: "$story.followersCount",
        description: "$story.description",
      }
    },

    // 👉 sort theo MONTHLY views (vẫn là views của group)
    {
      $sort: {
        viewsmonth: -1,
      }
    },

    {
      $limit: limit
    }
  ]);
}

export async function getTopMonthly(limit = 10) {
  const now = new Date();

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  return StoryViewDaily.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },

    {
      $group: {
        _id: "$storyId",
        viewsmonth: { $sum: "$views" }
      }
    },

    {
      $lookup: {
        from: "stories",
        localField: "_id",
        foreignField: "_id",
        as: "story"
      }
    },

    { $unwind: "$story" },

    // 👉 giữ views + story cùng tồn tại
    {
      $project: {
        _id: "$story._id",
        title: "$story.title",
        slug: "$story.slug",
        author: "$story.author",
        coverUrl: "$story.coverUrl",
        storyType: "$story.storyType",
        viewsmonth: 1,
        views: "$story.views",
        followersCount: "$story.followersCount",
        description: "$story.description",
      }
    },

    // 👉 sort theo MONTHLY views (vẫn là views của group)
    {
      $sort: {
        viewsmonth: -1,
      }
    },

    {
      $limit: limit
    }
  ]);
}