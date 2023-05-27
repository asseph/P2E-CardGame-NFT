import React, { useEffect, useState, useContext } from "react";
import Wheel from "./Wheel";
import Pot from "./Pot";
import RoomInfo from "./RoomInfo";

import background from "./assets/background.png";
import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PopupContext } from "../../Context";

import WinPopup from "./WinPopup";

import { getRoom } from "../../api/room";
import Chat from "../../frame/Chat";
import { MAX_COUNTDOWN } from "./Countdown";
import BetAmount from "./BetAmount";

import cartoonPop from "./assets/cartoonPop.mp3";
import win from "./assets/win.mp3";
import { useWindowSize } from "../../util/hooks";
import History from "./History";

const Jackpot = () => {
	const queryClient = useQueryClient();

	const wallet = useWallet();

	const { setPopup } = useContext(PopupContext);
	const { roomID } = useParams();
	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const [result, setResult] = useState({});

	const { width } = useWindowSize();

	useEffect(() => {
		const websocket = new WebSocket(
			`${import.meta.env.VITE_WS}/room/${roomID}`
		);
		websocket.onopen = () => {
			console.log("connected");
		};
		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case "newUser":
					const cartoonPopClone = new Audio(cartoonPop);
					cartoonPopClone.volume = 0.2;
					cartoonPopClone.play();
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								...oldData.session,
								status: data.status,
								value: data.value.value,
								users: data.value.users,
							},
						};
					});
					break;
				case "waitingCountdown":
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								...oldData.session,
								status: data.status,
								countdown: data.value,
							},
						};
					});
					break;
				case "waitingSolana":
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								...oldData.session,
								status: data.status,
							},
						};
					});
					break;
				case "result":
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								...oldData.session,
								status: data.status,
							},
						};
					});
					setResult(data.value);
					break;
				case "resultAnnotation":
					console.log("annotation");
					setResult((prevData) => {
						let clone = { ...prevData };
						clone.signatures = data.value;
						return clone;
					});
					break;
				case "resetCountdown":
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								...oldData.session,
								status: data.status,
							},
						};
					});
					break;
				case "reset":
					queryClient.setQueriesData(["room", roomID], (oldData) => {
						return {
							...oldData,
							session: {
								users: [],
								countdown: MAX_COUNTDOWN,
								value: 0,
								status: data.status,
							},
						};
					});
					break;
			}
		};

		const interval = setInterval(() => {
			console.log("heartbeat");
			websocket.send(
				JSON.stringify({
					type: "heartbeat",
					value: "ping",
				})
			);
		}, 5000);

		return () => {
			clearInterval(interval);
			websocket.close();
		};
	}, [queryClient, roomID]);

	const [dialogue, setDialogue] = useState(null);

	useEffect(() => {
		console.log("new dialogue");
		setPopup((prevData) => ({
			...prevData,
			html: dialogue,
		}));
	}, [dialogue]);

	useEffect(() => {
		console.log(result, "new result");

		if (!wallet.publicKey) {
			return;
		}
		if (result.winner !== wallet.publicKey.toBase58()) {
			return;
		}

		if (result.signatures) {
			console.log(result.signatures);
			setDialogue(<WinPopup result={result} />);
			return;
		}

		setDialogue(<WinPopup result={result} />);

		setTimeout(() => {
			setPopup((prevData) => ({
				...prevData,
				show: true,
				lock: true,
			}));
		}, 7000);
	}, [result]);

	return (
		<div
			style={{
				backgroundImage: `url(${background})`,
			}}
			className="relative flex h-full w-full max-w-full flex-row overflow-y-scroll px-2 md:p-4 lg:p-2"
		>
			<div className="absolute top-0 left-0 hidden w-full overflow-hidden">
				<img className="object-cover" src={background} alt="" />
			</div>
			{width >= 1024 && width < 1348 ? (
				<div className="sticky top-0 left-0 mr-2 hidden h-full w-[300px] flex-col gap-2 py-0 lg:flex 1.5xl:hidden">
					<BetAmount className="w-[280px]">
						<Chat />
					</BetAmount>
				</div>
			) : null}

			<div
				className="z-10 mt-8 flex h-min w-full flex-col 
				items-center sm:mt-12 lg:mt-2 lg:flex-row lg:items-start"
			>
				<div
					className="flex w-full max-w-[500px] flex-col md:max-w-none lg:mt-8 lg:pb-2 1.5xl:mx-auto
					1.5xl:max-w-[850px] 1.5xl:pb-6"
				>
					<Wheel result={result} />
					<div className="mx-auto mt-2 w-full shadow-lg 1.5xl:mt-4 1.5xl:w-3/4">
						<Pot />
					</div>
					<div className="mx-auto mt-2 w-full shadow-lg 1.5xl:mt-4 1.5xl:w-3/4">
						<RoomInfo />
					</div>
					<div className="mx-auto mt-2 hidden w-full shadow-lg lg:flex 1.5xl:mt-4 1.5xl:w-3/4">
						<History />
					</div>
				</div>
				<div className="mt-2 w-full max-w-[500px] md:max-w-none lg:hidden">
					<BetAmount />
				</div>
				<div className="mx-auto mt-2 w-full shadow-lg lg:hidden 1.5xl:mt-4 1.5xl:w-3/4">
					<History />
				</div>
			</div>
			{width >= 1348 ? (
				<div className="sticky right-0 top-0 z-10 hidden h-full min-w-[320px] p-4 1.5xl:flex">
					<Chat />
				</div>
			) : null}
		</div>
	);
};

export default Jackpot;
