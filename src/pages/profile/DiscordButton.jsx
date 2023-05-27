import { useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";
import React from "react";
import { DiscordIcon } from "../../components/CustomIcons";

const DiscordButton = () => {
	const wallet = useWallet();

	const connect = async () => {
		if (!wallet.publicKey) {
			return;
		}

		try {
			const data = new TextEncoder().encode(
				`solanashuffle discord ${wallet.publicKey.toBase58()}`
			);
			const signatureBytes = await wallet.signMessage(data);
			const signature = base58.encode(signatureBytes);

			let url = new URL(`${import.meta.env.VITE_API}/discord/redirect`);
			url.searchParams.append("publicKey", wallet.publicKey.toBase58());
			url.searchParams.append("signature", signature);
			url.searchParams.append("originalURL", window.location.href);
			console.log(url.toString());
			window.location.href = url.toString();
		} catch {}
	};

	return (
		<button
			onClick={connect}
			className="grid h-11 w-11 place-content-center rounded-xl bg-[#6D61FF]"
		>
			<DiscordIcon />
		</button>
	);
};

export default DiscordButton;
