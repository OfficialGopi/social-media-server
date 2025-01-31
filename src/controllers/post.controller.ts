import {
  resourceCreatedSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { IUser } from "../interfaces/models.js";
import { CommentsOnPostsModel } from "../models/commentsOnPosts.model.js";
import { LikesOnPostsModel } from "../models/likesOnPosts.model.js";
import { PostsModel } from "../models/posts.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

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

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(resourceCreatedSuccess, {}, "Post deleted successfully")
    );
});

const toogleLikePost = TryCatch(async (req, res, _) => {
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

const replyOnComment = TryCatch(async (req, res, _) => {
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

export {
  createPost,
  deletePost,
  editPost,
  toogleLikePost,
  sharePost,
  commentOnPost,
  replyOnComment,
};
