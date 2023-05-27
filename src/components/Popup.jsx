import { useContext } from "react";
import { PopupContext } from "../Context";

const Popup = () => {
	const { popup, hidePopup } = useContext(PopupContext);

	return (
		<div
			onClick={() => {
				if (!popup.lock) {
					hidePopup();
				}
			}}
			id="popup"
			className="
            popup absolute top-0 left-0 right-0 
            bottom-0 z-50 flex
            h-screen w-screen flex-col
            overflow-hidden bg-[#171649] bg-opacity-20 backdrop-blur-md"
		>
			<div
				id="popup-content"
				className="popup-scale z-50 m-auto flex w-full flex-col items-center text-center"
			>
				{popup.html !== undefined ? popup.html : null}
			</div>
		</div>
	);
};

export default Popup;
