// utils/ErrorCode.js
export const ErrorCode = {
  UNICATEGORIZED_EXCEPTION: { code: 9999, message: 'Uncategorized exception!' },
  USER_NOT_EXISTED: { code: 1001, message: 'User not existed!' },
  USERNAME_INVALID: { code: 1002, message: 'Username must be between 3 and 12 characters' },
  PASSWORD_INVALID: { code: 1003, message: 'Password must be at least 8 characters' },
  USER_EXISTED: { code: 1004, message: 'User existed!' },
  UNAUTHENTICATED: { code: 1005, message: 'Unauthenticated' },
  INVALID_KEY: { code: 1006, message: 'Invalid key!' },
  EMPTY_FIELD: { code: 1008, message: 'This field cannot be empty' },
  USER_NOT_EXISTED_IN_GROUP: { code: 1009, message: 'User not existed in group!' },
  STORY_NOT_EXISTED: {code:1010,message:'Story not existed!'},
  ALREADY_IN_FAVORITES: {code: 1100,message:'Already in favorites!'},
  CHAPTER_NOT_EXISTED: {code:1200,message:'Chapter not existed!'},
  TOKEN_EXPIRED: { code: 401, message: "Token has expired" },

  
  USER_HAS_NOT_PREVIOUSLY_RATED_THIS: {code: 1200,message:'User has not previously rated this'},
  ALREADY_RATED_THIS_STORY: {code: 1201,message: 'Already rated this story'},
  // ... các mã lỗi khác
};
