import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../../api/room";
import Divider from "../../components/Divider";
import TokenLogo from "../../components/TokenLogo";
import WalletButton from "../../components/WalletButton";
import MyToken from "./MyToken";
import { calculateAssetsValue, calculateUserValue } from "../../util/room";
import { formatToken } from "../../util/util";
import MyNFTs from "./MyNFTs";
import BetButton from "./BetButton";
import Chat from "../../frame/Chat";
import { AssetsContext } from "../../Context";

const BetAmount = ({ className, children }) => {
	const wallet = useWallet();

	const [mode, setMode] = useState("Token");

	const { roomID } = useParams();
	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const { assets, setAssets } = useContext(AssetsContext);

	return (
		<>
			<div
				className={`flex flex-col rounded-3xl bg-[#25244E] ${className} max-h-full ${
					mode === "NFT" && "h-full"
				}`}
			>
				<div
					style={{
						borderTopLeftRadius: "24px",
						borderTopRightRadius: "24px",
					}}
					className="flex min-h-[80px] flex-col justify-center border-b-2 border-[#393869] bg-[#201F48] bg-opacity-70"
				>
					<span className="ml-8 flex items-center text-lg font-bold text-mute lg:ml-4">
						Your Value:{" "}
						<span className="ml-4 flex items-center gap-1 lg:ml-2">
							<span className="text-light">
								{roomQuery.isSuccess
									? calculateAssetsValue(assets) > 0
										? formatToken(
												calculateAssetsValue(assets) +
													calculateUserValue(
														roomQuery.data,
														wallet.publicKey
													),
												roomQuery.data.token
										  )
										: formatToken(
												calculateUserValue(
													roomQuery.data,
													wallet.publicKey
												),
												roomQuery.data.token
										  )
									: "..."}
							</span>
						</span>
					</span>
				</div>
				<div className="flex h-[calc(100%-80px)] flex-col p-4">
					<div
						style={{
							boxShadow:
								"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
						}}
						className="flex min-h-[44px] w-full gap-3 rounded-xl bg-[#201F48] p-1.5"
					>
						<button
							onClick={() => {
								setMode("Token");
							}}
							className={` flex w-full items-center justify-center rounded-xl border-2 transition ${
								mode == "Token"
									? "border-[#49487C] bg-[#393869] text-light transition"
									: "border-transparent text-mute hover:text-light"
							} `}
						>
							<span className="font-semibold">
								{roomQuery.isError || roomQuery.isLoading
									? "..."
									: roomQuery.data.token.ticker}
							</span>
						</button>
						<button
							onClick={() => {
								setMode("NFT");
							}}
							className={`flex w-full items-center justify-center rounded-xl border-2 transition ${
								mode == "NFT"
									? "border-[#49487C] bg-[#393869] text-light transition"
									: "border-transparent text-mute hover:text-light"
							} `}
						>
							<span className="font-semibold">NFT</span>
						</button>
					</div>
					<Divider className="my-4" />
					<div className="mb-4">
						<BetButton />
					</div>
					{wallet.publicKey ? (
						mode == "Token" ? (
							<MyToken
								setState={
									!roomQuery.isSuccess
										? () => {}
										: (amt) => {
												setAssets((prevData) => {
													let clone = [...prevData];
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
															mint: roomQuery.data
																.token
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
														asset.type == "Token"
												)
										  ) /
												Math.pow(
													10,
													roomQuery.data.token
														.decimals
												) ===
										  0
											? NaN
											: 0
										: 0
								}
							/>
						) : (
							<MyNFTs className={"h-[500px]"} />
						)
					) : (
						<div
							style={{
								boxShadow:
									"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
							}}
							className="flex w-full flex-col items-center justify-center rounded-xl bg-[#201F48] p-4"
						>
							<span className="mb-0.5 font-semibold text-mute">
								Log in to bet!
							</span>
							<WalletButton className="w-full" />
						</div>
					)}
				</div>
			</div>
			{mode === "Token" ? (
				<div className="hidden h-[300px] flex-grow lg:flex">
					{children}
				</div>
			) : null}
		</>
	);
};

export default BetAmount;
