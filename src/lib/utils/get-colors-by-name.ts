const hashString = (str: string): number => {
	let hash = 2166136261;

	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash +=
			(hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}

	return hash >>> 0;
};

const normalize = (str: string) => str.trim().toLowerCase().normalize('NFKD');

export const getColorsByName = (
	name: string,
): { background: string; text: string } => {
	const normalized = normalize(name);
	const hash = hashString(normalized);

	const hue = hash % 360;
	const saturation = 70;
	const lightness = 55;

	const hslToHex = (h: number, s: number, l: number) => {
		s /= 100;
		l /= 100;

		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) =>
			l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

		const toHex = (x: number) =>
			Math.round(x * 255)
				.toString(16)
				.padStart(2, '0');

		return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
	};

	const background = hslToHex(hue, saturation, lightness);

	const r = parseInt(background.slice(1, 3), 16);
	const g = parseInt(background.slice(3, 5), 16);
	const b = parseInt(background.slice(5, 7), 16);

	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	const text = luminance > 0.6 ? '#0f172a' : '#f8fafc';

	return { background, text };
};
