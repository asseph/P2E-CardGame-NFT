import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";
import { getUserHistory } from "../../api/user";
import TokenLogo from "../../components/TokenLogo";
import { formatToken } from "../../util/util";

import rightCircle from "./assets/rightCircle.svg";
import leftCircle from "./assets/leftCircle.svg";
import Time from "./assets/time.svg";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Avatar from "../../components/Avatar";
import Avatar2 from "../../components/Avatar2";
import Skeleton from "../../components/Skeleton";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const History = () => {
	const wallet = useWallet();
	const { publicKey } = useParams();

	const [page, setPage] = useState(0);
	const [backendPage, setBackendPage] = useState(0);
	const [endPage, setEndPage] = useState(-1);

	const historyQuery = useQuery({
		queryKey: ["history", publicKey, backendPage],
		queryFn: () => getUserHistory(publicKey, backendPage),
	});

	useEffect(() => {
		setBackendPage(Math.floor(page / 4));
	}, [page]);

	useEffect(() => {
		if (
			!historyQuery.isSuccess ||
			historyQuery.data.page !== Math.floor(page / 4)
		) {
			return;
		}

		const index1 = (page % 4) * 5;
		const index2 = index1 + 5;

		const sessions = historyQuery.data.sessions.slice(index1, index2);

		if (sessions.length === 0) {
			setEndPage(page - 1);
			return;
		}
		if (sessions.length < 5) {
			setEndPage(page);
		}
	}, [historyQuery, page]);

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
				className="flex h-20 items-center border-b-2 
                border-[#393869] bg-[#201F48] bg-opacity-70 p-6"
			>
				<div className="flex items-center">
					<img className="h-6 w-6" src={Time} alt="" />{" "}
					<span className="ml-2.5 text-2xl font-extrabold uppercase">
						History
					</span>
				</div>
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
						disabled={endPage !== -1 && endPage <= page}
						className={`${
							endPage !== -1 && endPage <= page
								? "opacity-50"
								: "transition hover:opacity-90"
						}`}
					>
						<img className="w-7" src={rightCircle} alt="" />
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-2 px-6 py-4">
				<div
					className="flex h-8 items-center rounded-xl border-2 
					border-[#49487C] bg-[#393869] px-3 text-xs font-semibold
					text-mute sm:px-6 xl:grid-cols-4"
				>
					<span className="mr-auto w-[90px]">Game Room</span>
					<span className="mx-auto hidden w-[100px] text-center xl:block">
						Your Bet
					</span>
					<span className="mx-auto w-[100px] text-center">
						Pot Value
					</span>

					<span className="ml-auto w-[34px] text-center">Result</span>
				</div>
				<div className="flex max-h-[312px] flex-col gap-2 overflow-y-scroll scrollbar-hide [&>*:nth-child(even)]:bg-[#201F48]">
					{historyQuery.isSuccess
						? (() => {
								const index1 = (page % 4) * 5;
								const index2 = index1 + 5;

								const sessions =
									historyQuery.data.sessions.slice(
										index1,
										index2
									);

								return sessions.map((session) => {
									const room =
										historyQuery.data.rooms[session.roomId];

									const me = session.users.filter(
										(user) => user.publicKey === publicKey
									);

									if (!me.length) {
										return;
									}
									const myBet = me[0].value;
									const pot = session.value;
									const win =
										publicKey === session.result.winner;

									return (
										<div
											key={session.id}
											className="flex min-h-[56px] items-center rounded-xl px-3 text-xs font-semibold sm:px-6 sm:text-sm"
										>
											<Link
												to={`/jackpot/${room.id}`}
												className={`mr-auto w-[90px] ${
													room.private
														? "pointer-events-none"
														: "text-green underline"
												} `}
											>
												<span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
													{room.name}
												</span>
											</Link>
											<span className="mx-auto hidden w-[100px] items-center justify-center text-center text-mute sm:flex lg:hidden xl:flex">
												<TokenLogo
													className="mr-0.5 w-3.5 sm:w-5"
													ticker={room.token.ticker}
												/>
												{formatToken(myBet, room.token)}
											</span>
											<span className="mx-auto flex w-[100px] items-center justify-center text-center text-mute">
												<TokenLogo
													className="mr-0.5 w-3.5 sm:w-5"
													ticker={room.token.ticker}
												/>
												{formatToken(pot, room.token)}
											</span>

											<span className="ml-auto w-[34px] text-center">
												{win ? (
													<span className="text-green">
														Win
													</span>
												) : (
													<span className="text-red">
														Loss
													</span>
												)}
											</span>
										</div>
									);
								});
						  })()
						: [...Array(5)].map((_, i) => (
								<Skeleton
									className="h-14 w-full rounded-xl"
									key={i}
								/>
						  ))}
				</div>
			</div>
		</div>
	);
};

export default History;
