import axios from "axios";

const getProducer = async (producer, page) => {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${api_url}/producer/${producer}?page=${page}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getProducer;
