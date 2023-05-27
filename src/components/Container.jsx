import React from "react";

const Container = ({ children, className }) => {
	return (
		<div
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
			className={`flex w-11/12 max-w-[600px] flex-col items-center
            rounded-3xl bg-[#25244E] p-6 text-light shadow-xl ${className}`}
		>
			{children}
		</div>
	);
};

export default Container;
