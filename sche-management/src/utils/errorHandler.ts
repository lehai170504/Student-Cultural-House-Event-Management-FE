export const getErrorMessage = (err: any, fallback = "Đã xảy ra lỗi") => {
  return err?.response?.data?.message || err?.message || fallback;
};
