export const solToken = {
	ticker: "SOL",
	publicKey: "So11111111111111111111111111111111111111112",
	decimals: 9,
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const shortenAddress = (address, chars = 4) => {
	return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const countDecimals = (amount) => {
	if (Math.floor(amount.valueOf()) === amount.valueOf()) return 0;
	return amount.toString().split(".")[1].length || 0;
};

export const formatToken = (amount, token) => {
	if (token === undefined) {
		return "...";
	}

	if (isNaN(amount) || amount == undefined || amount == null) {
		amount = 0;
	}

	return `${readableToken(amount, token)} ${token.ticker}`;
};

export const readableToken = (fractions, token) => {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 3,
	}).format(
		Math.round(
			(fractions / Math.pow(10, token.decimals) + Number.EPSILON) * 1000
		) / 1000
	);
};

export const currentFormatTime = () => {
	return formatTime(new Date());
};

export const formatTime = (date) => date.toISOString().split("T")[0];

const SET_TIMEOUT_MAX_SAFE_INTERVAL = 2147483647;
export function getSafeTimeoutInterval(interval) {
	return Math.min(interval, SET_TIMEOUT_MAX_SAFE_INTERVAL);
}
