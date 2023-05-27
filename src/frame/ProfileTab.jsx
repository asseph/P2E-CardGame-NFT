import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getUser } from "../api/user";
import { getBalance } from "../api/solana";
import { formatToken, shortenAddress, solToken } from "../util/util";

import Avatar2 from "../components/Avatar2";
import Skeleton from "../components/Skeleton";
import TokenLogo from "../components/TokenLogo";
import { Link } from "react-router-dom";
import { useWindowSize } from "../util/hooks";

const ProfileTab = () => {
	const wallet = useWallet();
	const { connection } = useConnection();
	const size = useWindowSize();
	const [balanceVisible, setBalanceVisible] = useState(size.width <= 768);
	const onHover = () => {
		setBalanceVisible(true);
	};

	const onLeave = () => {
		if (size.width > 768) {
			setBalanceVisible(false);
		}
	};

	useEffect(() => {
		setBalanceVisible(size.width <= 768);
	}, [size.width]);

	const userQuery = useQuery({
		queryKey: ["user", wallet.publicKey],
		queryFn: () => getUser(wallet.publicKey),
	});

	const balanceQuery = useQuery({
		queryKey: ["balance", wallet.publicKey],
		queryFn: () => getBalance(connection, wallet.publicKey),
		refetchInterval: 10_000,
	});

	if (!wallet.connected) {
		return (
			<div className="flex h-16 items-center gap-3">
				<div className="flex">
					<Avatar2 width={70} />
				</div>
				<div className="flex flex-col">
					<span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-semibold">
						Not logged in!
					</span>
					<span className="flex items-center gap-1 text-xs font-semibold">
						<TokenLogo className="w-5" ticker="SOL" />
						{formatToken(0, solToken)}
					</span>
				</div>
			</div>
		);
	}

	if (!userQuery.isSuccess) {
		return <Skeleton className="h-16 w-full rounded-xl" />;
	}

	return (
		<Link
			to={`/profile/${wallet.publicKey.toBase58()}`}
			className="flex h-16 items-center gap-3"
		>
			<div className="flex">
				<Avatar2
					src={userQuery.data.image}
					width={70}
					publicKey={wallet.publicKey.toBase58()}
				/>
			</div>
			<div className="flex flex-col">
				<span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-semibold">
					{userQuery.data.name
						? userQuery.data.name
						: shortenAddress(wallet.publicKey.toBase58())}
				</span>
				<span
					onMouseEnter={onHover}
					onMouseLeave={onLeave}
					className="flex items-center gap-1 text-xs font-semibold"
				>
					<TokenLogo className="w-5" ticker="SOL" />
					{balanceVisible
						? formatToken(balanceQuery.data, solToken)
						: "****"}
				</span>
			</div>
		</Link>
	);
};

export default ProfileTab;
