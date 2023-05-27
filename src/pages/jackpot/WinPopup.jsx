import React, { useContext, useEffect, useState } from "react";
import Container from "../../components/Container";

import Confetti from "react-confetti";
import { useWindowSize } from "../../util/hooks";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../../api/room";
import { useParams } from "react-router-dom";
import { formatToken, shortenAddress, sleep } from "../../util/util";
import Divider from "../../components/Divider";
import Spinner2 from "../../components/Spinner2";
import Success from "../../components/SuccessIcon";
import { PopupContext } from "../../Context";

import win from "./assets/win.mp3";
import { useConnection } from "@solana/wallet-adapter-react";

const WinPopup = ({ result }) => {
	const { width, height } = useWindowSize();

	const { hidePopup } = useContext(PopupContext);

	const [processing, setProcessing] = useState(true);
	const { roomID } = useParams();
	const roomQuery = useQuery({
		queryKey: ["room", roomID],
		queryFn: () => getRoom(roomID),
	});

	const { connection } = useConnection();

	useEffect(() => {
		if (result.signatures) {
			return;
		}

		const winClone = new Audio(win);
		winClone.volume = 0.4;
		winClone.play();

		const timeout = setTimeout(() => {
			setLoadingText("Sending Transactions...");
		}, 3000);

		return () => {
			clearTimeout(timeout);
		};
	}, [result]);

	useEffect(() => {
		console.log(result);

		if (!Object.keys(result).length) {
			return;
		}
		if (!result.signatures || result.signatures.length == 0) {
			return;
		}
		(async () => {
			try {
				for (let signature of result.signatures) {
					while (true) {
						const status = await connection.getSignatureStatus(
							signature,
							{ searchTransactionHistory: true }
						);
						if (
							status.value &&
							status.value.confirmationStatus == "finalized"
						) {
							break;
						}

						await sleep(500);
					}
				}
			} catch (err) {
				console.log(err);
			} finally {
				setProcessing(false);
			}
		})();
	}, [result]);

	const [loadingText, setLoadingText] = useState("Finalizing Assets...");

	if (!roomQuery.isSuccess) {
		return null;
	}

	return (
		<Container className="max-w-[500px]">
			<Confetti
				tweenDuration={7000}
				recycle={false}
				numberOfPieces={1000}
				width={width}
				height={height}
			/>
			<span className="text-2xl font-bold">
				You won{" "}
				<span className="font-extrabold text-green">
					{formatToken(result.value, roomQuery.data.token)}
				</span>{" "}
				worth of assets!
			</span>
			<Divider className="my-3" />
			<div className="my-3 flex flex-col items-center overflow-hidden text-light">
				<div className="h-[90px] w-[90px]">
					{processing ? <Spinner2 height={90} /> : <Success />}
				</div>
				<span className="z-10 mt-3 flex flex-col text-center font-semibold">
					{result.signatures
						? processing
							? "Confirming Transactions..."
							: "Confirmed Transactions!"
						: loadingText}
					{result.signatures
						? result.signatures.map((signature) => {
								return (
									<a
										href={`https://solscan.io/tx/${signature}`}
										target="_blank"
										className="font-bold text-green"
										key={signature}
									>
										{shortenAddress(signature)}
									</a>
								);
						  })
						: null}
				</span>
				<div className="flex items-center gap-4">
					<button
						disabled={processing}
						delay={500}
						onClick={() => {
							hidePopup();
						}}
						className={
							`mt-3 h-9 w-40 rounded-xl font-semibold ` +
							(() => {
								if (processing) {
									return "cursor-not-allowed bg-mute";
								}
								return "bg-green";
							})()
						}
					>
						Skip
					</button>
					<button
						disabled={processing}
						delay={500}
						onClick={() => {
							window.open(
								"https://twitter.com/intent/tweet?text=" +
									encodeURIComponent(
										`I just won ${formatToken(
											result.value,
											roomQuery.data.token
										)} worth of assets on https://solanashuffle.com @immortalsSOL`
									)
							);
							hidePopup();
						}}
						className={
							`mt-3 h-9 w-40 rounded-xl font-semibold ` +
							(() => {
								if (processing) {
									return "cursor-not-allowed bg-mute";
								}
								return "bg-[#1DA1F2]";
							})()
						}
					>
						Tweet!
					</button>
				</div>
			</div>
		</Container>
	);
};

export default WinPopup;
