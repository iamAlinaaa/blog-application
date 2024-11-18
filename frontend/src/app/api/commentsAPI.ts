import axios from "axios";

export interface CommentAPI {
  id: number;
  postId: number;
  content: string;
  authorName: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchComments = async (postId: number): Promise<CommentAPI[]> => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (
  postId: number,
  content: string,
  authorName: string
): Promise<CommentAPI> => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
    content,
    authorName,
    createdAt: new Date().toISOString(),
  });

  return response.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/comments/${id}`);
};
