import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistory, getRoom } from "../../api/room";
import { base58ToColor } from "../../util/color";
import {
	formatToken,
	getSafeTimeoutInterval,
	shortenAddress,
} from "../../util/util";
import MiniWheel from "./MiniWheel";

import right from "./assets/right.svg";
import rightCircle from "./assets/rightCircle.svg";
import leftCircle from "./assets/leftCircle.svg";
import { PopupContext } from "../../Context";
import Container from "../../components/Container";
import Replay from "./Replay";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

const Session = ({ users, value, result, closeTime }) => {
	const { setPopup } = useContext(PopupContext);
	const wheelRef = useRef(null);

	const { roomID } = useParams();
	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const [formattedCloseTime, setFormattedCloseTime] = useState("");

	useEffect(() => {
		const date = new Date(closeTime * 1000);

		const timeAgo = new TimeAgo("en-US");
		timeAgo.format(date, "round");

		let updateTimer;

		function render() {
			const [formattedDate, timeToNextUpdate] = timeAgo.format(date, {
				getTimeToNextUpdate: true,
			});

			setFormattedCloseTime(formattedDate);
			updateTimer = setTimeout(
				render,
				getSafeTimeoutInterval(timeToNextUpdate || 60 * 1000)
			);
		}

		render();

		return () => {
			clearTimeout(updateTimer);
		};
	}, [closeTime]);

	if (!roomQuery.isSuccess) {
		return null;
	}

	const winnerUser = users.find((user) => user.publicKey === result.winner);
	let winnerChance = 0;
	if (winnerUser) {
		winnerChance = (winnerUser.value / value) * 100;
	}

	return (
		<div className="relative flex w-full items-center gap-4 rounded-lg p-4">
			<div className="absolute top-4 right-4">
				<span className="text-sm font-semibold text-mute">
					{closeTime ? formattedCloseTime : null}
				</span>
			</div>
			<div ref={wheelRef} className="flex w-1/3 lg:w-1/4">
				<AspectRatio ratio={1 / 1}>
					<MiniWheel
						users={users}
						value={value}
						className="h-full w-full"
						spinValue={result.spinValue}
					/>
				</AspectRatio>
			</div>
			<div
				style={{
					height: wheelRef.current
						? wheelRef.current.clientHeight
						: 0,
				}}
				className="flex h-full flex-1 flex-col justify-center"
			>
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-mute sm:text-sm lg:text-xs xl:text-sm">
						Value
					</label>
					<span className="-mt-1 font-semibold sm:text-lg lg:text-base xl:text-lg">
						{formatToken(value, roomQuery.data.token)}
					</span>
				</div>
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-mute sm:text-sm lg:text-xs xl:text-sm">
						Winner
					</label>
					<a
						target="_blank"
						href={`https://solscan.io/account/${result.winner}`}
					>
						<span
							style={{
								color: base58ToColor(result.winner).hex,
							}}
							className="-mt-1 font-semibold underline sm:text-lg lg:text-base xl:text-lg"
						>
							{shortenAddress(result.winner)}
						</span>
					</a>
				</div>
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-mute sm:text-sm lg:text-xs xl:text-sm">
						Winner Chance
					</label>
					<span
						className={
							`-mt-1 font-semibold sm:text-lg lg:text-base xl:text-lg ` +
							(() => {
								if (winnerChance <= 25) {
									return "text-red";
								}
								if (winnerChance <= 50) {
									return "text-gold";
								}
								return "text-green";
							})()
						}
					>
						{winnerChance.toFixed(2)}%
					</span>
				</div>
			</div>
			<button
				onClick={() => {
					if (!roomQuery.isSuccess) {
						return;
					}
					setPopup({
						show: true,
						html: (
							<Container>
								<Replay
									users={users}
									value={value}
									result={result}
									token={roomQuery.data.token}
								/>
							</Container>
						),
					});
				}}
				className="mr-1 flex flex-col items-center sm:mr-2"
			>
				<img className="w-6" src={right} alt="" />
				<span className="text-sm font-semibold text-mute">Replay</span>
			</button>
		</div>
	);
};

const ITEMS_PER_PAGE = 3;

const History = () => {
	const { roomID } = useParams();
	const historyQuery = useQuery({
		queryKey: ["history", roomID],
		queryFn: () => getHistory(roomID),
		refetchInterval: 5000,
	});

	const [page, setPage] = useState(0);
	const [pageAmount, setPageAmount] = useState(0);

	useEffect(() => {
		if (!historyQuery.isSuccess) {
			setPageAmount(0);
			return;
		}

		setPageAmount(Math.ceil(historyQuery.data.length / ITEMS_PER_PAGE));
	}, [historyQuery]);

	return (
		<div
			className="flex w-full flex-col gap-x-8 gap-y-4 
        	rounded-3xl border-2 border-[#2F2E5F] bg-[#25244E] p-4"
		>
			<div className="flex items-center">
				<span className="text-lg font-semibold">Bet History</span>
				<div className="ml-auto flex gap-2">
					<button
						disabled={page === 0}
						onClick={() => {
							setPage((prevData) => prevData - 1);
						}}
						className={`${
							page === 0
								? "opacity-50"
								: "transition hover:opacity-90"
						}`}
					>
						<img className="w-7" src={leftCircle} alt="" />
					</button>
					<button
						onClick={() => {
							setPage((prevData) => prevData + 1);
						}}
						disabled={page === pageAmount - 1}
						className={`${
							page === pageAmount - 1
								? "opacity-50"
								: "transition hover:opacity-90"
						}`}
					>
						<img className="w-7" src={rightCircle} alt="" />
					</button>
				</div>
			</div>
			{historyQuery.isSuccess ? (
				<div className="flex flex-col gap-4 [&>*:nth-child(odd)]:bg-[#201F48]">
					{(() => {
						const firstIndex = page * ITEMS_PER_PAGE;
						let lastIndex = (page + 1) * ITEMS_PER_PAGE;
						if (lastIndex > historyQuery.length) {
							lastIndex = historyQuery.length;
						}

						const historySlice = historyQuery.data.slice(
							firstIndex,
							lastIndex
						);

						return historySlice.map((session) => {
							return <Session {...session} key={session.id} />;
						});
					})()}
				</div>
			) : (
				<span className="text-center font-semibold text-mute">
					Loading...
				</span>
			)}
		</div>
	);
};

export default History;
