import axios from "axios";

const getCategoryInfo = async (path,page) => {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${api_url}/${path}?page=${page}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getCategoryInfo;
