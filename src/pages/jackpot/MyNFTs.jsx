import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { getUserNFTs } from "../../api/user";
import Skeleton from "../../components/Skeleton";
import NFTLogo from "./assets/nftLogo.svg";
import { AssetsContext } from "../../Context";
import NFT from "./NFT";

const MyNFTs = ({ className }) => {
	const wallet = useWallet();

	const nftQuery = useQuery({
		queryKey: ["nfts", wallet.publicKey],
		queryFn: () => getUserNFTs(wallet.publicKey),
	});

	return (
		<div className={`flex h-full min-h-[500px] flex-col ${className}`}>
			<div className="flex items-center">
				<img className="w-[18px]" src={NFTLogo} alt="NFT" />
				<span className="ml-2 font-extrabold">My NFTs</span>
				<span className="ml-auto text-sm font-medium text-mute">
					Price: High to low
				</span>
			</div>
			<div className="relative h-full">
				<div
					className="absolute top-0 left-0 grid
				  	h-full w-full grid-cols-2 gap-2 overflow-y-scroll pt-2 scrollbar-hide sm:grid-cols-3 lg:grid-cols-2 1.5xl:grid-cols-4"
				>
					{nftQuery.isSuccess
						? nftQuery.data
							? nftQuery.data.map((nft) => {
									return <NFT {...nft} key={nft.mint} />;
							  })
							: Array()
						: Array(10)
								.fill("a")
								.map((_, i) => {
									return (
										<Skeleton
											key={i}
											className="h-52 rounded-2xl shadow-lg lg:h-40"
										/>
									);
								})}
				</div>
				<div className="absolute bottom-0 z-10 h-24 w-full bg-gradient-to-t from-[#25244E] to-transparent"></div>
			</div>
		</div>
	);
};

export default MyNFTs;
