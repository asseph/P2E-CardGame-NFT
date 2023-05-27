import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../../api/user";
import { shortenAddress } from "../../util/util";

import Pen from "./assets/pen.svg";
import Check from "./assets/check.svg";
import Cross from "./assets/cross.svg";

import axios from "axios";
import base58 from "bs58";

const Name = () => {
	const queryClient = useQueryClient();

	const wallet = useWallet();
	const { publicKey } = useParams();

	const userQuery = useQuery({
		queryKey: ["user", publicKey],
		queryFn: () => getUser(publicKey),
	});

	const [mode, setMode] = useState(false);
	const [newName, setNewName] = useState("");

	const changeName = async (name) => {
		if (!wallet.publicKey) {
			return;
		}

		const data = new TextEncoder().encode(
			`solanashuffle change name ${wallet.publicKey.toBase58()}`
		);
		const signatureBytes = await wallet.signMessage(data);
		const signature = base58.encode(signatureBytes);

		const resp = await axios.post(
			`${
				import.meta.env.VITE_API
			}/user/name/change/${wallet.publicKey.toBase58()}`,
			{
				name,
				signature,
			}
		);

		queryClient.setQueriesData(
			["user", wallet.publicKey.toBase58()],
			(oldData) => {
				return {
					...oldData,
					name,
				};
			}
		);
	};

	let button = null;

	// Only show edit button when the wallet is connected and the user is viewing their own profile
	if (wallet == publicKey) {
		button = mode ? (
			<>
				<button
					disabled={newName.length < 3}
					onClick={async () => {
						try {
							await changeName(newName);
							setMode((prevData) => !prevData);
							setNewName("");
						} catch (err) {
							console.log(err);
						}
					}}
					className={`rounded-full border-2 border-mute p-2 transition ${
						newName.length >= 3
							? "hover:bg-white hover:bg-opacity-10"
							: "cursor-not-allowed"
					}`}
				>
					<img
						className="h-2.5 w-2.5 min-w-[10px]"
						src={Check}
						alt=""
					/>
				</button>
				<button
					onClick={async () => {
						try {
							setMode((prevData) => !prevData);
							setNewName("");
						} catch (err) {
							console.log(err);
						}
					}}
					className="rounded-full border-2 border-mute p-2 transition hover:bg-white hover:bg-opacity-10"
				>
					<img
						className="h-2.5 w-2.5 min-w-[10px]"
						src={Cross}
						alt=""
					/>
				</button>
			</>
		) : (
			<button
				onClick={() => setMode((prevData) => !prevData)}
				className="rounded-full border-2 border-mute p-2 transition hover:bg-white hover:bg-opacity-10"
			>
				<img className="h-2.5 w-2.5 min-w-[10px]" src={Pen} alt="" />
			</button>
		);
	}

	return (
		<div className="mx-auto flex items-center gap-3">
			{mode ? (
				<input
					placeholder="New Name"
					value={newName}
					onChange={(e) => {
						setNewName(e.target.value);
					}}
					className="h-8 w-[180px] appearance-none border-b-2 border-mute bg-transparent bg-[#393869] text-2xl font-semibold placeholder-mute outline-none"
					type="text"
				/>
			) : (
				<span className="max-w-[260px] overflow-hidden overflow-ellipsis whitespace-nowrap text-2xl font-semibold">
					{userQuery.isSuccess && userQuery.data.name
						? userQuery.data.name
						: shortenAddress(publicKey, 8)}
				</span>
			)}

			{button}
		</div>
	);
};

export default Name;
