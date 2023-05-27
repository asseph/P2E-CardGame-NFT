import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React, { useContext, useEffect, useState } from "react";
import Divider from "../../components/Divider";
import { base58ToColor } from "../../util/color";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

import arrow from "./assets/arrow.svg";
import whoosh from "./assets/whoosh.mp3";
import Countdown from "./Countdown";
import { formatToken, shortenAddress } from "../../util/util";
import TokenLogo from "../../components/TokenLogo";
import { PopupContext } from "../../Context";

import DefaultAvatar from "../profile/assets/defaultAvatar.png";

const Replay = ({ users, value, result, token }) => {
	const { hidePopup } = useContext(PopupContext);

	return (
		<div className="flex w-full flex-col text-left">
			<span className="flex items-center font-semibold text-light">
				<div className="mr-2 h-4 w-4 rounded-full bg-red"></div>
				Watch Replay
			</span>
			<Divider className="my-3" />
			<div className="mx-auto mt-6 w-3/4 max-w-xs">
				<AspectRatio ratio={1 / 1}>
					<Wheel
						users={users}
						value={value}
						result={result}
						token={token}
					/>
				</AspectRatio>
			</div>
			<div className="mt-4">
				<Pot users={users} token={token} />
			</div>
			<Divider className="my-3" />
			<button
				onClick={() => {
					hidePopup();
				}}
				style={{
					background:
						"radial-gradient(132.75% 155.27% at 31.94% -11.82%, #9186FF 0%, #6D61FF 33.87%, #574AFF 91.62%)",
				}}
				className="flex h-11 flex-grow items-center justify-center rounded-xl"
			>
				<span className="font-bold">OK</span>
			</button>
		</div>
	);
};

const Wheel = ({ users, value, result, token }) => {
	const [pieBackground, setPieBackground] = useState("#312F54");
	const [animate, setAnimate] = useState("");
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((prevData) => {
				if (prevData < 0) {
					return prevData;
				}
				return prevData - 1;
			});
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (users.length === 1) {
			setPieBackground(base58ToColor(users[0].publicKey).hex);
			return;
		}

		let lastPercentage = 0;
		const parts = users.map((user, i) => {
			const color = base58ToColor(user.publicKey);
			const addZero = i === 0 ? "" : "0 ";
			const percentage = lastPercentage + (user.value * 100) / value;

			lastPercentage = percentage;

			return `${color.hex} ${addZero} ${percentage}%`;
		});

		const bg = `conic-gradient(
			${parts.join(",")}
		)`;

		setPieBackground(bg);
	}, [users, value]);

	useEffect(() => {
		if (countdown >= 0) {
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
	}, [result, countdown]);

	return (
		<div className="relative h-full w-full">
			<div className="absolute left-0 right-0 -top-[22%] z-50 mx-auto flex w-1/3 flex-col items-center">
				<img className="" src={arrow} alt="" />
			</div>
			<motion.div
				style={{
					background: pieBackground,
					animationName: animate,
					animationDuration: "7s",
					animationTimingFunction:
						"cubic-bezier(0.25, 0.01, 0.01, 0.98)",
					animationFillMode: "forwards",
				}}
				className="absolute top-0 left-0 h-full w-full rounded-full
                border-2 border-white border-opacity-50 shadow-lg"
			>
				{(() => {
					let lastPercentage = 0;

					return users.map((user) => {
						const percentage =
							lastPercentage + (user.value * 100) / value;

						lastPercentage = percentage;

						return (
							<div
								style={{
									rotate: `${(360 * percentage) / 100}deg`,
								}}
								key={user.publicKey}
								className={`absolute top-0 left-0 z-10 flex h-full w-full rounded-full`}
							>
								<div className="relative mx-auto h-1/2 w-0.5 bg-light"></div>
							</div>
						);
					});
				})()}
			</motion.div>
			<div
				style={{
					background:
						"linear-gradient(270.18deg, #493B9A 0.17%, #302475 19.9%, #24235C 50.02%, #302475 74.94%, #493B9A 99.87%)",
				}}
				className="absolute left-1/2 top-1/2 z-20 h-3/4 w-3/4 -translate-y-1/2 -translate-x-1/2
				rounded-full border-2 border-white border-opacity-50"
			>
				<div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
					<div className="flex flex-col">
						<span className="text-sm font-bold text-mute">
							Total Value
						</span>
						<span className="text-xl font-bold text-light xl:text-2xl">
							{formatToken(value, token)}
						</span>
					</div>
					<Countdown countdown={countdown} maxCountdown={40} />
				</div>
			</div>
		</div>
	);
};

const Pot = ({ users, token }) => {
	return (
		<div
			className="flex max-h-[320px] w-full flex-col gap-4 overflow-y-auto rounded-3xl border-2 border-[#2F2E5F]
			bg-[#25244E] p-4"
		>
			{users.map((user) => (
				<>
					<User {...user} token={token} key={user.publicKey} />
				</>
			))}
		</div>
	);
};

const User = ({ publicKey, value, profile, token }) => {
	const color = base58ToColor(publicKey).hex;
	const [imgError, setImgError] = useState(false);

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
				<>
					<TokenLogo className="mr-2 h-4 w-4" ticker={token.ticker} />
					{formatToken(value, token)}
				</>
			</span>
		</div>
	);
};

export default Replay;
