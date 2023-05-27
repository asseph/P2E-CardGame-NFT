import React, { useContext } from "react";
import { PopupContext } from "../../Context";
import Container from "../../components/Container";
import MyNFTs from "./MyNFTs";

import pop from "../../components/assets/pop.mp3";

const MyNFTsPopup = () => {
	const { hidePopup } = useContext(PopupContext);

	return (
		<Container className="h-[500px]">
			<MyNFTs className="min-h-0 w-full" />
			<button
				onClick={() => {
					const popClone = new Audio(pop);
					popClone.volume = 0.2;
					popClone.play();
					hidePopup();
				}}
				style={{
					background:
						"radial-gradient(132.75% 155.27% at 31.94% -11.82%, #9186FF 0%, #6D61FF 33.87%, #574AFF 91.62%)",
				}}
				className="mt-4 h-11 w-1/2 rounded-xl"
			>
				<span className="font-bold">Continue</span>
			</button>
		</Container>
	);
};

export default MyNFTsPopup;
