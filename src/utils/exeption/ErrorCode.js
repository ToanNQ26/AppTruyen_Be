// utils/ErrorCode.js

export const ErrorCode = {
  UNICATEGORIZED_EXCEPTION: { code: 9999, httpStatus: 500, message: "Uncategorized exception!" },

  USERNAME_INVALID: { code: 1001, httpStatus: 400, message: "Username must be between 3 and 12 characters" },
  PASSWORD_INVALID: { code: 1002, httpStatus: 400, message: "Password must be at least 8 characters" },
  INVALID_KEY: { code: 1003, httpStatus: 400, message: "Invalid key!" },
  EMPTY_FIELD: { code: 1004, httpStatus: 400, message: "This field cannot be empty" },

  UNAUTHENTICATED: { code: 1100, httpStatus: 401, message: "Unauthenticated" },
  PASSWORD_INCORRECT: { code: 1101, httpStatus: 401, message: "Password incorrect!" },
  TOKEN_EXPIRED: { code: 1102, httpStatus: 401, message: "Token has expired" },

  FORBIDDEN: { code: 1200, httpStatus: 403, message: "Forbidden" },

  USER_NOT_EXISTED: { code: 1300, httpStatus: 404, message: "User not existed!" },
  USER_NOT_EXISTED_IN_GROUP: { code: 1301, httpStatus: 404, message: "User not existed in group!" },
  STORY_NOT_EXISTED: { code: 1302, httpStatus: 404, message: "Story not existed!" },
  CHAPTER_NOT_EXISTED: { code: 1303, httpStatus: 404, message: "Chapter not existed!" },
  CHAPTER_NOT_FOUND: { code: 1304, httpStatus: 404, message: "Chapter not found!" },
  FOLLOW_NOT_FOUND: { code: 1305, httpStatus: 404, message: "Follow not found!" },
  USER_HAS_NOT_PREVIOUSLY_RATED_THIS: { code: 1306, httpStatus: 404, message: "User has not previously rated this"},

  USER_EXISTED: { code: 1400, httpStatus: 409, message: "User existed!" },
  ALREADY_IN_FAVORITES: { code: 1401, httpStatus: 409, message: "Already in favorites!" },
  ALREADY_RATED_THIS_STORY: { code: 1402, httpStatus: 409, message: "Already rated this story" },
  FOLLOW_ALREADY_EXISTS: { code: 1403, httpStatus: 409, message: "Follow already exists!" },

   
};