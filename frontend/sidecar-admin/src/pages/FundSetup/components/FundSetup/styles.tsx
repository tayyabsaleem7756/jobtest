import { Button as BootstrapButton } from 'react-bootstrap';
import styled from 'styled-components';

export const ContentInner = styled.div`
 max-width: 984px;
`;

export const Button = styled(BootstrapButton)`
    padding: 10px 30px;
    border: 1px solid #E37628;
    color: #E37628;
    box-sizing: border-box;
    border-radius: 70px;
    font-size: 18px;
    line-height: 22px;
`;

export const PublishButton = styled(BootstrapButton)`
  padding: 10px 30px !important;
  border-radius: 70px !important;
  font-size: 18px !important;
  line-height: 22px !important;
`

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
`;

export const H3 = styled.h3`
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
`;

export const FundFormContainer = styled.div`
    margin-left: -9px;
    button{
        display: block;
    }
    .pb-5{
        padding-bottom: 0 !important;
    }
`;
