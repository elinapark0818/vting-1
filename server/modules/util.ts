export const util = {
  success: (status: any, message: string, data: any) => {
    return {
      status: status,
      success: true,
      message: message,
      data: data,
    };
  },
  fail: (status: any, message: string) => {
    return {
      status: status,
      success: false,
      message: message,
    };
  },
};
