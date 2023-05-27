import axios from "axios";

export async function getUserNFTs(publicKey) {
	if (!publicKey) {
		return [];
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}
	const response = await axios.get(
		`${import.meta.env.VITE_API}/nfts/${publicKey}`
	);
	return response.data;
}

export async function getMetadata(uri) {
	const response = await axios.get(uri);
	return response.data;
}

export async function getUser(publicKey) {
	if (!publicKey) {
		return [];
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}
	const response = await axios.get(
		`${import.meta.env.VITE_API}/user/${publicKey}`
	);
	return response.data;
}

export async function getUserHistory(publicKey, page) {
	if (!publicKey) {
		return [];
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}
	const response = await axios.get(
		`${import.meta.env.VITE_API}/user/history/${publicKey}?page=${page}`
	);
	return { ...response.data, page };
}

export async function changeAbout(publicKey, about) {
	if (!publicKey) {
		return [];
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}
	const response = await axios.post(
		`${import.meta.env.VITE_API}/user/about/change${publicKey}`,
		{
			about: about,
		}
	);
	return response.data;
}

export async function changeBanner(publicKey, banner) {
	if (!publicKey) {
		return [];
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}
	const response = await axios.post(
		`${import.meta.env.VITE_API}/user/banner/change/${publicKey}`,
		{
			banner: banner,
		}
	);
	return response.data;
}
