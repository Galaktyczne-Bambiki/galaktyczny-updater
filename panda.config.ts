import { defineConfig, defineGlobalStyles } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import purple from '@park-ui/panda-preset/colors/purple'
import mauve from '@park-ui/panda-preset/colors/mauve'
import grass from '@park-ui/panda-preset/colors/grass'
import amber from '@park-ui/panda-preset/colors/amber'

const createColorPreset = (colorPalette: typeof grass) => ({
	name: colorPalette.name,
	theme: {
		extend: {
			tokens: {
				colors: {
					[colorPalette.name]: colorPalette.tokens,
				},
			},
			semanticTokens: {
				colors: {
					[colorPalette.name]: colorPalette.semanticTokens,
				},
			},
		},
	},
})

export default defineConfig({
	preflight: true,
	presets: [
		createPreset({
			accentColor: purple,
			grayColor: mauve,
			radius: 'sm',
		}),
		createColorPreset(grass),
		createColorPreset(amber),
	],
	include: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
	jsxFramework: 'react', // or 'solid' or 'vue'
	// jsxStyleProps: 'minimal',
	outdir: 'styled-system',
	conditions: {
		extend: {
			dark: '.dark &, [data-theme="dark"] &',
			light: '.light &, [data-theme="light"] &',
		},
	},
	globalCss: defineGlobalStyles({
		'html, body': {
			'--global-font-body': 'Plus Jakarta Sans Variable, sans-serif',
		},
	}),
	theme: {
		extend: {
			keyframes: {
				bubble: {
					'0%': {
						bottom: '0px',
					},
					'50%': {
						backgroundColor: 'rgba(255, 255, 255, 0.2)',
						bottom: '80px',
					},
					'100%': {
						backgroundColor: 'rgba(255, 255, 255, 0)',
						bottom: '160px',
					},
				},
			},
		},
	},
})
