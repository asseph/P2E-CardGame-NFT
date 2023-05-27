import React, { useState } from "react";
import Avatar2 from "../../components/Avatar2";
import { base58ToColor } from "../../util/color";
import {
	currentFormatTime,
	formatToken,
	shortenAddress,
	solToken,
} from "../../util/util";
import DefaultAvatar from "../profile/assets/defaultAvatar.png";

const User = ({ skeleton, name, image, publicKey, stats, amount, rank }) => {
	const [imgError, setImgError] = useState(false);

	if (!publicKey) {
		return null;
	}

	if (skeleton) {
		return null;
	}

	return (
		<div className="flex min-h-[36px] w-full items-center rounded-lg px-4 text-left text-xs sm:min-h-[52px] sm:text-sm">
			<span className="mr-1 w-4 text-left font-semibold text-mute lg:mr-3">
				{rank + 1}.
			</span>
			<div className="mr-auto flex items-center">
				<div className="rounded-full">
					{image && !imgError ? (
						<Avatar2
							onError={() => {
								setImgError(true);
							}}
							width={32}
							publicKey={publicKey}
							src={image}
						/>
					) : (
						<Avatar2
							width={32}
							publicKey={publicKey}
							src={DefaultAvatar}
						></Avatar2>
					)}
				</div>
				<span className="ml-2 w-[86px] overflow-hidden overflow-ellipsis font-semibold">
					{name ? name : shortenAddress(publicKey)}
				</span>
			</div>
			<span className="mx-auto hidden w-8 font-semibold text-mute sm:block">
				{stats.totalGames}
			</span>
			<span className="mx-auto w-[80px] font-semibold text-green sm:w-[96px]">
				{formatToken(amount, solToken)}
			</span>
			<span className="ml-auto w-8 text-right font-semibold text-light">
				{stats.games && stats.games[currentFormatTime()]
					? stats.games[currentFormatTime()]
					: 0}
			</span>{" "}
		</div>
	);
};

export default User;
