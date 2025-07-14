import Endpoints from "../api/Endpoints";
import axiosInstance from "../network";

export const getTodo = async (userId: string) => {
  let res = await axiosInstance.get(Endpoints.TODO(userId));
  return res.data;
};

export const postTodo = async (userId: string, toDoList: object) => {
  let res = await axiosInstance.post(Endpoints.TODO(userId), { toDoList });
  return res.data;
};

export const updateTodo = async (
  userId: string,
  { id, done }: { id: number; done: boolean }
) => {
  let res = await axiosInstance.put(Endpoints.TODO(userId), { id, done });
  return res;
};

export const deleteTodo = async (userId: string, id: number) => {
  let res = await axiosInstance.delete(Endpoints.TODO(userId), {
    data: { id },
  });
  return res;
};
