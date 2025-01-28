import { model, Schema } from "mongoose";
import { ISearchHistory } from "../interfaces/models.js";

const searchHistorySchema = new Schema<ISearchHistory>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  searchHistory: {
    type: [String],
    default: [],
  },
});

export const SearchHistoryModel = model<ISearchHistory>(
  "searchhistory",
  searchHistorySchema
);
