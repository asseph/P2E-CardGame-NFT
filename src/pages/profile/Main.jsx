import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUser } from "../../api/user";
import Skeleton from "../../components/Skeleton";

import DefaultBanner from "./assets/defaultBanner.png";
import DefaultAvatar from "./assets/defaultAvatar.png";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import Avatar2 from "../../components/Avatar2";
import DiscordButton from "./DiscordButton";
import Name from "./Name";

const Main = () => {
	const wallet = useWallet();
	const { publicKey } = useParams();

	const userQuery = useQuery({
		queryKey: ["user", publicKey],
		queryFn: () => getUser(publicKey),
	});

	const [winPercentage, setWinPercentage] = useState(0);
	const [lossPercentage, setLossPercentage] = useState(0);

	const calculatePercentages = () => {
		if (userQuery.isSuccess) {
			if (!userQuery.data.stats.totalGames) {
				setWinPercentage(0);
				setLossPercentage(0);
				return;
			}
			setWinPercentage(
				(userQuery.data.stats.totalLoss /
					userQuery.data.stats.totalGames) *
					100
			);
			setLossPercentage(
				(userQuery.data.stats.totalWin /
					userQuery.data.stats.totalGames) *
					100
			);
		}
	};

	useEffect(() => {
		calculatePercentages();
	}, [userQuery]);

	return (
		<div className="flex w-full flex-col rounded-[25px]">
			<div className="h-56 w-full">
				{userQuery.isSuccess ? (
					<img
						className="h-full w-full rounded-[25px] object-cover object-bottom"
						src={
							userQuery.data.banner
								? userQuery.data.banner
								: DefaultBanner
						}
						alt="banner"
					/>
				) : (
					<Skeleton className="h-full w-full rounded-[25px]" />
				)}
			</div>
			<div className="relative z-10 -mt-12 flex w-full flex-col rounded-[25px] border-t-4 border-[#2F2E5F] bg-[#27264E] p-4 shadow-lg">
				<div className="relative flex flex-row">
					<div className="mr-auto "></div>
					<div className="absolute bottom-4 left-0 right-0 ml-auto mr-auto lg:-bottom-2">
						<div className="mx-auto flex flex-col items-center">
							<Avatar2
								width={142}
								publicKey={publicKey}
								level={1}
								src={
									userQuery.isSuccess && userQuery.data.image
										? userQuery.data.image
										: DefaultAvatar
								}
							/>
						</div>
					</div>
					<div className="z-10 ml-auto flex gap-2.5 lg:hidden">
						<DiscordButton />
					</div>
				</div>
				<div className="mt-2 flex lg:hidden">
					<Name />
				</div>
				<div className="mt-6 flex items-center lg:hidden">
					<div className="mx-auto flex flex-col gap-2 text-center">
						<span className="text-xs font-semibold text-mute">
							Total Games
						</span>
						<span className="text-2xl font-semibold">
							{userQuery.isSuccess
								? userQuery.data.stats.totalGames
								: 0}
						</span>
					</div>
					<div className="mx-auto h-full w-0.5 bg-[#393869]"></div>
					<div className="mx-auto flex flex-col gap-2 text-center">
						<span className="text-xs font-semibold text-mute">
							Win
						</span>
						<span className="text-2xl font-semibold">
							{winPercentage.toFixed(2)}%
						</span>
					</div>
				</div>

				<div className="relative mt-6 hidden w-full items-center lg:flex">
					<div className="mr-auto flex w-full max-w-[400px]">
						<div className="mx-auto flex flex-col gap-2 text-center">
							<span className="text-xs font-semibold text-mute">
								Total Games
							</span>
							<span className="text-2xl font-semibold">
								{userQuery.isSuccess
									? userQuery.data.stats.totalGames
									: 0}
							</span>
						</div>
						<div className="mx-auto min-h-full w-0.5 bg-[#393869]"></div>
						<div className="mx-auto flex flex-col gap-2 text-center">
							<span className="text-xs font-semibold text-mute">
								Win
							</span>
							<span className="text-2xl font-semibold">
								{winPercentage.toFixed(2)}%
							</span>
						</div>
					</div>
					<div className="hidden lg:flex">
						<Name />
					</div>
					<div className="ml-auto flex w-full max-w-[400px]">
						<div className="ml-auto flex gap-4">
							<DiscordButton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;
