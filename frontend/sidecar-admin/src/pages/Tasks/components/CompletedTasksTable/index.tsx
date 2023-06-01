import React, {FunctionComponent, useEffect, useState} from 'react';
import {EligibilityTable} from "../../../../presentational/EligibilityTable";
import TaskRow from "./TaskRow";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {fetchTaskFilters, fetchTasks, fetchTasksNextPage} from "../../thunks";
import InfiniteScroll from "react-infinite-scroll-component";
import {selectAllTasks, selectTaskFilters} from "../../selectors";



import {ChangeEvent} from 'react';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import {ISelectOptionNumValue} from "../../../../interfaces/form";
import _ from "lodash";
import {ButtonAndSearchContainer, FilterBox, InputBox} from "../../../Funds/styles";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import filter from "lodash/filter";
import {ITask} from "../../../../interfaces/Workflow/task";


const StyledDiv = styled.div`
  button {
    background: inherit;
    border: none;
    font-family: Quicksand Bold;
    font-size: 14px;
    padding-left: 0;

    :hover {
      background: inherit;
      border: none;
    }
  }

  a.dropdown-item {
    font-family: Quicksand;
    font-size: 14px;
  }

  .dropdown-menu {
    max-height: 180px;
    overflow: auto;
  }

  label {
    vertical-align: middle;
    padding: 2px;
  }
  
  div.filter .btn.btn-primary{
    background: inherit;
  }
`


interface TableHeaderFilterProps {
  title: string;
  options: ISelectOptionNumValue[];
  selectedValues: number[];
  setValues: (args0: number[]) => void;
}


const TableHeaderFilter: FunctionComponent<TableHeaderFilterProps> = ({title, options, selectedValues, setValues}) => {
  const [isShown, setIsShown] = useState(false);

  const onToggleHandler = (isOpen: boolean, metadata: any) => {
    if (metadata.source !== 'select') {
      setIsShown(isOpen);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, value: number) => {
    if (e.target.checked) setValues([...selectedValues, value])
    else setValues([...selectedValues.filter(v => v !== value)])
  }
  return <StyledDiv>
    <SplitButton
        show={isShown}
        onToggle={(nextShow, meta) => onToggleHandler(nextShow, meta)}
        as={ButtonGroup}
        key={title}
        id={`dropdown-button-drop-${title}`}
        className="filter"
        size="lg"
        title={title}
    >
      {options.map((option, index) => {
        const isChecked = _.includes(selectedValues, option.value);
        return <Dropdown.Item eventKey={index} key={`${title}-${option.value}`}>
          <Form.Check
              type="checkbox"
              label={option.label}
              key={`${title}-${option.value}-${isChecked}`}
              checked={isChecked}
              onChange={(e) => handleChange(e, option.value)}
          />
        </Dropdown.Item>
      })}
    </SplitButton>
  </StyledDiv>
};

interface TasksTableProps {
  setIsLoading: (args0: boolean) => void
}

const TasksTable: FunctionComponent<TasksTableProps> = ({setIsLoading}) => {

  const [selectedFunds, setSelectedFunds] = useState<number[]>([])
  const [selectedModules, setSelectedModules] = useState<number[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([1])  // pending as default
  const [filterValue, setFilterValue] = useState("")
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([])

  const {tasks, next} = useAppSelector(selectAllTasks);
  const {module_options, fund_options, status_options} = useAppSelector(selectTaskFilters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks(null));
    dispatch(fetchTaskFilters());
  }, [])

  useEffect(() => {
    if (selectedModules.length === 0 && selectedFunds.length === 0 && selectedStatuses.length === 0) {
      dispatch(fetchTasks(null));
    } else {
      const qsArgs = [];
      if (selectedFunds.length > 0) qsArgs.push(`fund_id=${selectedFunds.join(',')}`)
      if (selectedStatuses.length > 0) qsArgs.push(`status=${selectedStatuses.join(',')}`)
      if (selectedModules.length > 0) qsArgs.push(`module=${selectedModules.join(',')}`)
      dispatch(fetchTasks(qsArgs.join('&')));
    }

  }, [selectedFunds, selectedModules, selectedStatuses])

  useEffect(() => {
    if (filterValue != ""){
      setFilteredTasks(filter(tasks, (task) => task.investor_name.toLowerCase().includes(filterValue)));
    }else {
      setFilteredTasks(tasks)
    }
  }, [tasks, filterValue])

  const requestNextPage = () => {
    dispatch(fetchTasksNextPage(next));
  }

  return <div className='task-container'>
    <div className="contained">
      <ButtonAndSearchContainer>
        <FilterBox>
          <InputBox
              type="text"
              placeholder="Search"
              value={filterValue}
              onChange={(e: any) => setFilterValue(e.target.value)}
          />
          <SearchOutlinedIcon />
        </FilterBox>
      </ButtonAndSearchContainer>
    </div>
    <div className='table-container table-striped'>
      <InfiniteScroll
          dataLength={tasks.length}
          next={requestNextPage}
          hasMore={Boolean(next)}
          loader={<div>Loading...</div>}
      >
        <EligibilityTable hover borderless responsive>
          <thead>
          <tr>
            <th>Investor Name</th>
            <th>Description</th>
            <th>
              <TableHeaderFilter
                  title={'Fund'}
                  options={fund_options}
                  selectedValues={selectedFunds}
                  setValues={setSelectedFunds}
              />
            </th>
            <th>
              <TableHeaderFilter
                  title={'Module'}
                  options={module_options}
                  selectedValues={selectedModules}
                  setValues={setSelectedModules}
              />
            </th>
            <th>Type</th>
            <th>
              <TableHeaderFilter
                  title={'Status'}
                  options={status_options}
                  selectedValues={selectedStatuses}
                  setValues={setSelectedStatuses}
              />
            </th>
            <th>Responsible</th>
          </tr>
          </thead>
          <tbody>
          {filteredTasks.map((task) => <TaskRow key={`table-task-${task.id}`} task={task} setIsLoading={setIsLoading}/>)}
          </tbody>
        </EligibilityTable>
      </InfiniteScroll>
    </div>
  </div>
};

export default TasksTable;
