import { useWallet } from "@solana/wallet-adapter-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { shortenAddress } from "../util/util";
import BadWordsFilter from "bad-words";

import Emoji from "react-emoji-render";

import Union from "./assets/union.svg";
import DefaultAvatar from "./assets/defaultAvatar.png";

const Message = ({ type, value, publicKey, discord, name, image, style }) => {
	const [imgError, setImgError] = useState(false);

	return (
		<div
			style={style}
			className={`flex overflow-hidden rounded-xl py-3 px-4`}
		>
			<div
				style={{
					color: `${base58ToColor(publicKey).hex}`,
				}}
				className="mr-4"
			>
				{image && !imgError ? (
					<Avatar2
						onError={() => {
							setImgError(true);
						}}
						width={40}
						publicKey={publicKey}
						src={image}
					/>
				) : (
					<Avatar2
						width={40}
						publicKey={publicKey}
						src={DefaultAvatar}
					></Avatar2>
				)}
			</div>
			<div className="flex flex-grow flex-col">
				<span className="text-sm font-semibold">
					{name ? name : shortenAddress(publicKey)}
				</span>
				<Emoji className="mt-1 max-w-[184px] break-words text-sm font-medium text-mute">
					{value}
				</Emoji>
			</div>
		</div>
	);
};

import People from "./assets/people.svg";

import "./sidebar.css";
import { base58ToColor } from "../util/color";
import base58 from "bs58";
import { useIsInViewport } from "../util/hooks";
import { UserContext } from "../Context";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Avatar2 from "../components/Avatar2";

const Chat = () => {
	const wallet = useWallet();

	const { user, setUser } = useContext(UserContext);

	// Use filter to remove bad words
	const filter = new BadWordsFilter();

	const [messages, setMessages] = useState([]);
	const [myMessage, setMyMessage] = useState("");
	const bottomRef = useRef(null);
	const scrollRef = useRef(null);

	const messageHandler = async (e) => {
		const msg = e.data;
		if (msg === undefined) {
			return;
		}

		const data = JSON.parse(msg);
		switch (data.type) {
			case "message":
				setMessages((prevData) => {
					let clone = [...prevData];
					if (clone.length > 50) {
						clone.shift();
					}
					// filter can fail with weird characters, so we wrap it in a try catch
					try {
						// Remove links
						const regex = /(https?:\/\/[^\s]+)/g;
						data.value = data.value.replace(regex, "*");
						// Filter bad words
						data.value = filter.clean(data.value);
					} catch (e) {}
					clone.push(data);
					return clone;
				});
				break;
			case "warning":
				setMessages((prevData) => {
					let clone = [...prevData];
					clone.push(data);
					return clone;
				});
				break;
		}
	};

	const ws = useRef(null);

	useEffect(() => {
		const websocket = new WebSocket(`${import.meta.env.VITE_WS}/chat`);
		websocket.onclose = () => console.log("ws closed");
		websocket.onmessage = messageHandler;

		ws.current = websocket;

		const interval = setInterval(() => {
			websocket.send(
				JSON.stringify({
					type: "heartbeat",
					value: "ping",
				})
			);
		}, 5000);

		return () => {
			websocket.close();
			clearInterval(interval);
		};
	}, []);

	const send = async (message) => {
		if (!user.chatSignature) {
			try {
				const data = new TextEncoder().encode(
					`solanashuffle chat ${wallet.publicKey.toBase58()}`
				);
				const signatureBytes = await wallet.signMessage(data);
				const signature = base58.encode(signatureBytes);
				setUser((prevData) => ({
					...prevData,
					chatSignature: signature,
				}));
				ws.current.send(
					JSON.stringify({
						type: "message",
						value: message,
						publicKey: wallet.publicKey.toBase58(),
						signature: signature,
					})
				);
				setMyMessage("");
				return;
			} catch {}
		}
		ws.current.send(
			JSON.stringify({
				type: "message",
				value: message,
				publicKey: wallet.publicKey.toBase58(),
				signature: user.chatSignature,
			})
		);

		setMyMessage("");
	};

	useEffect(() => {
		if (bottomRef && bottomRef.current) {
			scrollRef.current.scrollTop = bottomRef.current.offsetTop;
			//bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div
			ref={scrollRef}
			className="relative flex w-full max-w-[288px] flex-col overflow-y-scroll scroll-smooth 
			rounded-3xl bg-[#25244E] shadow-lg transition scrollbar-hide"
		>
			<div
				style={{
					borderTopLeftRadius: "24px",
					borderTopRightRadius: "24px",
				}}
				className="sticky top-0 left-0 z-10 flex min-h-[96px] w-full flex-col
				justify-center border-b-2 border-[#393869] bg-[#201F48] bg-opacity-70 px-6 backdrop-blur-md"
			>
				<div className="flex items-center">
					<div className="grid h-6 w-6 place-content-center">
						<img
							className="mb-auto h-[21px] w-[21px]"
							src={People}
							alt=""
						/>
					</div>

					<span className="ml-3 mb-auto text-sm font-extrabold">
						Chat Room
					</span>
				</div>
				<div className="flex items-center">
					<div className="grid h-6 w-6 place-content-center">
						<div className="greenGradient h-3 w-3 rounded-full"></div>
					</div>
					<span className="ml-3 text-sm font-semibold">
						{user.onlinePlayers ? user.onlinePlayers : 0} Players
						online
					</span>
				</div>
			</div>
			<div className="mt-auto flex flex-col gap-2 px-2 py-2">
				{messages.map((m, i) => {
					return (
						<Message
							{...m}
							key={i}
							style={(() => {
								if (i % 2 === 0) {
									return {
										background:
											"linear-gradient(0deg, #1D1C3F, #1D1C3F)",
										boxShadow:
											"inset 0px 4.15399px 7.26947px rgba(0, 0, 0, 0.15)",
									};
								}
								return {};
							})()}
						/>
					);
				})}
			</div>
			<div ref={bottomRef}></div>
			<div
				className="sticky bottom-0 left-0 min-h-[60px] border-t-2
				border-[#2F2E5F] bg-[#25244E]"
			>
				<div className="flex h-[58px] w-full items-center bg-[#1D1C3F] bg-opacity-50 px-5">
					<input
						className="ring-none h-full appearance-none border-none
						bg-transparent font-semibold text-light 
						placeholder-light outline-none"
						type="text"
						placeholder="Send a message..."
						value={myMessage}
						onChange={(e) => {
							setMyMessage(e.target.value);
						}}
						onKeyDown={async (event) => {
							if (event.key === "Enter") {
								send(myMessage);
							}
						}}
					/>
					<button
						className="ml-auto"
						onClick={() => {
							send(myMessage);
						}}
					>
						<img className="h-5 w-5" src={Union} alt="" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
