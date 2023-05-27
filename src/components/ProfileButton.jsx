import { useWallet } from "@solana/wallet-adapter-react";
import {
	useWalletModal,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";
import { Link } from "react-router-dom";

const ProfileButton = ({ className }) => {
	const wallet = useWallet();

	if (!wallet.publicKey) {
	}

	return (
		<div
			className={`z-40 flex h-12 items-center justify-center rounded-lg text-light shadow-lg ${className}`}
		>
			{wallet.publicKey ? (
				<Link
					to={`/profile/${wallet.publicKey.toBase58()}`}
					className="h-full w-full rounded-lg bg-red"
				></Link>
			) : (
				<WalletMultiButton className="wallet-custom" />
			)}
		</div>
	);
};

export default ProfileButton;
