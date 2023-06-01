import {FunctionComponent} from "react";
import {ContactWrapper, H1, H2, H3} from "./styles";
import Button from "react-bootstrap/Button";

interface HelpCenterProps {
}

const HelpCenter: FunctionComponent<HelpCenterProps> = () => {
  return (
    <ContactWrapper style={{marginRight:'0px', marginLeft:'30px'}}>
      <H2>Questions about Sidecar or your application process?</H2>

      <a
        className={'mt-3 btn btn-primary help-center-link'}
        href={'https://support.hellosidecar.com/'}
        target={'_blank'}
      >
        Visit our Help center
      </a>
    </ContactWrapper>
  );
};

export default HelpCenter;
