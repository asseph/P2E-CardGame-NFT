import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom } from "../../api/room";
import Avatar2 from "../../components/Avatar2";
import TokenLogo from "../../components/TokenLogo";
import { base58ToColor } from "../../util/color";
import { formatToken, shortenAddress, solToken } from "../../util/util";

import DefaultAvatar from "../profile/assets/defaultAvatar.png";

const User = ({ publicKey, value, profile }) => {
	const color = base58ToColor(publicKey).hex;
	const [imgError, setImgError] = useState(false);

	const { roomID } = useParams();

	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	return (
		<div
			style={{
				boxShadow: "inset 0px 4.50668px 7.88669px rgba(0, 0, 0, 0.15)",
			}}
			className="flex h-9 items-center rounded-full bg-[#201F48] p-1"
		>
			<img
				onError={() => {
					setImgError(true);
				}}
				className="h-7 w-7 rounded-full"
				src={profile.image && !imgError ? profile.image : DefaultAvatar}
				alt=""
			/>
			<span
				style={{
					color,
				}}
				className="ml-1.5 text-sm font-medium"
			>
				{profile.name ? profile.name : shortenAddress(publicKey)}
			</span>
			<span className="ml-auto mr-4 flex items-center text-sm font-semibold">
				{roomQuery.isSuccess && (
					<>
						<TokenLogo
							className="mr-2 h-4 w-4"
							ticker={roomQuery.data.token.ticker}
						/>
						{formatToken(value, roomQuery.data.token)}
					</>
				)}
			</span>
		</div>
	);
};

const Pot = () => {
	const { roomID } = useParams();

	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	if (
		roomQuery.isError ||
		roomQuery.isLoading ||
		roomQuery.data.session.users.length === 0
	) {
		return (
			<div className="flex w-full rounded-3xl border-2 border-[#2F2E5F] bg-[#25244E] p-4">
				<span className="m-auto text-sm font-semibold text-mute sm:text-base">
					Noone has entered this room yet... Be the first! :{")"}
				</span>
			</div>
		);
	}

	return (
		<div className="grid w-full grid-cols-1 gap-x-8 gap-y-4 rounded-3xl border-2 border-[#2F2E5F] bg-[#25244E] p-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
			{roomQuery.isError || roomQuery.isLoading
				? null
				: roomQuery.data.session.users.map((user) => {
						return <User {...user} key={user.publicKey} />;
				  })}
		</div>
	);
};

export default Pot;
