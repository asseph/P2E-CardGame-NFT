import React from "react";

import Logo from "./assets/logo.png";
import Menu from "./assets/menu.svg";
import { Link } from "react-router-dom";

const Topbar = ({ cycleSidebarOpen }) => {
	return (
		<div className="flex h-20 w-full items-center bg-[#35356B] md:hidden">
			<Link to="/" className="flex items-center">
				<img
					src={Logo}
					alt="Solanashuffle logo"
					className="ml-2 h-12"
				/>
				<span className="ml-2 text-lg font-black uppercase">
					Solanashuffle
				</span>
			</Link>
			<button
				onClick={cycleSidebarOpen}
				className="ml-auto mr-4 grid h-11
                w-11 place-content-center rounded-xl border-2 border-[#49487C]"
			>
				<img className="h-4 w-4" src={Menu} alt="" />
			</button>
		</div>
	);
};

export default Topbar;
