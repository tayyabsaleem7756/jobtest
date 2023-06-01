import {ISelectOption} from "./form";

export interface ICompany {
  id: number;
  name: string;
}

export interface ICompanyToken {
  id: number;
  company_name: string;
  token: string;
  company_selector: ISelectOption
}