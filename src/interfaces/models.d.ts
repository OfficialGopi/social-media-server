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
  isPrivate: boolean;
  profilePic: string;

  refreshToken: String;

  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;

  createdAt: Date;
  updatedAt: Date;
}

interface IPreviousCredentialsOfUsers extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  previousThreeUsernames: [string, string, string];
  previousThreePasswords: [string, string, string];

  createdAt: Date;
  updatedAt: Date;
}

interface IPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  attachments: [string];
  caption: string;
  isReel: boolean;
  shareCount: number;

  createdAt: Date;
  updatedAt: Date;
}

interface ILikesOnPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

interface ICommentsOnPosts extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  comment: string;
  isReply: boolean;
  replyOnCommentId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

interface IFollowers extends Document {
  _id: Types.ObjectId;
  follower: Types.ObjectId;
  following: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

interface ISearchHistory extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  searchHistory: string[];

  createdAt: Date;
  updatedAt: Date;
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

  createdAt: Date;
  updatedAt: Date;
}

interface IChatMessages extends Document {
  _id: Types.ObjectId;
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;
  attachments: string[];
  deletedForEveryone: boolean;
  deletedForWhom: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

interface ICallDetails extends Document {
  _id: Types.ObjectId;
  chat: Types.ObjectId;
  calling: Types.ObjectId;
  receiving: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

interface ICallHistory extends Document {
  _id: Types.ObjectId;
  call: Types.ObjectId;
  duration: number;
  isVideoCall: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export {
  IUser,
  IPreviousCredentialsOfUsers,
  IAccountDetails,
  IPosts,
  ILikesOnPosts,
  ICommentsOnPosts,
  IFollowers,
  ISearchHistory,
  IChat,
  IChatMembers,
  IChatMessages,
  ICallDetails,
  ICallHistory,
};
