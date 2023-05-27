import React from "react";
import { useContext } from "react";
import { PopupContext } from "../Context";
import Container from "./Container";
import ErrorIcon from "./ErrorIcon";

const Error = ({ children }) => {
	const { hidePopup } = useContext(PopupContext);

	return (
		<Container>
			<div className="my-6 mx-auto h-[90px] w-[90px]">
				<ErrorIcon />
			</div>
			<span className="text-3xl font-semibold text-light">Error!</span>
			<div className="my-5 text-center font-normal text-light">
				{children}
			</div>
			<button
				onClick={hidePopup}
				style={{
					background:
						"radial-gradient(132.75% 155.27% at 31.94% -11.82%, #9186FF 0%, #6D61FF 33.87%, #574AFF 91.62%)",
				}}
				className="mt-1 w-1/4 text-white"
				name="OK"
			/>
		</Container>
	);
};

export default Error;
