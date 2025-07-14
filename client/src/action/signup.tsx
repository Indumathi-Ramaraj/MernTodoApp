import Endpoints from "../api/Endpoints";
import axiosInstance from "../network";
export const signup = async (name: string, email: string, password: string) => {
  let res = await axiosInstance.post(Endpoints.SIGN_UP, {
    name,
    email,
    password,
  });
  return res.data;
};
