export default {
  SIGN_UP: `/signup`,
  LOGIN: `/login`,
  TODO: (userId: string) => `/todo?userId=${userId}`,
  GPT: `/query-task`,
};
