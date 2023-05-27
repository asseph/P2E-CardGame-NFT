import axios from "axios";

export async function getRoom(id) {
	if (!id) {
		return null;
	}
	const response = await axios.get(`${import.meta.env.VITE_API}/room/${id}`);
	return response.data;
}

export async function getRooms(sort) {
	const response = await axios.get(
		`${import.meta.env.VITE_API}/rooms/explore?sort=${sort}`
	);
	return response.data;
}

export async function getHistory(id) {
	const response = await axios.get(
		`${import.meta.env.VITE_API}/room/${id}/history`
	);
	return response.data;
}
