import { FunctionComponent } from 'react'
import { Car, LoaderContainer } from './styles'
import CarImage from '../../assets/images/car.svg'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SideCarLoaderProps {}

const SideCarLoader: FunctionComponent<SideCarLoaderProps> = () => (
	<LoaderContainer>
		<Car src={CarImage} />
		<div>Loading...</div>
	</LoaderContainer>
)

export default SideCarLoader
