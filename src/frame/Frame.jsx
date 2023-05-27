import React, { useContext } from "react";
import Sidebar from "./Sidebar";

import Logo from "./assets/logo.png";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import Topbar from "./Topbar";
import { PopupContext } from "../Context";
import Popup from "../components/Popup";

const Frame = ({ children }) => {
	const { popup } = useContext(PopupContext);

	const [sidebarOpen, cycleSidebarOpen] = useCycle(false, true);

	return (
		<>
			{popup.show ? <Popup /> : null}
			<div className="flex h-screen w-screen bg-[#171649] text-light">
				<AnimatePresence className="md:hidden ">
					{sidebarOpen && (
						<motion.div className="absolute top-0 left-0 z-30 flex h-screen w-screen">
							<motion.div
								initial={{
									opacity: 0,
								}}
								animate={{
									opacity: 100,
								}}
								exit={{
									opacity: 0,
								}}
								onClick={cycleSidebarOpen}
								className="absolute top-0 left-0 flex h-screen w-screen bg-[#1E1E1E] bg-opacity-20 backdrop-blur-sm"
							></motion.div>
							<motion.aside
								initial={{
									transform: "translateX(-100%)",
									transition: {
										duration: 0.2,
										ease: "linear",
									},
								}}
								animate={{
									transform: "translateX(0%)",
									transition: {
										duration: 0.3,
										ease: "easeOut",
									},
								}}
								exit={{
									transform: "translateX(-100%)",
									transition: {
										duration: 0.2,
										ease: "linear",
									},
								}}
								className="w-[260px] min-w-[260px] max-w-[260px]"
							>
								<Sidebar />
							</motion.aside>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="hidden w-[260px] min-w-[260px] max-w-[260px] md:block">
					<Sidebar cycleSidebarOpen={cycleSidebarOpen} />
				</div>
				<div className="flex h-screen w-full flex-col">
					<Topbar cycleSidebarOpen={cycleSidebarOpen} />
					<div className="relative flex h-full w-full overflow-hidden">
						<Outlet />
						{children}
					</div>
				</div>
			</div>
		</>
	);
};

export default Frame;
