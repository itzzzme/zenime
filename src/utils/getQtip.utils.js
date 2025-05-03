import axios from "axios";

const getQtip = async (id) => {
  try {
    let workerUrls = import.meta.env.VITE_WORKER_URL?.split(",");
    let baseUrl = workerUrls?.length
      ? workerUrls[Math.floor(Math.random() * workerUrls.length)]
      : import.meta.env.VITE_API_URL;
    if (!baseUrl) throw new Error("No API endpoint defined.");
    const response = await axios.get(`${baseUrl}/qtip/${id.split("-").pop()}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return null; 
  }
};

export default getQtip;
