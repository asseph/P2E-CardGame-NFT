import React, { useEffect, useRef, useState } from "react";
import { useWindowSize } from "../../util/hooks";

import meter from "./assets/meter.svg";
import meterArrow from "./assets/meterArrow.svg";

const WinChance = ({ chance, className }) => {
	const [rotation, setRotation] = useState("-90deg");
	const [height, setHeight] = useState(0);

	const size = useWindowSize();

	useEffect(() => {
		const r = -90 + 180 * (chance / 10000);

		setRotation(`${r}deg`);
	}, [chance]);

	const containerRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		setHeight(containerRef.current.clientHeight);
	}, [size.width]);

	return (
		<>
			<div ref={containerRef} className={`relative flex ${className}`}>
				<div className="relative flex">
					<img
						style={{
							height,
						}}
						src={meter}
						alt=""
					/>
					<div
						style={{
							rotate: rotation,
						}}
						className="absolute -left-[1%] right-0 bottom-[6%] mx-auto grid h-[1px] w-[1px] place-content-center transition-all"
					>
						<div
							style={{
								height: height,
								width: height,
							}}
							className="relative grid h-[120px] w-[120px] place-content-center"
						>
							<img
								style={{
									height: height * 0.416,
									width: height * 0.416,
									marginBottom: height * 0.346,
								}}
								src={meterArrow}
								alt=""
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mt-1 text-center text-xs sm:text-sm md:text-xs md2:text-sm">
				<span className="font-bold text-mute">Win Chance:</span>{" "}
				<span className="font-bold text-light">
					{(chance / 100).toFixed(2)}%
				</span>
			</div>
		</>
	);
};

WinChance.defaultProps = {
	height: 200,
};

export default WinChance;
