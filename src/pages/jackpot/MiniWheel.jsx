import React, { useEffect, useState } from "react";
import { base58ToColor } from "../../util/color";

import arrow from "./assets/arrow.svg";

const MiniWheel = ({ users, value, className, spinValue }) => {
	const [pieBackground, setPieBackground] = useState("#312F54");

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

	return (
		<div className={`relative ${className}`}>
			<div className="absolute left-0 right-0 -top-[22%] z-50 mx-auto flex w-1/3 flex-col items-center">
				<img className="" src={arrow} alt="" />
			</div>
			<div
				style={{
					background: pieBackground,
					rotate: `${360 - (spinValue * 360) / 10000}deg`,
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
			</div>
			<div
				style={{
					background:
						"linear-gradient(270.18deg, #493B9A 0.17%, #302475 19.9%, #24235C 50.02%, #302475 74.94%, #493B9A 99.87%)",
				}}
				className="absolute left-1/2 top-1/2 z-20 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 
				rounded-full border-2 border-white border-opacity-50"
			></div>
		</div>
	);
};

export default MiniWheel;
