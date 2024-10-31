import axios from "axios";

const getQtip = async (id) => {
  const total_workers = parseInt(import.meta.env.VITE_TOTAL_WORKER_URL, 10);
  const worker_url = import.meta.env.VITE_WORKER_URL.split(",");
  try {
    const response = await axios.get(
      `${worker_url[Math.floor(Math.random() * total_workers)]}/qtip/${id
        .split("-")
        .pop()}`
    );
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getQtip;
