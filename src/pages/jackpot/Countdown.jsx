import React from "react";

export const MAX_COUNTDOWN = 1_000_000_000 * 40;

const Countdown = ({ countdown, maxCountdown }) => {
	if (countdown < 0) {
		countdown = 0;
	}

	return (
		<div className="mt-0.5 flex w-32 flex-col items-center md:mt-0 1.5xl:w-44">
			<span className="hidden text-sm font-bold text-mute md:flex">
				Countdown
			</span>
			<div
				style={{
					boxShadow:
						"inset 0px 5.0297px 3.77228px rgba(0, 0, 0, 0.24)",
				}}
				className="relative h-3 w-full rounded-full bg-[#1C1B42]"
			>
				<div
					style={{
						width: `${(1 - countdown / maxCountdown) * 100}%`,
						background:
							"radial-gradient(191.08% 125.83% at 26.69% 10%, #FFE0A8 2.08%, #FFD88F 26.92%, #F3C062 46.85%, #EAA629 91.62%)",
					}}
					className="absolute top-0 left-0 h-3 rounded-full transition-all"
				></div>
			</div>
		</div>
	);
};

Countdown.defaultProps = {
	maxCountdown: MAX_COUNTDOWN,
};

export default Countdown;
