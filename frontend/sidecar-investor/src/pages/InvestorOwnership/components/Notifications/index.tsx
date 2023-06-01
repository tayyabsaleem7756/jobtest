import React, {FunctionComponent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {selectNotificationFilters, selectNotifications} from "../../selectors";
import {fetchNotificationFilters, fetchNotifications, fetchNotificationsNextPage} from "../../thunks";

import NotificationRow from "./NotificationRow";
import {NotificationsTable} from "../../../../presentational/StyledTableContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import TableHeaderFilter from "./TableHeaderFilter";
import SideCarDateRangePicker from "../../../../components/DateRangePicker";
import {Range} from "react-date-range";
import Table from "react-bootstrap/Table";
import {resetNotifications} from "../../investorOwnershipSlice";


interface NotificationsListProps {
  viewFundId?: number;
  viewInvestorId?: number;
}


const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}


const NotificationsList: FunctionComponent<NotificationsListProps> = ({viewFundId, viewInvestorId}) => {
  const [selectedFunds, setSelectedFunds] = useState<number[]>([])
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([])
  const [documentDateRange, setDocumentDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: new Date(""),
      key: 'selection'
    }
  ]);
  const [dueDateRange, setDueDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: new Date(""),
      key: 'selection'
    }
  ]);
  const {notifications, next} = useAppSelector(selectNotifications);
  const {type_options, fund_options, investor_options} = useAppSelector(selectNotificationFilters);
  const dispatch = useAppDispatch();

  const filterQueryString = () => {
    const qsArgs = [];
    if (viewFundId) qsArgs.push(`fund_id=${viewFundId}`)
    if (viewInvestorId) qsArgs.push(`investor_id=${viewInvestorId}`)
    if (qsArgs.length > 0) return qsArgs.join('&')
    return null
  }

  useEffect(() => {
    if (!viewFundId) {
      dispatch(fetchNotifications(null));
    }
    const filtersQs = filterQueryString()
    dispatch(fetchNotificationFilters(filtersQs));

    return () => {
      dispatch(resetNotifications({}))
    }
  }, [])

  useEffect(() => {
    const dueDate = dueDateRange[0];
    const documentDate = documentDateRange[0]
    const hasDueDate = dueDate.startDate && dueDate.endDate;
    const hasDocumentDate = documentDate.startDate && documentDate.endDate;
    if (!hasDocumentDate && !hasDueDate && selectedTypes.length === 0 && selectedFunds.length === 0 && selectedInvestors.length === 0 && !viewFundId) {
      dispatch(fetchNotifications(null));
    } else {
      const qsArgs = [];
      if (selectedFunds.length > 0 || viewFundId) {
        if (viewFundId) qsArgs.push(`fund_id=${viewFundId}`)
        else qsArgs.push(`fund_id=${selectedFunds.join(',')}`)
      }
      if (selectedTypes.length > 0) qsArgs.push(`type=${selectedTypes.join(',')}`)
      if (selectedInvestors.length > 0 || viewInvestorId) {
        if (viewInvestorId) qsArgs.push(`investor_id=${viewInvestorId}`)
        else qsArgs.push(`investor_id=${selectedInvestors.join(',')}`)
      }
      if (hasDocumentDate) {
        qsArgs.push(`document_date__gte=${formatDate(documentDate.startDate)}`)
        qsArgs.push(`document_date__lte=${formatDate(documentDate.endDate)}`)
      }
      if (hasDueDate) {
        qsArgs.push(`due_date__gte=${formatDate(dueDate.startDate)}`)
        qsArgs.push(`due_date__lte=${formatDate(dueDate.endDate)}`)
      }
      dispatch(fetchNotifications(qsArgs.join('&')));
    }
  }, [selectedFunds, selectedTypes, selectedInvestors, dueDateRange, documentDateRange, viewInvestorId, viewFundId])

  const requestNextPage = () => {
    dispatch(fetchNotificationsNextPage(next));
  }

  return <NotificationsTable className="notifications-table">
    <InfiniteScroll
      dataLength={notifications.length}
      next={requestNextPage}
      hasMore={Boolean(next)}
      loader={<div>Loading...</div>}
      height={'495px'}
    >
      <Table responsive id={'notificationsTable'}>
        <thead>
        <tr>
          <th></th>
          <th>
            <TableHeaderFilter
              title={'Type'}
              options={type_options}
              selectedValues={selectedTypes}
              setValues={setSelectedTypes}
            />
          </th>
          <th>
            <TableHeaderFilter
              title={'Investment'}
              options={fund_options}
              selectedValues={selectedFunds}
              setValues={setSelectedFunds}
            />
          </th>
          <th>
            <SideCarDateRangePicker
              heading={'Document Date'}
              value={documentDateRange}
              setValue={setDocumentDateRange}
            />
          </th>
          <th>
            <SideCarDateRangePicker
              heading={'Due Date'}
              value={dueDateRange}
              setValue={setDueDateRange}
            />
          </th>
          <th>Details</th>
        </tr>
        </thead>
        <tbody>
        {notifications.map((notification) => (
          <NotificationRow key={notification.id} notification={notification}/>
        ))}
        </tbody>
      </Table>
    </InfiniteScroll>
  </NotificationsTable>

};

export default NotificationsList;
