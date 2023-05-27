export const calculateUserValue = (room, publicKey) => {
	if (!room || !room.session || !room.session.users) {
		return 0;
	}

	if (publicKey && typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}

	for (const user of room.session.users) {
		if (user.publicKey == publicKey) {
			return user.value;
		}
	}

	return 0;
};

export const calculateUserAssets = (room, publicKey) => {
	if (!room || !room.session || !room.session.users) {
		return [];
	}

	if (publicKey && typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}

	for (const user of room.session.users) {
		if (user.publicKey == publicKey) {
			return user.assets;
		}
	}

	return [];
};

export const calculateAssetsValue = (assets) => {
	if (!assets || assets.length === 0) {
		return 0;
	}
	return assets.reduce((a, asset) => {
		if (asset.price) {
			return a + asset.price;
		}
		return a;
	}, 0);
};

export const calculateSessionValue = (session) => {
	if (!session || !session.users || session.users.length === 0) {
		return 0;
	}

	return session.users.reduce((a, user) => {
		return (
			a +
			user.assets.reduce((b, asset) => {
				if (asset.price && asset.price != NaN) {
					return b + asset.price;
				}
				return b;
			}, 0)
		);
	}, 0);
};
