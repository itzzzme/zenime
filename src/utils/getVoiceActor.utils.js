import axios from "axios";

export default async function fetchVoiceActorInfo(id, page) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${api_url}/character/list/${id}?page=${page}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return error;
  }
}
