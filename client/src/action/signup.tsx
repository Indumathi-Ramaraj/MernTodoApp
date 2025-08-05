import Endpoints from "../api/Endpoints";
import axiosInstance from "../network";
export const signup = async (
  name: string,
  email: string,
  countryCode: string,
  phoneNumber: string,
  password: string,
) => {
  const res = await axiosInstance.post(Endpoints.SIGN_UP, {
    name,
    email,
    phoneNumber: countryCode + phoneNumber,
    password,
  });
  return res.data;
};
