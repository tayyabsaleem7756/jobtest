import { ReactNode } from 'react'
import { Cont, Title, Wrapper } from './styled'

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
	<Wrapper>
		<Title>{title}</Title>
		<Cont>{children}</Cont>
	</Wrapper>
)

export default Card
