import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getRoom } from "../../api/room";
import { base58ToColor } from "../../util/color";

import Divider from "../../components/Divider";

import arrow from "./assets/arrow.svg";
import Countdown from "./Countdown";
import MyToken from "./MyToken";
import WinChance from "./WinChance";
import { formatToken } from "../../util/util";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { calculateAssetsValue, calculateUserValue } from "../../util/room";
import BetButton from "./BetButton";
import { AssetsContext } from "../../Context";
import WalletButton from "../../components/WalletButton";

import { v4 as uuidv4 } from "uuid";
import DefaultAvatar from "../profile/assets/defaultAvatar.png";

import whoosh from "./assets/whoosh.mp3";

const ProfileImage = ({ user }) => {
	const [imgError, setImgError] = useState(false);
	return (
		<img
			style={{
				borderColor: base58ToColor(user.publicKey).hex,
				boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 15px 5px",
			}}
			className="rounded-full border-4"
			src={
				user.profile.image && !imgError
					? user.profile.image
					: DefaultAvatar
			}
			onError={() => {
				setImgError(true);
			}}
		/>
	);
};

const Wheel = ({ result }) => {
	const wallet = useWallet();
	const { roomID } = useParams();

	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const { assets, setAssets } = useContext(AssetsContext);

	const [pieBackground, setPieBackground] = useState("");
	const [roomMessage, setRoomMessage] = useState("Waiting for Users...");
	const [animate, setAnimate] = useState("");
	const [spinning, setSpinning] = useState(false);

	useEffect(() => {
		if (
			roomQuery.isLoading ||
			roomQuery.isError ||
			!roomQuery.data.session.users ||
			roomQuery.data.session.users.length === 0
		) {
			setPieBackground("#312F54");
			return;
		}

		if (roomQuery.data.session.users.length === 1) {
			setPieBackground(
				base58ToColor(roomQuery.data.session.users[0].publicKey).hex
			);
			return;
		}

		let lastPercentage = 0;
		const parts = roomQuery.data.session.users.map((user, i) => {
			const color = base58ToColor(user.publicKey);
			const addZero = i === 0 ? "" : "0 ";
			const percentage =
				lastPercentage +
				(user.value * 100) / roomQuery.data.session.value;

			lastPercentage = percentage;

			return `${color.hex} ${addZero} ${percentage}%`;
		});

		const bg = `conic-gradient(
			${parts.join(",")}
		)`;

		setPieBackground(bg);
	}, [roomQuery]);

	useEffect(() => {
		if (
			roomQuery.isLoading ||
			roomQuery.isError ||
			!roomQuery.data.session.status
		) {
			return;
		}

		switch (roomQuery.data.session.status) {
			case "waiting":
				setRoomMessage("Waiting for Users...");
				break;
			case "waitingSolana":
				setRoomMessage("Waiting for Network...");
				break;
			case "drawing":
				setRoomMessage("Drawing Winner...");
				break;
			case "finished":
				if (!spinning) {
					setRoomMessage("Clearing up...");
					setTimeout(() => {
						console.log("resetting rotate");
						setAnimate("");
					}, 5000);
				}
				break;
		}
	}, [roomQuery, spinning]);

	useEffect(() => {
		if (result.signatures) {
			return;
		}
		if (!result.spinValue) {
			return;
		}

		let deg = 3600;
		deg += 360 - (result.spinValue * 360) / 10000;

		const uuid = uuidv4();

		const style = `
      @-webkit-keyframes wheel-spin-${uuid} {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(${deg}deg); }
      }
    `;

		const styleElement = document.createElement("style");
		let styleSheet = null;

		document.head.appendChild(styleElement);

		styleSheet = styleElement.sheet;

		styleSheet.insertRule(style, styleSheet.cssRules.length);

		setAnimate(`wheel-spin-${uuid}`);

		const whooshClone = new Audio(whoosh);
		whooshClone.volume = 0.4;
		whooshClone.play();

		setSpinning(true);
	}, [result]);

	const calculateWinChance = () => {
		const value =
			calculateAssetsValue(assets) +
			calculateUserValue(roomQuery.data, wallet.publicKey);

		const totalValue =
			roomQuery.data.session.value + calculateAssetsValue(assets);

		if (!totalValue) {
			return 0;
		}
		return (value / totalValue) * 10000;
	};

	return (
		<AspectRatio.Root
			ratio={1 / 1}
			className="
				flex aspect-square
				items-center justify-center rounded-full border-[3px] border-[#273A64] 
				border-opacity-60 bg-[#312F54] bg-opacity-70 shadow-lg"
		>
			<div className="relative flex h-[96.5%] w-[96.5%] rounded-full shadow-lg">
				<div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-full">
					<motion.div
						initial={false}
						style={{
							background: pieBackground,
							animationName: animate,
							animationDuration: "7s",
							animationTimingFunction:
								"cubic-bezier(0.25, 0.01, 0.01, 0.98)",
							animationFillMode: "forwards",
						}}
						onAnimationEnd={() => {
							console.log("done animating");
							setSpinning(false);
						}}
						className={`absolute top-0 left-0 h-full w-full rounded-full`}
					>
						{!roomQuery.isSuccess || !roomQuery.data.session.users
							? null
							: (() => {
									let lastPercentage = 0;

									return roomQuery.data.session.users.map(
										(user) => {
											const percentage =
												lastPercentage +
												(user.value * 100) /
													roomQuery.data.session
														.value;

											lastPercentage = percentage;

											return (
												<div
													style={{
														rotate: `${
															(360 * percentage) /
															100
														}deg`,
													}}
													key={user.publicKey}
													className={`absolute top-0 left-0 z-10 flex h-full w-full rounded-full`}
												>
													<div className="relative mx-auto h-1/2 w-0.5 bg-light"></div>
												</div>
											);
										}
									);
							  })()}
						{roomQuery.isSuccess &&
							roomQuery.data.session.users &&
							(() => {
								let lastPercentage = 0;
								let userPercentage = null;
								let lastUserPercentage = null;

								let elements = [];

								roomQuery.data.session.users.forEach((user) => {
									const percentage =
										lastPercentage +
										(user.value * 100) /
											roomQuery.data.session.value;

									lastPercentage = percentage;
									const periodPercentage =
										(user.value * 100) /
										roomQuery.data.session.value;

									if (periodPercentage < 3.5) {
										return;
									}

									elements.push(
										<div
											key={user.publicKey}
											style={{
												rotate: `${
													(360 *
														(percentage -
															periodPercentage /
																2)) /
													100
												}deg`,
											}}
											className="absolute top-0 left-0 flex h-full w-full rounded-full"
										>
											<div className="relative mx-auto flex aspect-square h-[13%] w-[9%] flex-col">
												<div className="h-1/5"></div>
												<div className="mt-0.5">
													<ProfileImage user={user} />
												</div>
											</div>
										</div>
									);
								});

								return elements;
							})()}
						{/*!roomQuery.isSuccess ||
						!roomQuery.data.session.users ||
						!wallet.publicKey
							? null
							: (() => {
									let lastPercentage = 0;
									let userPercentage = null;
									let lastUserPercentage = null;

									roomQuery.data.session.users.forEach(
										(user) => {
											const percentage =
												lastPercentage +
												(user.value * 100) /
													roomQuery.data.session
														.value;

											lastPercentage = percentage;
											if (
												user.publicKey ==
												wallet.publicKey.toBase58()
											) {
												lastUserPercentage =
													(user.value * 100) /
													roomQuery.data.session
														.value;
												userPercentage = percentage;
												return;
											}
										}
									);

									console.log(
										userPercentage,
										lastUserPercentage
									);

									if (userPercentage === null) {
										return null;
									}

									return (
										<div
											style={{
												rotate: `${
													(360 *
														(userPercentage -
															lastUserPercentage /
																2)) /
													100
												}deg`,
											}}
											className="absolute top-0 left-0 z-50 flex h-full w-full rounded-full"
										>
											<div className="mt-1/4 relative mx-auto flex h-1/2 w-3 flex-col bg-red sm:w-4 md:w-5 lg:w-6">
												<div
													style={{
														rotate: `-${
															(360 *
																(userPercentage -
																	lastUserPercentage /
																		2)) /
															100
														}deg`,
													}}
													className="h-1/4"
												></div>
												<div
													style={{
														color: base58ToColor(
															wallet.publicKey.toBase58()
														).hex,
													}}
													className="mt-0.5"
												>
													<svg
														className="w-full"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
													>
														<path
															d="M23.44,19,13.71,2.93a2,2,0,0,0-3.42,0L.56,19a2,2,0,0,0,1.71,3H21.73a2,2,0,0,0,1.71-3Z"
															fill="currentColor"
														></path>
													</svg>
												</div>
											</div>
										</div>
									);
							  })()*/}
					</motion.div>
				</div>
				<div className="absolute left-0 right-0 -top-[15%] z-50 mx-auto flex w-1/4 flex-col items-center sm:-top-20">
					<img className="" src={arrow} alt="" />
				</div>
				<div className="absolute top-0 left-0 flex h-full w-full">
					<div className="relative m-auto h-[97.2%] w-[97.2%]">
						<div
							style={{
								background:
									"radial-gradient(rgba(255, 255, 255, 0) 67%, rgba(255, 255, 255, 0) 67%, rgba(255, 255, 255, 0.5) 75%)",
							}}
							className="absolute m-auto h-full w-full rounded-full
							mix-blend-overlay ring-2 ring-white ring-opacity-40"
						/>
						<div className="absolute m-auto h-full w-full rounded-full border-[2.16px] border-white border-opacity-50" />
					</div>
				</div>
				<div className="absolute top-0 left-0 flex h-full w-full ">
					<div className="relative m-auto h-[100%] w-[100%]">
						<div
							style={{
								background:
									"radial-gradient(rgba(255, 255, 255, 0) 69.1%, rgba(64, 21, 134, 0.3) 69.1%)",
							}}
							className="absolute m-auto h-full w-full rounded-full bg-opacity-30 mix-blend-multiply"
						/>
					</div>
				</div>
				<div
					style={{
						background:
							"linear-gradient(270.18deg, #493B9A 0.17%, #302475 19.9%, #24235C 50.02%, #302475 74.94%, #493B9A 99.87%)",
					}}
					className="relative z-10 m-auto 
						flex h-3/4 w-3/4 flex-col items-center rounded-full border-2 border-white border-opacity-50 bg-[#24234E]"
				>
					<div className="m-auto flex flex-col items-center">
						<div className="flex flex-col text-center">
							<span className="text-sm font-bold text-mute">
								Total Value
							</span>
							<span className="text-xl font-bold text-light sm:text-3xl md2:text-4xl lg:text-4xl ">
								{roomQuery.isLoading || roomQuery.isError
									? "..."
									: formatToken(
											roomQuery.data.session.value,
											roomQuery.data.token
									  )}
							</span>
						</div>
						<Divider className="my-2 h-0.5 w-full rounded-lg bg-[#6E6FA6] bg-opacity-40 md2:my-3 lg:my-3" />
						<div className="relative mb-1 overflow-visible text-sm font-extrabold uppercase sm:mb-2 sm:text-lg md:mb-1 md:text-base md2:mb-2 md2:text-xl lg:text-lg">
							{roomMessage}
						</div>

						<Countdown
							countdown={
								roomQuery.isLoading || roomQuery.isError
									? 0
									: roomQuery.data.session.countdown
							}
						/>
						<Divider className="my-3 h-0.5 w-full rounded-lg bg-[#6E6FA6] bg-opacity-40 md2:my-4 lg:my-3" />
						<div className="-z-10 mb-2">
							<WinChance
								chance={
									roomQuery.isSuccess && wallet.publicKey
										? calculateWinChance()
										: 0
								}
								className="h-20 sm:h-24 md:h-20 md2:h-28 lg:h-24"
							/>
						</div>
						<div className="hidden w-[278px] 1.5xl:flex">
							{wallet.publicKey ? (
								<MyToken
									setState={
										!roomQuery.isSuccess
											? () => {}
											: (amt) => {
													setAssets((prevData) => {
														let clone = [
															...prevData,
														];
														if (
															clone.filter(
																(asset) =>
																	asset.type ==
																	"Token"
															).length === 0
														) {
															clone.push({
																type: "Token",
																price: amt,
																mint: roomQuery
																	.data.token
																	.publicKey,
															});
															return clone;
														}
														clone = clone.map(
															(asset) => {
																if (
																	asset.type ==
																	"Token"
																) {
																	asset.price =
																		amt;
																}
																return asset;
															}
														);

														return clone;
													});
											  }
									}
									state={
										roomQuery.isSuccess
											? calculateAssetsValue(
													assets.filter(
														(asset) =>
															asset.type ==
															"Token"
													)
											  ) /
											  Math.pow(
													10,
													roomQuery.data.token
														.decimals
											  )
											: 0
									}
								/>
							) : (
								<div
									style={{
										boxShadow:
											"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
									}}
									className="flex w-full flex-col items-center justify-center rounded-xl bg-[#201F48] py-2.5 px-4"
								>
									<span className="mb-0.5 font-semibold text-mute">
										Log in to bet!
									</span>
									<WalletButton className="w-full" />
								</div>
							)}
						</div>
						<BetButton
							className="mt-4 hidden 1.5xl:flex"
							includeNFTs={true}
						/>
					</div>
				</div>
			</div>
		</AspectRatio.Root>
	);
};

export default Wheel;
