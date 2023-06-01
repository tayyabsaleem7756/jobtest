import { FunctionComponent } from "react";
import { Car, LoaderContainer } from './styles';
import CarImage from "../../assets/images/car.svg";

interface SideCarLoaderProps {}

const SideCarLoader: FunctionComponent<SideCarLoaderProps> = () => {
  return (
    <LoaderContainer>
      <Car src={CarImage} />
      <div>Loading...</div>
    </LoaderContainer>
  );
}

export default SideCarLoader;