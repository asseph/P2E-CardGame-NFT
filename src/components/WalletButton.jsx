import {
	WalletConnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import "./wallet.css";

const WalletButton = ({ className }) => {
	return (
		<div
			className={`z-40 flex h-12 items-center justify-center rounded-lg text-light shadow-lg ${className}`}
		>
			<WalletMultiButton className="wallet-custom" />
		</div>
	);
};

export default WalletButton;
