import axios from "axios";

export interface PostAPI {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPosts = async (): Promise<PostAPI[]> => {
  const response = await axios.get(`${API_URL}/posts`);

  return response.data;
};

export const fetchPost = async (id: string): Promise<PostAPI> => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (
  title: string,
  content: string,
  authorName: string
): Promise<PostAPI> => {
  const response = await axios.post(`${API_URL}/posts`, {
    title,
    content,
    authorName,
  });
  return response.data;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string
): Promise<PostAPI> => {
  const response = await axios.put(`${API_URL}/posts/${id}`, {
    title,
    content,
  });
  return response.data;
};

export const deletePost = async (postId: number) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
