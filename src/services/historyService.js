import History from '../model/History.js';

export const getAllHistories = async (userId) => {
  return await History.find({ user: userId })
    .populate('story', 'title coverUrl')
    .populate('chapter', 'title chapterNumber')
    .sort({ lastReadAt: -1 });
};

export const getHistoryById = async (id) => {
  return await History.findById(id)
    .populate('story', 'title')
    .populate('chapter', 'title');
};

export const createHistory = async (data) => {
  const { user, story, chapter } = data;
  return await History.create({ user, story, chapter });
};

export const updateHistory = async (id, data) => {
  return await History.findByIdAndUpdate(id, data, { new: true });
};

export const updateOrCreateHistory = async (user, story, chapter) => {
  return await History.findOneAndUpdate(
    { user, story },
    { chapter, lastReadAt: Date.now() },
    { new: true, upsert: true }
  );
};

export const deleteHistory = async (id) => {
  return await History.findByIdAndDelete(id);
};

export const deleteAllHistoriesOfUser = async (userId) => {
  return await History.deleteMany({ user: userId });
};
