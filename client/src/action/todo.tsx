import Endpoints from "../api/Endpoints";
import axiosInstance from "../network";

export const getTodo = async (userId: string) => {
  let res = await axiosInstance.get(Endpoints.TODO(userId));
  return res.data;
};

export const postTodo = async (
  userId: string,
  whatsapp: boolean,
  emailOption: boolean,
  telegram: boolean,
  email: string,
  phoneNumber: number,
  toDoList: object
) => {
  let res = await axiosInstance.post(Endpoints.TODO(userId), {
    whatsappOptIn: whatsapp,
    emailOptIn: emailOption,
    telegramOptIn: telegram,
    email: email,
    phoneNumber,
    toDoList,
  });
  return res.data;
};

export const updateTodo = async (
  userId: string,
  whatsapp: boolean,
  emailOption: boolean,
  email: string,
  phoneNumber: number,
  { id, done }: { id: number; done: boolean }
) => {
  let res = await axiosInstance.put(Endpoints.TODO(userId), {
    whatsappOptIn: whatsapp,
    emailOptIn: emailOption,
    email: email,
    phoneNumber,
    id,
    done,
  });
  return res;
};

export const deleteTodo = async (
  userId: string,
  whatsapp: boolean,
  emailOption: boolean,
  email: string,
  phoneNumber: number,
  id: number
) => {
  let res = await axiosInstance.delete(Endpoints.TODO(userId), {
    data: {
      id,
      whatsappOptIn: whatsapp,
      emailOptIn: emailOption,
      email: email,
      phoneNumber,
    },
  });
  return res;
};
