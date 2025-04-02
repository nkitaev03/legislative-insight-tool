
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// ComplianceAI custom colors
				compGreen: {
					50: '#e6f8f0',
					100: '#ccf2e0',
					200: '#99e6c2',
					300: '#66d9a3',
					400: '#33cc85',
					500: '#25b873',
					600: '#00a366',
					700: '#007a4d',
					800: '#005233',
					900: '#00291a',
				},
				compOrange: {
					50: '#fff8ed',
					100: '#ffefd4',
					200: '#ffdca8',
					300: '#ffc170',
					400: '#ff9a38',
					500: '#ff7a0f',
					600: '#ed5f04',
					700: '#c44a06',
					800: '#9c3c0c',
					900: '#7e340f',
				},
				compBlue: {
					50: '#e6f0ff',
					100: '#cce0ff',
					200: '#99c2ff',
					300: '#66a3ff',
					400: '#3385ff',
					500: '#0066ff',
					600: '#0052cc',
					700: '#003d99',
					800: '#002966',
					900: '#001433',
				},
				compPurple: {
					50: '#f3e6ff',
					100: '#e6ccff',
					200: '#cc99ff',
					300: '#b366ff',
					400: '#9933ff',
					500: '#8000ff',
					600: '#6600cc',
					700: '#4d0099',
					800: '#330066',
					900: '#1a0033',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			boxShadow: {
				'card-hover': '0 4px 12px 0 rgba(0,0,0,0.05)',
				'card-active': '0 1px 3px 0 rgba(0,0,0,0.1)',
			},
			backgroundImage: {
				'gradient-soft': 'linear-gradient(135deg, var(--tw-gradient-stops))',
				'card-gradient': 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
