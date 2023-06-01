import React, {FunctionComponent} from 'react';
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import logo from '../../assets/images/logo.svg';
import UserDropDown from "./UserDropDown";
import {INVESTOR_URL_PREFIX} from "../../constants/routes";
import CompanyUserSelector from "../CompanyUserSelector";
import {OptionTypeBase} from "react-select";
import {useAppSelector} from "../../app/hooks";
import {selectUserInfo} from "../../pages/User/selectors";
import useScreenWidth from "../../hooks/useScreenWidth";
import UnpublishedToggle from "../ViewAsPublishedToggle";
import {CustomLink, CustomNavItem, NavWrapper} from "./styles";
import {useLocation} from "react-router-dom";
import {HOME_PAGE, OWNERSHIP_PATH} from "./constants";


const StyledNavBar = styled(Navbar)`
  padding: ${props => `${props.theme.baseLine * 0.8}px ${props.theme.baseLine * 2}px`};

  .container-fluid {
    padding: 0;

    .navbar-text {
      padding: 0;
    }
  }

  @media screen and (max-width: 1199px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  @media screen and (max-width: 655px) {
    padding: 0 20px;
    min-height: 64px;
    .container-fluid {
      //.navbar-text {
      //  display: none;
      //}
      .navbar-brand {
        img {
          width: 147px;
        }
      }
    }
  }
`

interface NavBarProps {
  onViewAsChange: any;
  viewAs: OptionTypeBase | null | undefined;
  showUnPublished: boolean;
  setShowUnPublished: (args0: boolean) => void
}

const NavBar: FunctionComponent<NavBarProps> = ({viewAs, onViewAsChange, showUnPublished, setShowUnPublished}) => {
  const location = useLocation();
  const path = location.pathname
  const userInfo = useAppSelector(selectUserInfo);
  const {isSmall} = useScreenWidth();

  return <StyledNavBar>
    <Container fluid>
      <Navbar.Brand href={`/${INVESTOR_URL_PREFIX}/start`}>
        <img src={logo} className="App-logo" alt="logo"/>
      </Navbar.Brand>
      <NavWrapper>
        {userInfo && <CustomNavItem className={`center-nav`}>
          <CustomLink isActiveLink={path === HOME_PAGE}  to={HOME_PAGE}>Home</CustomLink>
        </CustomNavItem>}
        {userInfo && <CustomNavItem isActiveLink={path === OWNERSHIP_PATH} className={`center-nav`}>
          <CustomLink isActiveLink={path === OWNERSHIP_PATH}  to={OWNERSHIP_PATH}>My Portfolio</CustomLink>
        </CustomNavItem>}
        {userInfo && userInfo.is_sidecar_admin && !isSmall && <Navbar.Text>
          <CompanyUserSelector
            onChange={onViewAsChange}
            value={viewAs}
          />
        </Navbar.Text>}
      </NavWrapper>

      {userInfo && userInfo.is_sidecar_admin && !isSmall && viewAs && <Navbar.Text>
        <UnpublishedToggle showUnpublished={showUnPublished} onChange={setShowUnPublished}/>
      </Navbar.Text>}
      {userInfo && <UserDropDown/>}
    </Container>
  </StyledNavBar>
};

export default NavBar;
