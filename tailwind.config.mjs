import { createFluidValue } from './src/styles/createFluidValue';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
				sm: '767px',
				md: '1080px',
				lg: '1260px',
				xl: '1620px',
			},
			colors: {
				orange: '#ff683f',
				gray: '#b9b9b9',
			},
			spacing: {
				0: '0',
				1: createFluidValue(8, 10),
				2: createFluidValue(16, 20),
				3: createFluidValue(24, 30),
				4: createFluidValue(32, 40),
				5: createFluidValue(40, 50),
				7: createFluidValue(56, 75),
				8: createFluidValue(50, 100),
				9: createFluidValue(75, 150),
				10: createFluidValue(125, 175),
				11: createFluidValue(125, 200),
			},
		},
	},
	plugins: [],
}
