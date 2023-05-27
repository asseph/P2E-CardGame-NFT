import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Divider from "../components/Divider";
import Switch from "react-switch";
import { sleep } from "../util/util";
import Select from "../components/Select";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";

const creatorFeeBasisPointsOptions = [
	"0.00%",
	"0.50%",
	"1.00%",
	"1.50%",
	"2.00%",
	"2.50%",
	"3.00%",
	"3.50%",
	"4.00%",
	"4.50%",
	"5.00%",
];

const CreateRoomPopup = () => {
	const wallet = useWallet();

	const [roomData, setRoomData] = useState({
		tokenTicker: "SOL",
		name: "",
		public: true,
		creatorFeeBasisPoints: 0,
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [tokens, setTokens] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const resp = await axios.get(
					`${import.meta.env.VITE_API}/tokens`
				);
				setTokens(resp.data);
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	const create = async () => {
		let body = { ...roomData };
		try {
			const data = new TextEncoder().encode(
				`solanashuffle create room ${wallet.publicKey.toBase58()}`
			);
			body.signature = base58.encode(await wallet.signMessage(data));
			body.publicKey = wallet.publicKey.toBase58();
		} catch (err) {
			console.log(err);
			return;
		}
		try {
			const resp = await axios.post(
				`${import.meta.env.VITE_API}/room`,
				body
			);
			setError("");
			setSuccess("Successfully created room! Redirecting...");
			await sleep(2000);
			window.location.href = `/jackpot/${resp.data.id}`;
		} catch (err) {
			setError(
				err.response.data.message.charAt(0).toUpperCase() +
					err.response.data.message.slice(1) +
					"!"
			);
		}
	};

	return (
		<Container className="max-w-[460px]">
			<span className="mr-auto font-extrabold text-light">
				Create Room
			</span>
			<Divider className="my-3" />
			<div className="flex w-full flex-grow flex-col">
				<label className="mr-auto mb-0.5 text-sm font-bold">
					<span className="text-mute">Name</span>
					<span
						className={
							`text-xs transition ` +
							(() => {
								if (roomData.name.length == 0) {
									return "opacity-0";
								}
								if (roomData.name.length < 3) {
									return "text-mute-active opacity-100";
								}
								if (roomData.name.length > 20) {
									return "text-red opacity-100";
								}
								return "text-green opacity-100";
							})()
						}
					>
						{" "}
						({("0" + roomData.name.length).slice(-2)} / 20)
					</span>
				</label>
				<input
					value={roomData.name}
					onChange={(e) => {
						setRoomData((prevData) => ({
							...prevData,
							name: e.target.value,
						}));
					}}
					type="text"
					style={{
						boxShadow:
							"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
					}}
					className={
						`ring-mute-active h-11 w-full
						rounded-xl bg-[#393869] p-2.5 text-light
						ring-opacity-50 transition focus:outline-none focus:ring-2 ` +
						(() => {
							if (roomData.name.length > 20) {
								return "ring-2 ring-red ring-opacity-100";
							}
							return "";
						})()
					}
				/>
			</div>
			<div className="mt-3 flex w-full flex-grow items-center">
				<div className="flex w-1/3 flex-col items-center">
					<label className="mr-auto mb-0.5 text-sm font-bold">
						<span className="text-mute">Token</span>
					</label>
					<div className="flex h-11 w-full items-center">
						<Select
							setState={(ticker) => {
								setRoomData((prevData) => ({
									...prevData,
									tokenTicker: ticker,
								}));
							}}
							state={roomData.tokenTicker}
							items={tokens.map((token) => token.ticker)}
						/>
					</div>
				</div>{" "}
				<div className="flex w-1/3 flex-col items-center">
					<label className="mx-auto mr-auto mb-0.5 pr-5 text-center text-sm font-bold">
						<span className="text-center text-mute">
							Creator Fee
						</span>
					</label>
					<div className="flex h-11 w-full items-center">
						<Select
							className="mx-auto"
							setState={(points) => {
								setRoomData((prevData) => ({
									...prevData,
									creatorFeeBasisPoints: parseInt(
										points.replace(/\D/g, "")
									),
								}));
							}}
							state={
								(roomData.creatorFeeBasisPoints / 100)
									.toFixed(2)
									.toString() + "%"
							}
							items={creatorFeeBasisPointsOptions}
						/>
					</div>
				</div>
				<div className="flex w-1/3">
					<div className="ml-auto flex flex-col items-center">
						<label className="mr-auto mb-0.5 text-sm font-bold">
							<span className="text-mute">Discoverable</span>
						</label>
						<div className="mx-auto flex h-11 items-center">
							<Switch
								onColor="#6366f1"
								onChange={(checked) => {
									setRoomData((prevData) => ({
										...prevData,
										public: checked,
									}));
								}}
								checked={roomData.public}
							></Switch>
						</div>
					</div>
				</div>
			</div>
			<button
				onClick={create}
				style={{
					background:
						"radial-gradient(132.75% 155.27% at 31.94% -11.82%, #9186FF 0%, #6D61FF 33.87%, #574AFF 91.62%)",
				}}
				className="mt-4 h-11 w-full rounded-xl font-bold"
			>
				Create Room!
			</button>
			{success ? (
				<div className="mt-2 text-center text-sm font-semibold text-green">
					{success}
				</div>
			) : null}
			{error ? (
				<div className="mt-2 text-center text-sm font-semibold text-red">
					{error}
				</div>
			) : null}
		</Container>
	);
};

export default CreateRoomPopup;
