import React from "react";

import "./skeleton.css";

const Skeleton = ({ className }) => {
	return (
		<div
			className={`shimmer flex rounded-lg bg-gradient-to-r from-[#393869]  via-[#25244E] to-[#393869]  shadow-lg ${className}`}
		></div>
	);
};

export default Skeleton;
