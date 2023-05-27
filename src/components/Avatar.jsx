import React from "react";
import { Link } from "react-router-dom";

import AvatarLevelIcon from "./assets/profile-level.png";
import { AvatarBackShadow, AvatarRightBorder } from "./CustomIcons";

import CropInner from "./assets/crop-inner.svg";
import CropOut from "./assets/crop-out.svg";

import "./avatar.scss";

const Avatar = ({ src, level, size, publicKey, className }) => {
	return (
		<Link to={`/profile/${publicKey}`} className={className}>
			{size === "small" ? (
				<div
					className={`profile-avatar group relative h-[46px] w-[58px]`}
				>
					<div
						style={{
							maskBorder: `url(${CropOut})`,
						}}
						className="image-out relative z-10 blur-md"
					>
						<img
							src={src}
							alt=""
							className="h-[52px] w-[57px] object-cover"
						/>
					</div>
					<img
						style={{
							maskBorder: `url(${CropInner})`,
						}}
						src={src}
						className="image-inner absolute left-[3px] top-[3px] z-20 h-[46px] w-[51px] object-cover"
						alt=""
					/>
					{/* 					<div className="absolute -right-0.5 top-[1px] z-30 opacity-0 group-hover:opacity-100">
						<AvatarRightBorder className="bottom-[26.5px] h-[54.4px] w-[36.8px]" />
					</div> 					<div className="bg-shadow absolute -right-[18px] top-0">
						<AvatarBackShadow className="h-[67.6px] w-[57.2px]" />
					</div>*/}
					{level && (
						<div className="absolute left-1/2 -bottom-[45px] z-40 h-[92px] w-[108px] -translate-x-1/2 ">
							<img
								src={AvatarLevelIcon}
								className="absolute bottom-[26.5px] left-1/2 h-[36.8px] w-[43.2px] -translate-x-1/2"
								alt=""
							/>
							<span className="absolute left-1/2 top-1/2 mt-[0.5px] -translate-x-1/2 -translate-y-1/2 text-[7.7px] font-bold leading-[11px] text-white">
								{level}
							</span>
						</div>
					)}
				</div>
			) : (
				<div className={`profile-avatar group relative w-[142px]`}>
					<div
						style={{
							maskBorder: `url(${CropOut})`,
						}}
						className="image-out relative z-10 blur-md"
					>
						<img
							src={src}
							alt=""
							className="h-[128px] w-[142px] object-cover"
						/>
					</div>
					<img
						style={{
							maskBorder: `url(${CropInner})`,
						}}
						src={src}
						className="image-inner absolute left-2 top-[7.5px] z-20 h-[112px] w-[126px] object-cover"
						alt=""
					/>
					{/*					<div className="absolute -right-1.5 top-[1px] z-30 opacity-0 group-hover:opacity-100">
						<AvatarRightBorder />
					</div>					<div className="bg-shadow absolute -right-10 top-0">
						<AvatarBackShadow />
					</div> */}
					{level && (
						<div className="absolute left-1/2 -bottom-[45px] z-40 h-[92px] w-[108px] -translate-x-1/2 ">
							<img src={AvatarLevelIcon} alt="" />
							<span className="absolute left-1/2 top-1/2 -mt-1 -translate-x-1/2 -translate-y-1/2 text-[19px] font-bold leading-[27px] text-white">
								{level}
							</span>
						</div>
					)}
				</div>
			)}
		</Link>
	);
};

export default Avatar;
