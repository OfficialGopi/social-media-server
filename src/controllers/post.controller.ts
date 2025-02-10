import {
  badRequestErrorClient,
  notFoundErrorClient,
  okSuccess,
  resourceCreatedSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { IUser } from "../interfaces/models.js";
import { CommentsOnPostsModel } from "../models/commentsOnPosts.model.js";
import { FollowersModel } from "../models/followers.model.js";
import { LikesOnPostsModel } from "../models/likesOnPosts.model.js";
import { PostsModel } from "../models/posts.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

//createPost
const createPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    caption = "",
  }: {
    caption: string;
  } = req.body;

  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(unauthorizedErrorClient, "File not found");
  }

  const posts: string[] = [];

  for (const file of files) {
    const savedOnCloudinary = await uploadOnCloudinary(file.path);

    if (!savedOnCloudinary) {
      throw new ApiError(unauthorizedErrorClient, "Error on uploading file");
    }

    posts.push(savedOnCloudinary.url);
  }

  const post = await PostsModel.create({
    user: user._id,
    attachments: posts,
    caption,
  });

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(resourceCreatedSuccess, post, "Post created successfully")
    );
});

//editPost
const editPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;
  const {
    post,
  }: {
    post?: string;
  } = req.params;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const postFound = await PostsModel.findOne({
    _id: post,
    user: user._id,
  });

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const {
    caption,
  }: {
    caption: string;
  } = req.body;

  postFound.caption = caption;

  const editedPost = await postFound.save();

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        editedPost,
        "Post deleted successfully"
      )
    );
});

//deletePost
const deletePost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;
  const {
    post,
  }: {
    post?: string;
  } = req.params;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const postFound = await PostsModel.findOne({
    _id: post,
    user: user._id,
  });

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  await postFound.deleteOne();

  const comments = await CommentsOnPostsModel.find({
    post: postFound._id,
  });

  for (const comment of comments) {
    await comment.deleteOne();
  }

  const likes = await LikesOnPostsModel.find({
    post: postFound._id,
  });

  for (const like of likes) {
    await like.deleteOne();
  }

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(resourceCreatedSuccess, {}, "Post deleted successfully")
    );
});

// like post
const likePost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
  }: {
    post?: string;
  } = req.params;

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const isLiked = await LikesOnPostsModel.findOne({
    post: postFound._id,
    user: user._id,
  });

  if (isLiked) {
    await isLiked.deleteOne();
  } else {
    await LikesOnPostsModel.create({
      post: postFound._id,
      user: user._id,
    });
  }

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        {},
        "Post liked or removed like successfully"
      )
    );
});

// unlike post
const unlikePost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
  }: {
    post?: string;
  } = req.params;

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const isLiked = await LikesOnPostsModel.findOne({
    post: postFound._id,
    user: user._id,
  });

  if (isLiked) {
    await isLiked.deleteOne();
  } else {
    await LikesOnPostsModel.create({
      post: postFound._id,
      user: user._id,
    });
  }

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        {},
        "Post liked or removed like successfully"
      )
    );
});

//share post
const sharePost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
  }: {
    post?: string;
  } = req.params;

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  postFound.shareCount += 1;

  await postFound.save();

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(resourceCreatedSuccess, {}, "Post shared successfully")
    );
});

//comment on post
const commentOnPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
  }: {
    post?: string;
  } = req.params;

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const {
    comment,
  }: {
    comment: string;
  } = req.body;

  const savedComment = await CommentsOnPostsModel.create({
    post: postFound._id,
    user: user._id,
    comment,
  });

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        savedComment,
        "Commented on post successfully"
      )
    );
});

