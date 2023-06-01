import React, {FunctionComponent} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import AuthenticationButton from "../auth/AuthenticationButton";
import {CustomLink, CustomNavItem, NavContainer, NavWrapper} from "./styles";
import {useLocation} from 'react-router-dom'
import {FUNDS_PATH, COMPANY_PATH, USERS_PATH} from "./constants";
import NotificationBell from "./NotificationBell";
import MyTasksCount from "./MyTasks";


const NavBar: FunctionComponent = () => {
  const location = useLocation();
  const path = location.pathname
  
  return <Navbar bg="light" expand="lg" fixed="top">
    <NavContainer fluid>
      <Navbar.Brand><img src="/assets/images/logo.svg" alt=""/></Navbar.Brand>
      <NavWrapper>
        <CustomNavItem isActiveLink={path === COMPANY_PATH} className={`center-nav`}>
          <CustomLink to={COMPANY_PATH}>Company</CustomLink>
        </CustomNavItem>
        <CustomNavItem isActiveLink={path === FUNDS_PATH} className={`center-nav`}>
          <CustomLink to={FUNDS_PATH}>Funds</CustomLink>
        </CustomNavItem>
      </NavWrapper>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <MyTasksCount/>
        </Nav>
        <Nav>
          <Nav.Item><NotificationBell/></Nav.Item>
        </Nav>
        <Nav>
          <Nav.Item><AuthenticationButton/></Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </NavContainer>
  </Navbar>
};

export default NavBar;
