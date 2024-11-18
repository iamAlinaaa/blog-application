import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  PostAPI,
  fetchPosts,
  fetchPost,
  createPost,
  updatePost,
  deletePost,
} from "@/app/api/postsAPI";

interface PostsState {
  posts: PostAPI[];
  loading: boolean;
  error: string | null;
  currentPost: PostAPI | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

export const fetchPostsAsync = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await fetchPosts();
    return response;
  }
);

export const fetchPostAsync = createAsyncThunk(
  "posts/fetchPost",
  async (id: string) => {
    const response = await fetchPost(id);
    return response;
  }
);

export const addPostAsync = createAsyncThunk(
  "posts/addPost",
  async (postData: { title: string; content: string; authorName: string }) => {
    const response = await createPost(
      postData.title,
      postData.content,
      postData.authorName
    );
    return response;
  }
);

export const updatePostAsync = createAsyncThunk(
  "posts/updatePost",
  async (postData: PostAPI) => {
    const response = await updatePost(
      postData.id,
      postData.title,
      postData.content
    );
    return response;
  }
);

export const deletePostAsync = createAsyncThunk(
  "posts/deletePost",
  async (id: number) => {
    await deletePost(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchPostsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPostsAsync.fulfilled,
        (state, action: PayloadAction<PostAPI[]>) => {
          state.posts = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPostsAsync.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch posts";
        state.loading = false;
      })

      .addCase(fetchPostAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPostAsync.fulfilled,
        (state, action: PayloadAction<PostAPI>) => {
          const existingPostIndex = state.posts.findIndex(
            (post) => post.id === action.payload.id
          );
          if (existingPostIndex !== -1) {
            state.posts[existingPostIndex] = action.payload;
          } else {
            state.posts.push(action.payload);
          }
          state.currentPost = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPostAsync.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch the post";
        state.loading = false;
      })

      .addCase(
        addPostAsync.fulfilled,
        (state, action: PayloadAction<PostAPI>) => {
          state.posts.push(action.payload);
        }
      )
      .addCase(addPostAsync.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to add a post";
      })

      .addCase(
        updatePostAsync.fulfilled,
        (state, action: PayloadAction<PostAPI>) => {
          const index = state.posts.findIndex(
            (post) => post.id === action.payload.id
          );
          if (index !== -1) {
            state.posts[index] = action.payload;
          }
        }
      )
      .addCase(updatePostAsync.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to update the post";
      })

      .addCase(
        deletePostAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.posts = state.posts.filter(
            (post) => post.id !== action.payload
          );
        }
      )
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to delete the post";
      });
  },
});

export const postsReducer = postsSlice.reducer;
