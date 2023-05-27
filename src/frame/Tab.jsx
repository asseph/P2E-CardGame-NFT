import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TokenLogo from "../components/TokenLogo";

const Tab = ({
	path,
	name,
	type,
	icon,
	onClick,
	tokenTicker,
	iconClassName,
}) => {
	const location = useLocation();
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		setSelected(location.pathname === path);
	}, [location.pathname]);

	switch (type) {
		case "dashboard":
			return (
				<Link to={path} className="flex items-center ">
					<span className="w-7">
						<img src={icon} />
					</span>
					<span className="ml-2 font-semibold">{name}</span>
				</Link>
			);
		case "jackpot":
			return (
				<Link
					to={path}
					onClick={(e) => {
						if (name === "Create Room") {
							e.preventDefault();
							onClick();
						}
					}}
					className={
						`flex items-center rounded-lg border-[2.6px] border-[#49487C]
                        bg-[#393869] px-2 py-2  transition
                    ` +
						(() => {
							if (selected) {
								return "border-opacity-100 bg-opacity-100";
							}
							return "border-opacity-30 bg-opacity-30 hover:border-opacity-50 hover:bg-opacity-70";
						})()
					}
				>
					<span className={`w-7 ${iconClassName}`}>
						<img src={icon} />
					</span>
					<span className="ml-1 font-semibold">{name}</span>
					<TokenLogo
						ticker={tokenTicker}
						className="ml-auto h-5 w-5"
					/>
				</Link>
			);
		case "additional":
			return (
				<a href={path} className="flex items-center" target="_blank">
					<span className="font-semibold">{name}</span>
				</a>
			);
	}

	return null;
};

export default Tab;
