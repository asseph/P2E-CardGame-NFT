import axios from "axios";

export async function getStats() {
	const response = await axios.get(
		`${import.meta.env.VITE_API}/leaderboards`
	);
	return response.data;
}
