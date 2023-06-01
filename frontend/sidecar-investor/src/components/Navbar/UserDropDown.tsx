import React, {FunctionComponent, useEffect} from "react";
import bellIcon from "../../assets/images/bell-icon.svg";
import userIcon from "../../assets/images/user-icon.svg";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import {useAuth0} from "@auth0/auth0-react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectUnreadNotificationCount, selectUserInfo} from "../../pages/User/selectors";
import DropDownWelcomeModal from "../WelcomeCarousel/DropDownModal";
import {fetchInvestorCompanyUsers, fetchUnreadNotificationCount} from "../../pages/User/thunks";

const UserDropDownToggle = styled(Dropdown.Toggle)`
  text-decoration: none;
  padding-left: 0;
  padding-right: 0;

  .username {
    color: #2E2E3A;
    font-family: 'Inter';
    font-weight: 500;
    vertical-align: middle;
  }

  .notification-icon {
    background: #C4C4C4;
    border-radius: 50%;
    padding: 2px 5px 5px;
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-right: ${props => `${props.theme.baseLine}px`};
    text-align: center;
    vertical-align: middle;
    position: relative;

    .notification-count {
      background: #FF5722;
      border-radius: 50%;
      padding: 3px;
      font-size: 9px;
      text-align: center;
      position: absolute;
      left: -4px;
      top: -4px;
      width: 16px;
      height: 16px;
      line-height: 9px;
      color: white;
      font-weight: 500;
    }
  }

  .user-icon {
    display: none;
  }
  &:after {
    margin-left: 6px;
    margin-top: 2px;
    vertical-align: middle;
    border-top: 5px solid;
    border-right: 5px solid transparent;
    border-bottom: 0;
    border-left: 5px solid transparent;
  }
  @media screen and (max-width: 655px) {
    font-size: 0;
    &:focus {
      box-shadow: none;
    }
    .user-icon {
      display: inline-block;
    }
  }
`

const UserDropDownMenu = styled(Dropdown.Menu)`
  left: auto !important;
  right: 0;
  min-width: 290px;
  padding: 0;
  box-shadow: 0 0 9px 10px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  overflow: hidden;
  border: 0;

  .dropdown-item {
    border-bottom: 1px solid #EBf0FF;
    padding: ${props => `${props.theme.baseLine * 0.8}px ${props.theme.baseLine * 1.25}px`};
    text-align: right;
    font-size: 14px;
    text-decoration: underline;
    font-family: 'Quicksand Medium';

    &.user {
      text-decoration: none;

      .name,
      .email {
        display: block;
      }

      .name {
        font-weight: 700;
        font-size: 20px;
      }
    }

    &:last-child {
      border: 0;
    }

    &:hover {
      background: #E2E1EC;
    }
  }

`

const UserDropDown: FunctionComponent = () => {
  const {logout} = useAuth0();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const notificationsCount = useAppSelector(selectUnreadNotificationCount);

  useEffect(() => {
    dispatch(fetchUnreadNotificationCount())
  }, [])

  useEffect(() => {
    if (userInfo && userInfo.is_sidecar_admin) {
      dispatch(fetchInvestorCompanyUsers())
    }
  }, [userInfo])

  const handleClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const titleElement = document.getElementById('notificationsTable')
    titleElement?.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <Dropdown>
      <UserDropDownToggle variant="clear">
        <span className="notification-icon" onClick={handleClick}>
          <span className="notification-count">{notificationsCount}</span>
          <img src={bellIcon} className="bell-icon" alt="notification icon"/>
        </span>
        <span className="username">
          {userInfo && userInfo.display_name}
          <img src={userIcon} className="user-icon" alt="user icon"/>
        </span>
      </UserDropDownToggle>
      <UserDropDownMenu>
        <Dropdown.Item className="user">
          <span className="name">{userInfo && userInfo.display_name}</span>
          <span className="email">{userInfo && userInfo.email}</span>
        </Dropdown.Item>
        <DropDownWelcomeModal/>
        <Dropdown.Item href='https://support.hellosidecar.com' target='_blank'>Help Center</Dropdown.Item>
        <Dropdown.Item onClick={() =>
          logout({
            returnTo: window.location.origin,
          })
        }>Sign Out</Dropdown.Item>
      </UserDropDownMenu>
    </Dropdown>
  )
}

export default UserDropDown;