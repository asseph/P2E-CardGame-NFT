import React from "react";
import { useState } from "react";

import Pie from "./assets/pie.svg";

import TokenLogo from "../../components/TokenLogo";
import { formatTime, formatToken, solToken } from "../../util/util";
import { getUser } from "../../api/user";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "react-router";
import { useEffect } from "react";

const Wagered = () => {
	const { publicKey } = useParams();

	const userQuery = useQuery({
		queryKey: ["user", publicKey],
		queryFn: () => getUser(publicKey),
	});

	const [mode, setMode] = useState("week");
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		if (!userQuery.isSuccess) {
			setAmount(0);
			return;
		}
		if (mode === "all") {
			setAmount(userQuery.data.stats.totalVolume);
		} else {
			let d = new Date();
			let a = 0;
			for (let i = 0; i < 7; i++) {
				const key = formatTime(d);
				const value = userQuery.data.stats.volumes[key];
				if (value) {
					a += value;
				}
				d.setDate(d.getDate() - 1);
			}

			setAmount(a);
		}
	}, [mode, userQuery]);

	return (
		<div
			className="flex w-full flex-col rounded-[25px] 
            border-t-2 border-[#2F2E5F] bg-[#27264E] shadow-lg"
		>
			<div
				style={{
					borderTopLeftRadius: "25px",
					borderTopRightRadius: "25px",
				}}
				className="h-20 border-b-2 
                border-[#393869] bg-[#201F48] bg-opacity-70 p-6"
			>
				<div className="flex items-center">
					<img className="h-6 w-6" src={Pie} alt="" />{" "}
					<span className="ml-2.5 text-2xl font-extrabold uppercase">
						Wagered
					</span>
				</div>
			</div>
			<div className="flex flex-col gap-4 py-4 px-6">
				<div
					style={{
						boxShadow:
							"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
					}}
					className="flex items-center gap-4 rounded-xl bg-[#201F48] p-1"
				>
					<button
						onClick={() => {
							setMode("week");
						}}
						className={`h-9 w-full rounded-xl border-2 ${
							mode === "week"
								? " border-[#49487C] bg-[#393869] text-light"
								: "border-transparent bg-transparent text-mute hover:text-light"
						} transition`}
					>
						<span className="text-sm font-semibold">Week</span>
					</button>
					<button
						onClick={() => {
							setMode("all");
						}}
						className={`h-9 w-full rounded-xl border-2 ${
							mode === "all"
								? " border-[#49487C] bg-[#393869] text-light"
								: "border-transparent bg-transparent text-mute hover:text-light"
						} transition`}
					>
						<span className="text-sm font-semibold">All</span>
					</button>
				</div>
				<div
					style={{
						boxShadow:
							"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
					}}
					className="flex items-center gap-2 rounded-xl bg-[#201F48] p-4"
				>
					<TokenLogo className="h-6 w-6" ticker="SOL" />
					<span className="text-xl font-semibold">
						{formatToken(amount, solToken)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Wagered;