//reply on comment on post
const replyOnCommentOnPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
    commentId,
  }: {
    post?: string;
    commentId?: string;
  } = req.params;

  if (!post || !commentId) {
    throw new ApiError(unauthorizedErrorClient, "Post or comment not found");
  }

  const {
    comment,
  }: {
    comment: string;
  } = req.body;

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const commentFound = await CommentsOnPostsModel.findById(commentId);

  if (!commentFound) {
    throw new ApiError(unauthorizedErrorClient, "Comment not found");
  }

  if (commentFound.isReply) {
    throw new ApiError(unauthorizedErrorClient, "Cannot reply on a reply");
  }

  const savedReply = await CommentsOnPostsModel.create({
    comment,
    isReply: true,
    post: postFound._id,
    user: user._id,
    replyOnCommentId: commentFound._id,
  });

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        savedReply,
        "Replied on comment successfully"
      )
    );
});

//delete comment on post
const deleteCommentOnPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
    commentId,
  }: {
    post?: string;
    commentId?: string;
  } = req.params;

  if (!post || !commentId) {
    throw new ApiError(unauthorizedErrorClient, "Post or comment not found");
  }

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const commentFound = await CommentsOnPostsModel.findById(commentId);

  if (!commentFound) {
    throw new ApiError(unauthorizedErrorClient, "Comment not found");
  }

  if (
    user._id.toString() !== commentFound.user.toString() ||
    user._id.toString() !== postFound.user.toString()
  ) {
    throw new ApiError(
      unauthorizedErrorClient,
      "You are not allowed to delete this comment"
    );
  }

  await commentFound.deleteOne();

  const comments = await CommentsOnPostsModel.find({
    post: postFound._id,
    replyOnCommentId: commentFound._id,
  });

  for (const comment of comments) {
    await comment.deleteOne();
  }

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        {},
        "Comment deleted successfully"
      )
    );
});

//delete reply on comment on post
const deleteReplyOnCommentOnPost = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    post,
    commentId,
  }: {
    post?: string;
    commentId?: string;
  } = req.params;

  if (!post || !commentId) {
    throw new ApiError(unauthorizedErrorClient, "Post or comment not found");
  }

  const postFound = await PostsModel.findById(post);

  if (!postFound) {
    throw new ApiError(unauthorizedErrorClient, "Post not found");
  }

  const commentFound = await CommentsOnPostsModel.findById(commentId);

  if (!commentFound) {
    throw new ApiError(unauthorizedErrorClient, "Comment not found");
  }

  if (
    user._id.toString() !== commentFound.user.toString() ||
    user._id.toString() !== postFound.user.toString()
  ) {
    throw new ApiError(
      unauthorizedErrorClient,
      "You are not allowed to delete this reply"
    );
  }

  await commentFound.deleteOne();

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(resourceCreatedSuccess, {}, "Reply deleted successfully")
    );
});

//get my posts
const getMyPosts = TryCatch(async (req, res, next) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const posts = await PostsModel.find({ user: user._id });

  res
    .status(okSuccess)
    .json(new ApiResponse(okSuccess, posts, "Posts retrieved successfully"));
});

//get others posts
const getOthersPosts = TryCatch(async (req, res, next) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const {
    userId,
  }: {
    userId?: string;
  } = req.params;

  if (!userId) {
    throw new ApiError(
      badRequestErrorClient,
      "User ID is required to retrieve posts"
    );
  }

  const other = await UserModel.findById(userId);

  if (!other) {
    throw new ApiError(notFoundErrorClient, "User not found");
  }

  const isFollowedByUser = await FollowersModel.findOne({
    follower: user._id,
    following: other._id,
  });

  if (other.isPrivate && !isFollowedByUser) {
    throw new ApiError(
      badRequestErrorClient,
      "You are not allowed to view this user"
    );
  }

  const posts = await PostsModel.find({ user: userId });

  res
    .status(200)
    .json(new ApiResponse(okSuccess, posts, "Posts retrieved successfully"));
});

export {
  createPost,
  deletePost,
  editPost,
  likePost,
  unlikePost,
  sharePost,
  commentOnPost,
  replyOnCommentOnPost,
  deleteCommentOnPost,
  deleteReplyOnCommentOnPost,
  getMyPosts,
  getOthersPosts,
};
