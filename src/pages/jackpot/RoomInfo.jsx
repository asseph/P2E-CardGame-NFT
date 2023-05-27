import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { getRoom } from "../../api/room";

const RoomInfo = () => {
	const { roomID } = useParams();

	const wallet = useWallet();

	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	if (roomQuery.isError || roomQuery.isLoading) {
		// Return an empty div if there is no data
		return <div />;
	}

	return (
		<div className="flex w-full rounded-3xl border-2 border-[#2F2E5F] bg-[#25244E] p-4">
			<span className="flex w-full items-center">
				<span className="flex-grow text-lg font-semibold">
					{roomQuery.data.name}
				</span>
				<span
					className={
						` ml-auto flex items-center text-lg font-semibold ` +
						(() => {
							if (roomQuery.data.creatorFeeBasisPoints > 0) {
								return "text-red";
							}
							return "text-green";
						})()
					}
				>
					{(roomQuery.data.creatorFeeBasisPoints / 100)
						.toFixed(2)
						.toString() + "%"}{" "}
					Creator Fee
				</span>
			</span>
		</div>
	);
};

export default RoomInfo;
