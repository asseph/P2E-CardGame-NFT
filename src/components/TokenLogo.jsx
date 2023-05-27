import React from "react";

import solana from "./assets/solana.svg";

const TokenLogo = ({ ticker, className }) => {
	return (
		<div
			className={`bg-vgray-900 grid h-8
            w-8 place-content-center rounded-full ring-opacity-70 transition ${className}`}
			target="_blank"
		>
			{ticker == "SOL" ? (
				<div className="rounded-full bg-[#201F48] p-[20%]">
					<img src={solana} alt={ticker} />
				</div>
			) : (
				<img
					className="rounded-full"
					src={`${import.meta.env.VITE_CDN}/images/${ticker}.png`}
					alt={ticker}
				/>
			)}
		</div>
	);
};

export default TokenLogo;
