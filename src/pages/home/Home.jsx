import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { getRooms } from "../../api/room";
import Skeleton from "../../components/Skeleton";
import Chat from "../../frame/Chat";
import { motion } from "framer-motion";

import Background from "./assets/background.png";
import Fire from "./assets/fire.svg";
import Gear from "./assets/gear.svg";
import Create from "./assets/create.svg";
import Room from "./Room";
import { useWallet } from "@solana/wallet-adapter-react";
import { PopupContext, UserContext } from "../../Context";
import CreateRoomPopup from "../../frame/CreateRoomPopup";
import base58 from "bs58";
import axios from "axios";

const Home = () => {
	const wallet = useWallet();

	const { setPopup } = useContext(PopupContext);
	const { user, setUser } = useContext(UserContext);

	const roomsVolumeQuery = useQuery({
		queryKey: ["rooms", "volume"],
		queryFn: () => getRooms("todayVolume"),
	});

	const [roomsVolumePage, setRoomsVolumePage] = useState(0);

	const roomsRecentQuery = useQuery({
		queryKey: ["rooms", "recent"],
		queryFn: () => getRooms("creationTime"),
	});

	const [roomsRecentPage, setRoomsRecentPage] = useState(0);

	const [myRooms, setMyRooms] = useState([]);

	useEffect(() => {
		if (!wallet.publicKey) {
			return;
		}
		(async () => {
			const key = `home-signature-${wallet.publicKey.toBase58()}`;
			let localSignature = localStorage.getItem(key);
			if (!localSignature) {
				try {
					const msg = `solanashuffle my rooms ${wallet.publicKey.toBase58()}`;
					const data = new TextEncoder().encode(msg);
					const signature = base58.encode(
						await wallet.signMessage(data)
					);

					localSignature = signature;
					localStorage.setItem(key, localSignature);
				} catch (err) {
					console.log(err);
					return;
				}
			}

			const resp = await axios.get(
				`${
					import.meta.env.VITE_API
				}/rooms/creator/${wallet.publicKey.toBase58()}?signature=${localSignature}`
			);
			setMyRooms(resp.data);
		})();
	}, [wallet.publicKey]);

	return (
		<div
			style={{
				backgroundImage: `url(${Background})`,
			}}
			className="relative flex w-full flex-row overflow-y-scroll bg-center py-5 lg:p-8"
		>
			<div className="flex h-min w-full flex-col">
				<span className="flex items-center px-5 text-base font-extrabold uppercase sm:text-2xl">
					<img className="mr-2 w-5 sm:mr-3" src={Fire} alt="fire" />
					Hot rooms today
					<div className="ml-auto mr-2 flex items-center gap-2 sm:gap-3">
						{Array.from(Array(5).keys()).map((i) => {
							return (
								<button
									onClick={() => {
										setRoomsVolumePage(i);
									}}
									className={`font-semibold ${
										roomsVolumePage === i
											? "text-base text-light"
											: "text-sm text-mute transition hover:text-light"
									}`}
									key={i}
								>
									{i + 1}
								</button>
							);
						})}
					</div>
				</span>
				<div className="w-full overflow-y-visible px-4 sm:px-3 lg:px-2">
					<div className="relative w-full overflow-x-hidden overflow-y-visible">
						<motion.div
							animate={{
								transform: `translateX(-${
									roomsVolumePage * 100
								}%)`,
							}}
							className="mt-6 overflow-y-visible whitespace-nowrap"
						>
							{roomsVolumeQuery.isSuccess
								? roomsVolumeQuery.data.map((room, i) => {
										return (
											<div
												key={room.id}
												className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
											>
												<Room {...room} />
											</div>
										);
								  })
								: Array(4)
										.fill("a")
										.map((_, i) => {
											return (
												<div
													key={i}
													className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
												>
													<Skeleton className="h-44 w-full rounded-[25px] lg:h-60" />
												</div>
											);
										})}
						</motion.div>
					</div>
				</div>
				<span className="mt-6 flex items-center px-5 text-base font-extrabold uppercase sm:text-2xl">
					<img className="mr-2 w-5 sm:mr-3" src={Gear} alt="gear" />
					Recently created rooms
					<div className="ml-auto mr-2 flex items-center gap-2 sm:gap-3">
						{Array.from(Array(5).keys()).map((i) => {
							return (
								<button
									onClick={() => {
										setRoomsRecentPage(i);
									}}
									className={`font-semibold ${
										roomsRecentPage === i
											? "text-base text-light"
											: "text-sm text-mute transition hover:text-light"
									}`}
									key={i}
								>
									{i + 1}
								</button>
							);
						})}
					</div>
				</span>
				<div className="w-full overflow-y-visible px-4 sm:px-3 lg:px-2">
					<div className="relative w-full overflow-x-hidden overflow-y-visible">
						<motion.div
							animate={{
								transform: `translateX(-${
									roomsRecentPage * 100
								}%)`,
							}}
							className="mt-6 overflow-y-visible whitespace-nowrap"
						>
							{roomsRecentQuery.isSuccess
								? roomsRecentQuery.data.map((room, i) => {
										return (
											<div
												key={i}
												className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
											>
												<Room {...room} key={room.id} />
											</div>
										);
								  })
								: Array(4)
										.fill("a")
										.map((_, i) => {
											return (
												<div
													key={i}
													className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
												>
													<Skeleton className="h-44 w-full rounded-[25px] lg:h-60" />
												</div>
											);
										})}
						</motion.div>
					</div>
				</div>
				<span className="mt-6 flex items-center px-5 text-base font-extrabold uppercase sm:text-2xl">
					<img className="mr-2 w-5 sm:mr-3" src={Create} alt="fire" />
					My Rooms
				</span>
				<div className="w-full overflow-y-visible px-4 sm:px-3 lg:px-2">
					<div className="relative w-full overflow-x-hidden overflow-y-visible">
						<motion.div className="mt-6 overflow-y-visible whitespace-nowrap">
							{myRooms.length > 0
								? myRooms.map((room) => {
										return (
											<div
												key={room.id}
												className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
											>
												<Room {...room} />
											</div>
										);
								  })
								: null}
							{myRooms.length > -1 &&
								myRooms.length < 4 &&
								Array(4 - myRooms.length)
									.fill("a")
									.map((_, i) => {
										return (
											<div
												key={i}
												className={`inline-block w-1/2 px-1 sm:w-1/3 sm:px-2 lg:px-3 xl:w-1/3 2xl:w-1/4`}
											>
												<div
													className="relative flex h-44 rounded-[25px] border-2 border-[#464689] bg-[#2F2E5F] transition
													lg:h-60"
												>
													<div className="absolute top-0 left-0 h-full w-full p-2">
														<div
															className="flex h-full w-full flex-col
															items-center justify-center rounded-[22px] border-4 border-dashed border-[#393869]"
														>
															<span className="font-semibold text-mute">
																Create a room!
															</span>
															<button
																onClick={() => {
																	setPopup({
																		show: true,
																		html: (
																			<CreateRoomPopup />
																		),
																	});
																}}
																className="mt-4 h-10 w-24 rounded-xl border-2 border-[#49487C] bg-[#393869] text-lg font-bold transition hover:bg-[#2F2E5F]"
															>
																+
															</button>
														</div>
													</div>
												</div>
											</div>
										);
									})}
						</motion.div>
					</div>
				</div>
			</div>

			<div className="sticky right-0 top-0 z-10 ml-5 hidden h-full min-w-[288px] lg:ml-8 xl:flex">
				<Chat />
			</div>
		</div>
	);
};

export default Home;
