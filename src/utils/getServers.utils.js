import axios from "axios";

export default async function getServers(animeId, episodeId) {
  try {
    const api_url = import.meta.env.VITE_API_URL;
    const response = await axios.get(
      `${api_url}/servers/${animeId}?ep=${episodeId}`
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
}
