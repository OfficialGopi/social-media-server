import { Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  gmail: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  bio: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  websites: string[];

  refreshToken: String;

  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;

  createdOn: Date;
  updatedOn: Date;
}

interface IPreviousCredentialsOfUsers extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  previousThreeUsernames: [string, string, string];
  previousThreePasswords: [string, string, string];

  createdOn: Date;
  updatedOn: Date;
}

interface IAccountDetails extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  private: boolean;

  createdOn: Date;
  updatedOn: Date;
}

interface IPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  attachments: [string];
  caption: string;
  isReel: boolean;
  shareCount: number;

  createdOn: Date;
  updatedOn: Date;
}

interface ILikesOnPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;

  createdOn: Date;
  updatedOn: Date;
}

interface ICommentsOnPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  comment: string;
  isReply: boolean;
  replyOnCommentId: Types.ObjectId;

  createdOn: Date;
  updatedOn: Date;
}

interface ISearchHistory extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  searchHistory: string[];

  createdOn: Date;
  updatedOn: Date;
}

interface IInbox extends Document {}

interface IChat extends Document {
  _id: Types.ObjectId;
  isGroup: boolean;
  groupName: string;
  groupDescription: string;
  groupAdmin: Types.ObjectId;
  members: Types.ObjectId[];
  avatar: string;

  createdOn: Date;
  updatedOn: Date;
}

interface IChatMessages extends Document {
  _id: Types.ObjectId;
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;
  attachments: string[];
  deletedForEveryone: boolean;

  createdOn: Date;
  updatedOn: Date;
}

interface ICallDetails extends Document {
  _id: Types.ObjectId;
  chat: Types.ObjectId;
  calling: Types.ObjectId;
  receiving: Types.ObjectId;

  createdOn: Date;
  updatedOn: Date;
}

interface ICallHistory extends Document {
  _id: Types.ObjectId;
  call: Types.ObjectId;
  duration: number;
  isVideoCall: boolean;

  createdOn: Date;
  updatedOn: Date;
}

export {
  IUser,
  IPreviousCredentialsOfUsers,
  IAccountDetails,
  IPosts,
  ILikesOnPosts,
  ICommentsOnPosts,
  ISearchHistory,
  IChat,
  IChatMembers,
  IChatMessages,
  ICallDetails,
  ICallHistory,
};
