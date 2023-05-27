import { web3 } from "@project-serum/anchor";

export async function getBalance(connection, publicKey) {
	if (!publicKey) {
		return 0;
	}
	if (typeof publicKey.toBase58 === "function") {
		publicKey = publicKey.toBase58();
	}

	const response = await connection.getBalance(new web3.PublicKey(publicKey));
	return response;
}
