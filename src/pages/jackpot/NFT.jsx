import { useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../../api/room";
import { getMetadata } from "../../api/user";
import TokenLogo from "../../components/TokenLogo";
import { calculateUserAssets } from "../../util/room";
import { formatToken, readableToken, solToken } from "../../util/util";

import Check from "./assets/check.svg";
import { AssetsContext } from "../../Context";

const NFT = ({
	price,
	mint,
	metadataURL,
	collectionSymbol,
	hadeswapMarket,
}) => {
	const wallet = useWallet();

	const queryClient = useQueryClient();

	const { assets, setAssets } = useContext(AssetsContext);

	const { roomID } = useParams();
	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const metadataQuery = useQuery({
		queryKey: ["nft", mint],
		queryFn: () => getMetadata(metadataURL),
		onError: () => {
			queryClient.setQueryData(["nfts", wallet.publicKey], (oldData) => {
				return oldData.filter((nft) => nft.mint != mint);
			});
		},
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		cacheTime: Infinity,
		staleTime: 1000 * 60 * 60 * 24,
	});

	const [selected, setSelected] = useState(false);

	useEffect(() => {
		setSelected(
			assets.findIndex((asset) => asset.mint == mint) != -1 ||
				(roomQuery.isSuccess &&
					calculateUserAssets(
						roomQuery.data,
						wallet.publicKey
					).findIndex((asset) => asset.mint === mint) != -1)
		);
	}, [assets]);

	const toggleSelect = async () => {
		setAssets((prevData) => {
			let clone = [...prevData];
			if (!selected) {
				clone.push({
					type: "NFT",
					price,
					mint,
					metadataURL,
					collectionSymbol,
					hadeswapMarket,
				});
				return clone;
			}
			return clone.filter((asset) => asset.mint != mint);
		});
	};

	return (
		<button
			onClick={toggleSelect}
			disabled={
				price === 0 ||
				(roomQuery.isSuccess &&
					calculateUserAssets(
						roomQuery.data,
						wallet.publicKey
					).findIndex((asset) => asset.mint === mint) != -1)
			}
			className={`relative flex h-52 overflow-hidden rounded-2xl bg-[#393869] shadow-lg lg:h-40 ${
				roomQuery.isSuccess &&
				calculateUserAssets(roomQuery.data, wallet.publicKey).findIndex(
					(asset) => asset.mint === mint
				) != -1 &&
				"cursor-not-allowed"
			}`}
		>
			{price === 0 ? (
				<div
					className="absolute top-0 
                    bottom-0 z-10 grid h-full w-full place-content-center rounded-2xl border-2 border-mute border-opacity-50 bg-mute bg-opacity-30 backdrop-blur-sm"
				></div>
			) : null}
			<div className="h-44 p-1.5">
				{metadataQuery.isSuccess ? (
					<img
						style={{
							borderTopLeftRadius: "16px",
							borderTopRightRadius: "16px",
						}}
						className="object-cover object-bottom"
						src={metadataQuery.data.image}
						alt=""
					/>
				) : (
					<div
						style={{
							borderTopLeftRadius: "16px",
							borderTopRightRadius: "16px",
						}}
						className="h-full w-full"
					></div>
				)}
			</div>
			<div className="absolute bottom-0 h-14 w-full ">
				<div
					className="relative flex h-full w-full flex-col justify-center bg-[#3D3C6D]
                 bg-opacity-90 px-3 text-left backdrop-blur-sm"
				>
					<span className="overflow-hidden overflow-ellipsis  whitespace-nowrap text-sm font-bold">
						{metadataQuery.isSuccess
							? metadataQuery.data.name
							: "Loading..."}
					</span>
					<span className="flex items-center text-sm font-semibold text-mute">
						<TokenLogo
							className=" !h-[18px] !w-[18px]"
							{...solToken}
						/>
						<span className="ml-1">
							{readableToken(price, solToken)}
						</span>
					</span>
					<div
						className={`absolute right-1.5 -top-[19px]
                        grid h-9 w-9 place-content-center rounded-full border-2 shadow-2xl backdrop-blur-lg transition
                        ${
							selected
								? " border-[#00E28C] bg-[#00E28C] bg-opacity-30"
								: "border-[#B6B5D0] border-opacity-25 bg-[#6B6A98] bg-opacity-20 text-light"
						}`}
					>
						<span className="text-lg font-bold">
							{!selected ? (
								"+"
							) : (
								<img className="h-4 w-4" src={Check} />
							)}
						</span>
					</div>
				</div>
			</div>
		</button>
	);
};

export default NFT;
