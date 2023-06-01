import React, {FunctionComponent} from 'react';
import {INotification} from "../../../../interfaces/investorOwnership";
import DocumentsLinks from "./DocumentLinks";
import UnReadTag from "./UnreadTag";
import API from "../../../../api";
import {useAppDispatch} from "../../../../app/hooks";
import {markNotificationAsRead} from "../../investorOwnershipSlice";
import {fetchUnreadNotificationCount} from "../../../User/thunks";
import {standardizeDate} from "../../../../utils/dateFormatting";


interface NotificationRowProps {
  notification: INotification,
}


const NotificationRow: FunctionComponent<NotificationRowProps> = ({notification}) => {
  const dispatch = useAppDispatch();

  const markAsRead = async () => {
    if (notification.is_read) return;
    const payload = {is_read: true}
    await API.updateNotification(notification.id, payload)
    dispatch(fetchUnreadNotificationCount());
    dispatch(markNotificationAsRead(notification.id));
  }

  return <tr key={`${notification.id}-row`}>
    <td>{!notification.is_read && <UnReadTag/>}</td>
    <td>{notification.notification_type}</td>
    <td>{notification.fund_name}</td>
    <td>{standardizeDate(notification.document_date)}</td>
    <td>{standardizeDate(notification.due_date)}</td>
    <td onClick={markAsRead}><DocumentsLinks notification={notification}/></td>
  </tr>

};

export default NotificationRow;
