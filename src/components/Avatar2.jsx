import React from "react";
import { Link } from "react-router-dom";

import AvatarLevelIcon from "./assets/profile-level.png";
import { AvatarBackShadow, AvatarRightBorder } from "./CustomIcons";

import CropInner from "./assets/crop-inner.svg";
import CropOut from "./assets/crop-out.svg";
import DefaultAvatar from "../pages/profile/assets/defaultAvatar.png";

import "./avatar.scss";
import { useState } from "react";

const Outer = ({ link, to, children, className }) => {
	if (link) {
		return (
			<Link className={className} to={to}>
				{children}
			</Link>
		);
	}

	return <div className={className}>{children}</div>;
};

const Avatar2 = ({
	src,
	level,
	publicKey,
	className,
	width,
	onError,
	link,
}) => {
	if (!src) {
		src = DefaultAvatar;
	}

	return (
		<Outer
			to={`/profile/${publicKey}`}
			className={`${className} ${!link && "pointer-events-none"}`}
		>
			<div
				style={{
					width,
				}}
				className="profile-avatar relative"
			>
				<div className="image-out relative blur-md">
					<img
						style={{
							width,
							height: width * 0.885,
						}}
						onError={onError}
						src={src}
						alt=""
						className="object-cover"
					/>
				</div>
				<img
					style={{
						width: width * 0.885,
						height: width * 0.885 * 0.885,
					}}
					src={src}
					onError={onError}
					className="image-inner absolute left-0 right-0 top-0 bottom-0 m-auto object-cover"
					alt=""
				/>
				{level && (
					<div
						style={{
							width: width * 0.76,
							height: width * 0.76 * 0.85,
							bottom: -width * 0.316,
						}}
						className="absolute left-1/2 -translate-x-1/2"
					>
						<img src={AvatarLevelIcon} alt="" />
						<span
							style={{
								marginTop: -width * 0.02817,
								fontSize: width * 0.1338,
								lineHeight: width * 0.19,
							}}
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white"
						>
							{level}
						</span>
					</div>
				)}
			</div>
		</Outer>
	);
};

export default Avatar2;
