import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getStats } from "../../api/stats";
import Chat from "../../frame/Chat";
import { currentFormatTime } from "../../util/util";

import Podium from "./assets/podium.svg";
import User from "./User";

const Leaderboards = () => {
	const statsQuery = useQuery({
		queryKey: ["stats"],
		queryFn: () => getStats(),
	});

	return (
		<div className="relative flex w-full flex-row overflow-y-scroll bg-center py-5 lg:p-8">
			<div className="flex h-min w-full flex-col gap-5 px-5 lg:gap-8 2xl:flex-row">
				<div className="flex w-full flex-col rounded-[25px] bg-[#25244E]">
					<div
						style={{
							borderTopLeftRadius: "25px",
							borderTopRightRadius: "25px",
						}}
						className="flex h-20 items-center border-b-2 border-[#2F2E5F] bg-[#201F48] bg-opacity-70 px-5 py-3"
					>
						<span className="ml-3 flex items-center text-sm font-extrabold uppercase sm:text-lg md:text-xl">
							<img className="mr-3 w-5" src={Podium} alt="" />
							Top users by{" "}
							<span className="mx-1.5 text-green">
								{" "}
								24h{" "}
							</span>{" "}
							volume
						</span>
					</div>
					<div className="flex h-full w-full flex-col px-5 py-3">
						<div
							className="flex h-7 w-full items-center
                        rounded-full px-4 text-left text-xs text-mute sm:text-sm"
						>
							<span className="mr-1 w-4 text-left font-semibold lg:mr-3"></span>{" "}
							<div className="mr-auto w-[118px] font-semibold">
								User
							</div>
							<div className="relative mx-auto hidden h-[16px] w-8 sm:block sm:h-[20px]">
								<span className="absolute w-20 font-semibold">
									Total Games
								</span>
							</div>
							<span className="mx-auto w-[80px] font-semibold sm:w-[96px]">
								Amount
							</span>
							<div className="relative ml-auto h-[16px] w-8 sm:h-[20px]">
								<span className="absolute right-0 w-20 text-right font-semibold">
									24h Games
								</span>{" "}
							</div>
						</div>
						<div className="relative mt-2 h-full max-h-full min-h-[360px]">
							<div
								className="absolute top-0 left-0 flex
                        max-h-full w-full flex-col overflow-y-scroll scrollbar-hide [&>*:nth-child(odd)]:bg-[#201F48]"
							>
								{statsQuery.isSuccess
									? statsQuery.data.todayVolume.map(
											(user, i) => {
												return (
													<User
														key={user.publicKey}
														amount={
															user.stats.volumes[
																currentFormatTime()
															]
														}
														rank={i}
														{...user}
													/>
												);
											}
									  )
									: new Array(10).fill("a").map((_, i) => {
											return null;
									  })}
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col rounded-[25px] bg-[#25244E]">
					<div
						style={{
							borderTopLeftRadius: "25px",
							borderTopRightRadius: "25px",
						}}
						className="flex h-20 items-center border-b-2 border-[#2F2E5F] bg-[#201F48] bg-opacity-70 px-5 py-3"
					>
						<span className="ml-3 flex items-center text-sm font-extrabold uppercase sm:text-lg md:text-xl">
							<img className="mr-3 w-5" src={Podium} alt="" />
							Top users by{" "}
							<span className="mx-1.5 text-green">
								{" "}
								all-time{" "}
							</span>{" "}
							volume
						</span>
					</div>
					<div className="flex h-full w-full flex-col px-5 py-3">
						<div
							className="flex h-7 w-full items-center
                        rounded-full px-4 text-left text-xs text-mute sm:text-sm"
						>
							<span className="mr-1 w-4 text-left font-semibold lg:mr-3"></span>{" "}
							<div className="mr-auto w-[118px] font-semibold">
								User
							</div>
							<div className="relative mx-auto hidden h-[16px] w-8 sm:block sm:h-[20px]">
								<span className="absolute w-20 font-semibold">
									Total Games
								</span>
							</div>
							<span className="mx-auto w-[80px] font-semibold sm:w-[96px]">
								Amount
							</span>
							<div className="relative ml-auto h-[16px] w-8 sm:h-[20px]">
								<span className="absolute right-0 w-20 text-right font-semibold">
									24h Games
								</span>{" "}
							</div>
						</div>
						<div className="relative mt-2 h-full max-h-full min-h-[360px]">
							<div
								className="absolute top-0 left-0 flex
                        max-h-full w-full flex-col overflow-y-scroll scrollbar-hide [&>*:nth-child(odd)]:bg-[#201F48]"
							>
								{statsQuery.isSuccess
									? statsQuery.data.totalVolume.map(
											(user, i) => {
												return (
													<User
														key={user.publicKey}
														amount={
															user.stats
																.totalVolume
														}
														rank={i}
														{...user}
													/>
												);
											}
									  )
									: new Array(10).fill("a").map((_, i) => {
											return null;
									  })}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="sticky right-0 top-0 z-10 ml-5 hidden h-full min-w-[288px] lg:ml-8 xl:flex">
				<Chat />
			</div>
		</div>
	);
};

export default Leaderboards;
