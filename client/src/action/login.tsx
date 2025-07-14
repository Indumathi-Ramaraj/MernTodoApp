import Endpoints from "../api/Endpoints";
import axiosInstance from "../network";
import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  let res = await axiosInstance.post(Endpoints.LOGIN, {
    email,
    password,
  });
  Cookies.set("token", JSON.stringify(res.data.user.token));
  Cookies.set("user", JSON.stringify(res.data.user));
  return res.data;
};
