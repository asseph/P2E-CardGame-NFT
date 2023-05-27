import React, { useContext, useEffect } from "react";
import Divider from "../components/Divider";
import Logo from "./assets/logo.png";
import Planet from "./assets/planet.svg";
import Podium from "./assets/podium.svg";
import Infinite from "./assets/infinite.svg";
import Whale from "./assets/whale.svg";
import Shrimp from "./assets/shrimp.svg";
import Seaweed from "./assets/seaweed.png";

import "./sidebar.css";
import Tab from "./Tab";
import WalletButton from "../components/WalletButton";
import { UserContext } from "../Context";
import { Link } from "react-router-dom";
import ProfileTab from "./ProfileTab";

const dashboardTabs = [
	{
		path: "/",
		name: "Home page",
		icon: Planet,
	},
	{
		path: "/leaderboards",
		name: "Leaderboards",
		icon: Podium,
	},
];

const jackpotTabs = [
	{
		path: `/jackpot/${import.meta.env.VITE_OFFICIAL_ROOM_1}`,
		name: "Infinite Room",
		icon: Infinite,
		tokenTicker: "SOL",
	},
	{
		path: `/jackpot/${import.meta.env.VITE_OFFICIAL_ROOM_3}`,
		name: "Shrimp Room",
		icon: Shrimp,
		tokenTicker: "SOL",
		iconClassName: "pl-1",
	},
	{
		path: `/jackpot/${import.meta.env.VITE_OFFICIAL_ROOM_4}`,
		name: "Seaweed Room",
		icon: Seaweed,
		tokenTicker: "SOL",
	},
	{
		path: `/jackpot/${import.meta.env.VITE_OFFICIAL_ROOM_BONK}`,
		name: "Infinite Room",
		icon: Infinite,
		tokenTicker: "BONK",
	},
];

const additionalTabs = [
	{
		path: "https://twitter.com/ImmortalsSOL",
		name: "Twitter",
	},
	{
		path: "https://discord.gg/immortalssol",
		name: "Discord",
	},
];

const Sidebar = ({ cycleSidebarOpen }) => {
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		const websocket = new WebSocket(`${import.meta.env.VITE_WS}/stats`);
		websocket.onopen = () => {
			console.log("connected");
		};
		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case "stats":
					setUser((prevData) => ({
						...prevData,
						onlinePlayers: data.value.onlinePlayers,
					}));
			}
		};
	}, []);

	return (
		<div className="flex h-screen w-[260px] flex-col overflow-y-auto bg-[#25244E] shadow-xl scrollbar-hide">
			<Link to="/" className="flex min-h-[80px] w-full items-center">
				<img src={Logo} alt="Solanashuffle logo" className="ml-2" />
				<span className="ml-2 text-lg font-black uppercase">
					Solanashuffle
				</span>
			</Link>
			<div className="flex flex-col px-6 py-3">
				<div className="flex flex-col gap-2">
					<ProfileTab />
					<WalletButton />
				</div>

				<Divider className="my-5" />
				<div className="flex flex-col">
					<span className="font-bold text-mute">Dashboard</span>
					<div className="mt-5 flex flex-col gap-4">
						{dashboardTabs.map((data) => {
							return (
								<Tab
									cycleSidebarOpen={cycleSidebarOpen}
									{...data}
									key={data.path}
									type="dashboard"
								/>
							);
						})}
					</div>
				</div>
				<Divider className="my-5" />
				<div className="flex flex-col">
					<span className="font-bold text-mute">Official Rooms</span>
					<div className="mt-5 flex flex-col gap-4">
						{jackpotTabs.map((data) => {
							return (
								<Tab
									cycleSidebarOpen={cycleSidebarOpen}
									{...data}
									key={data.path}
									type="jackpot"
								/>
							);
						})}
					</div>
				</div>
				<Divider className="my-5" />
				<div className="flex flex-col">
					<span className="font-bold text-mute">
						Additional Information
					</span>
					<div className="mt-5 flex flex-col gap-4">
						{additionalTabs.map((data) => {
							return (
								<Tab
									cycleSidebarOpen={cycleSidebarOpen}
									{...data}
									key={data.path}
									type="additional"
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
