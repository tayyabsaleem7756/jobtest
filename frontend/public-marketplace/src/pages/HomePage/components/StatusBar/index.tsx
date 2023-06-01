import { FunctionComponent } from 'react'
import { BarCont, BarBtn, BarCounter } from './styled'

interface StatusBarProps {
	activeApplicationCount: number
	opportunitiesCount: number
	investmentsCount: number
	scrollTo: (ref: string) => void
}

const StatusBar: FunctionComponent<StatusBarProps> = ({
	activeApplicationCount,
	opportunitiesCount,
	investmentsCount,
	scrollTo,
}) => (
	<BarCont>
		<BarBtn
			role='button'
			onClick={() => scrollTo('refApp')}
			sx={{
				borderRight: { md: '1px #C1CEE9 solid' },
			}}
		>
			<BarCounter>{activeApplicationCount}</BarCounter>
			{activeApplicationCount === 1 ? 'Application' : 'Applications'}
		</BarBtn>
		<BarBtn
			role='button'
			onClick={() => scrollTo('refOpp')}
			sx={{
				borderRight: { md: '1px #C1CEE9 solid' },
			}}
		>
			<BarCounter>{opportunitiesCount}</BarCounter>
			{opportunitiesCount === 1 ? 'Opportunity' : 'Opportunities'}
		</BarBtn>
		<BarBtn
			role='button'
			onClick={() => window.open(window.location.origin)}
			sx={{ borderBottom: '0px !important' }}
		>
			<BarCounter>{investmentsCount}</BarCounter>
			{investmentsCount === 1
				? 'Active Investment'
				: 'Active Investments'}
		</BarBtn>
	</BarCont>
)

export default StatusBar
