import React, { useEffect, useMemo, useState } from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	BackpackWalletAdapter,
	BraveWalletAdapter,
	CoinbaseWalletAdapter,
	ExodusWalletAdapter,
	GlowWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	SolletWalletAdapter,
	TorusWalletAdapter,
	TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Frame from "./frame/Frame";
import Jackpot from "./pages/jackpot/Jackpot";
import Home from "./pages/home/Home";
import Leaderboards from "./pages/leaderboards/Leaderboards";
import Profile from "./pages/profile/Profile";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./popup.css";
import "./swal.css";
import { AssetsContext, PopupContext, UserContext } from "./Context";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Frame />,
		children: [
			{
				path: "jackpot/:roomID",
				element: <Jackpot />,
			},
			{
				path: "leaderboards",
				element: <Leaderboards />,
			},
			{
				path: "profile/:publicKey",
				element: <Profile />,
			},
			{
				path: "/",
				element: <Home />,
			},
		],
		errorElement: (
			<Frame>
				<div className="flex h-full w-full flex-col items-center justify-center text-center">
					<span className="text-6xl font-bold">
						An error occured!
					</span>
					<Link
						to="/"
						className="text-lg font-semibold text-mute underline"
					>
						Return to the homepage
					</Link>
				</div>
			</Frame>
		),
	},
]);

function App() {
	const [popup, setPopup] = useState({
		show: false,
	});

	const popupValue = {
		popup,
		setPopup,
		hidePopup: () => {
			let popup = document.getElementById("popup");
			let popupContent = document.getElementById("popup-content");
			let popupExit = document.getElementById("popup-exit");

			popup.classList.add("popup-hide");
			popupContent.classList.add("popup-hide-scale");
			if (popupExit) {
				popupExit.classList.add("popup-hide-scale");
			}
			setTimeout(() => {
				setPopup({
					show: false,
				});
			}, 100);
		},
	};

	const [assets, setAssets] = useState([]);
	const assetsValue = { assets, setAssets };

	const [user, setUser] = useState({});
	const userValue = { user, setUser };

	const network = WalletAdapterNetwork.Mainnet;
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new TrustWalletAdapter(),
			new TorusWalletAdapter(),
			new SolletWalletAdapter(),
			new SlopeWalletAdapter(),
			new GlowWalletAdapter(),
			new ExodusWalletAdapter(),
			new CoinbaseWalletAdapter(),
			new BraveWalletAdapter(),
			new BackpackWalletAdapter(),
			new SolflareWalletAdapter(),
		],
		[network]
	);
	return (
		<ConnectionProvider endpoint={import.meta.env.VITE_RPC_HOST}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<QueryClientProvider client={queryClient}>
						<AssetsContext.Provider value={assetsValue}>
							<UserContext.Provider value={userValue}>
								<PopupContext.Provider value={popupValue}>
									<RouterProvider router={router} />
								</PopupContext.Provider>
							</UserContext.Provider>
						</AssetsContext.Provider>
					</QueryClientProvider>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export default App;
