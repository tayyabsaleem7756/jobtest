import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import Select, {OptionTypeBase} from "react-select";
import {useAppSelector} from "../../app/hooks";
import {selectCompanyUsers} from "../../pages/User/selectors";

interface CompanyUserSelectorProps {
  onChange: any;
  value: OptionTypeBase | null | undefined;
}

const StyledSelect = styled(Select)`
  .select__control {
    min-width: 250px;
  }
`


const CompanyUserSelector: FunctionComponent<CompanyUserSelectorProps> = ({onChange, value}) => {
  const companyUsers = useAppSelector(selectCompanyUsers)
  if (!companyUsers || !companyUsers.length) return <></>


  const options = companyUsers.map(companyUser => ({label: companyUser.display_name, value: companyUser.user_id}))
  return <StyledSelect
    placeholder={'View As'}
    onChange={onChange}
    className="basic-single"
    classNamePrefix="select"
    isSearchable={true}
    value={value}
    options={options}
  />
};

export default CompanyUserSelector;
