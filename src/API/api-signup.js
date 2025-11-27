import axios from "axios";

// đổi URL này thành URL của bạn từ MockAPI
const API_URL = "https://6927c926b35b4ffc501312d5.mockapi.io/users";

export function registerUser(data) {
  return axios.post(API_URL, data);
}
export default registerUser;
