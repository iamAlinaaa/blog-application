import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchComments, createComment } from "@/app/api/commentsAPI";
import { CommentAPI } from "@/app/api/commentsAPI";
import { AxiosError } from "axios";

interface CommentsState {
  comments: CommentAPI[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchCommentsAsync = createAsyncThunk(
  "comments/fetchComments",
  async (postId: number, { rejectWithValue }) => {
    try {
      const comments = await fetchComments(postId);
      return comments;
    } catch (error: unknown) {
      console.error("Error in fetchCommentsAsync:", error);
      return rejectWithValue("Error fetching comments");
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  "comments/addComment",
  async (
    newComment: { postId: number; content: string; authorName: string },
    { rejectWithValue }
  ) => {
    try {
      const { postId, content, authorName } = newComment;
      const comment = await createComment(postId, content, authorName);
      return comment;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Error adding comment"
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchCommentsSuccess: (state, action: PayloadAction<CommentAPI[]>) => {
      state.comments = action.payload;
      state.loading = false;
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCommentsAsync.fulfilled,
        (state, action: PayloadAction<CommentAPI[]>) => {
          state.comments = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || "Error fetching comments";
        state.loading = false;
      })
      .addCase(addCommentAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addCommentAsync.fulfilled,
        (state, action: PayloadAction<CommentAPI>) => {
          state.comments.push(action.payload);
          state.loading = false;
        }
      )
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || "Error adding comment";
        state.loading = false;
      });
  },
});

export const { fetchCommentsSuccess, fetchCommentsFailure } =
  commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;
