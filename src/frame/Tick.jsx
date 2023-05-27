import React from "react";

const Tick = ({ height, width }) => {
	return (
		<svg
			height={height}
			width={width}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
		>
			<path
				d="M23.15,5.4l-2.8-2.8a.5.5,0,0,0-.7,0L7.85,14.4a.5.5,0,0,1-.7,0l-2.8-2.8a.5.5,0,0,0-.7,0L.85,14.4a.5.5,0,0,0,0,.7l6.3,6.3a.5.5,0,0,0,.7,0L23.15,6.1A.5.5,0,0,0,23.15,5.4Z"
				fill="currentColor"
			></path>
		</svg>
	);
};

export default Tick;
