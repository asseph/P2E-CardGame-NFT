import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useState } from "react";

import Check from "./assets/check.svg";
import Pen from "./assets/pen.svg";

const ChangeName = ({ className }) => {
	const queryClient = useQueryClient();

	const wallet = useWallet();
	const [name, setName] = useState("");

	const [change, setChange] = useState(false);

	const submit = async () => {
		try {
			await axios.post(
				`${
					import.meta.env.VITE_API
				}/user/name/change/${wallet.publicKey.toBase58()}`,
				{
					name,
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
		} catch {}
		setName("");
	};

	if (change) {
		return (
			<button
				onClick={() => {
					setChange(true);
				}}
				className={`flex h-11 items-center gap-3 ${className}`}
			>
				<span className="text-sm font-semibold text-mute">
					Change Name
				</span>
				<div className="rounded-full border-2 border-mute p-1.5">
					<img className="h-2 w-2" src={Pen} alt="" />
				</div>
			</button>
		);
	}

	return (
		<div
			style={{
				boxShadow: "inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
			}}
			className={`flex h-11 items-center rounded-lg bg-[#393869] p-1 ${className}`}
		>
			<input
				placeholder="Change Name"
				type="text"
				className="flex flex-grow appearance-none bg-transparent 
				px-3 py-2 text-sm font-semibold
				text-light placeholder-mute outline-none"
				value={name}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<button
				onClick={submit}
				className="ml-auto grid h-8 w-8 place-content-center rounded-lg bg-[#6D61FF]"
			>
				<img className="h-3.5 w-3.5" src={Check} alt="" />
			</button>
		</div>
	);
};

export default ChangeName;
