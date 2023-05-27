import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { currentFormatTime, formatToken } from "../../util/util";

const Room = (props) => {
	const navigate = useNavigate();

	return (
		<div
			onClick={() => {
				navigate(`/jackpot/${props.id}`);
			}}
			className="relative z-10
            flex h-44 cursor-pointer rounded-[25px] border-2 border-[#464689] bg-[#393869]
			transition before:absolute before:top-1.5 before:left-1.5 before:z-20 before:h-[calc(100%-48px)]
			before:w-[calc(100%-12px)] before:rounded-t-[22px] before:opacity-0
            before:transition-all hover:scale-110 hover:before:opacity-100 lg:h-60 lg:before:h-[calc(100%-56px-6px)]"
		>
			<div className="absolute top-0 left-0 h-full w-full p-[5px]">
				<div
					style={{
						backgroundImage: `url(${props.coverImage})`,
					}}
					className="h-full overflow-hidden rounded-[22px] border-2 border-[#C0C0E71F] bg-cover bg-center bg-no-repeat"
				></div>

				<div
					style={{
						borderBottomLeftRadius: "24px",
						borderBottomRightRadius: "24px",
					}}
					className="absolute bottom-0 left-0 flex h-12 w-full
                flex-col justify-center bg-[#3D3C6D] bg-opacity-90 px-4 lg:h-14"
				>
					<span className="text-[11px] font-bold lg:text-sm">
						{props.name}
					</span>
					<div className="flex items-center text-[11px] lg:text-sm">
						<span className="font-medium text-mute">
							24h Volume:{" "}
							<span className="font-medium text-light">
								{formatToken(
									props.stats.volumes[currentFormatTime()],
									props.token
								)}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Room;
