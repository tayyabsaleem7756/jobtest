import styled, { keyframes } from 'styled-components'

const moveCar = keyframes`
    0% { transform: rotate3d(0, 0, 1, 0deg); }
    30% { transform-origin: center; transform: rotate3d(0, 0, 1, -10deg); }
`

export const Car = styled.img`
	animation-name: ${moveCar};
	animation-duration: 1s;
	animation-iteration-count: infinite;
	width: 100px;
`

export const LoaderContainer = styled.div`
	text-align: center;
`
