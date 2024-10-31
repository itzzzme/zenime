import axios from "axios";

export default async function getStreamInfo(id) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(`${api_url}/stream?id=${id}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching stream info:", error);
    return error;
  }
}
