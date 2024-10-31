import axios from "axios";

const getSearch = async (keyword) => {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${api_url}/search?keyword=${keyword}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getSearch;
