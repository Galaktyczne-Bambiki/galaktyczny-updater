import type { FunctionComponent } from 'react'
import { styled } from 'styled-system/jsx'

type BeerProgressProps = {
	progress: number
}

export const BeerProgress: FunctionComponent<BeerProgressProps> = ({ progress }) => {
	return (
		<Container>
			<Glass>
				<Foam style={{ bottom: ((190 - 10) / 100) * progress }}>
					<FoamBubble style={{ top: '-30px', left: '-10px' }} />
					<FoamBubble style={{ top: '-45px', left: '20px' }} />
					<FoamBubble style={{ top: '-25px', left: '50px' }} />
					<FoamBubble style={{ top: '-35px', left: '80px' }} />
					<FoamBubble style={{ top: '-30px', left: '110px' }} />
					<FoamBubble style={{ top: '-20px', left: '140px' }} />
					<FoamBubble style={{ top: '-30px', left: '160px' }} />
				</Foam>
				<Liquid style={{ height: (180 / 100) * progress }}>
					<Bubble style={{ left: '10px', animationDelay: '1000ms', animationDuration: '1000ms' }} />
					<Bubble style={{ left: '50px', animationDelay: '700ms', animationDuration: '1100ms' }} />
					<Bubble style={{ left: '100px', animationDelay: '1200ms', animationDuration: '1300ms' }} />
					<Bubble style={{ left: '130px', animationDelay: '1100ms', animationDuration: '700ms' }} />
					<Bubble style={{ left: '170px', animationDelay: '1300ms', animationDuration: '800ms' }} />
				</Liquid>
			</Glass>
			<Text>{progress}%</Text>
		</Container>
	)
}

const Container = styled('div', {
	base: {
		height: '200px',
		margin: '0 auto',
		overflow: 'clip',
		position: 'relative',
		width: '248px',
	},
})

const Glass = styled('div', {
	base: {
		position: 'absolute',
		border: '10px solid white',
		borderRadius: '50%',
		height: '200px',
		left: '14px',
		bottom: '0',
		width: '200px',
		overflow: 'clip',
	},
})

const Bubble = styled('div', {
	base: {
		position: 'absolute',
		animation: 'bubble infinite linear',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		bottom: '0',
		borderRadius: '10px',
		height: '20px',
		width: '20px',
	},
})

const Foam = styled('div', {
	base: {
		position: 'absolute',
		bottom: '10px',
	},
})

const FoamBubble = styled('div', {
	base: {
		position: 'absolute',
		float: 'left',
		zIndex: '1',
		width: '50px',
		height: '50px',
		borderRadius: '30px',
		backgroundColor: 'white',
	},
})

const Liquid = styled('div', {
	base: {
		position: 'absolute',
		backgroundColor: '#edaf32',
		border: '10px solid #edaf32',
		bottom: '0',
		height: '0',
		overflow: 'clip',
		width: '180px',
		_after: {
			backgroundColor: 'white/25',
			bottom: '-10px',
			content: '""',
			height: '200px',
			left: '-40px',
			position: 'absolute',
			transform: 'rotate(30deg)',
			width: '110px',
		},
	},
})

const Text = styled('p', {
	base: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		zIndex: '1',
		fontSize: '2xl',
		fontWeight: 'bold',
		textShadow: '3px 3px 0 #000, -1px -1px 0 #000,   1px -1px 0 #000, -1px 1px 0 #000,  1px 1px 0 #000',
	},
})
