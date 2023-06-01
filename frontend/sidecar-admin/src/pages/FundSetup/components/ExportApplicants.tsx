import {FunctionComponent, useState} from "react";
import {IFundBaseInfo} from "../../../interfaces/fundDetails";
import applicationsAPI from "../../../api/applicationsAPI";
// @ts-ignore
import {useJsonToCsv} from 'react-json-csv';
import Button from "react-bootstrap/Button";
import {formatDownloadableData, headers} from "./ApplicantsList/formatDownloadableData";
import {useAppSelector} from "../../../app/hooks";
import {selectStatuses} from "../selectors";
import AmlKYCReport from "./AmlKycExport/export";
import { selectCountrySelector } from "../../EligibilityCriteria/selectors";
import { Dropdown } from "react-bootstrap";


interface ExportApplicantsProps {
  fund: IFundBaseInfo;
}

const ExportApplicants: FunctionComponent<ExportApplicantsProps> = ({fund}) => {
  const [fetchingData, setFetchingData] = useState<boolean>(false)
  const [exportData, setExportData] = useState<object[]>([])
  const [amlKycData, setAmlKycData] = useState<object[]>([])
  const applicantStatuses = useAppSelector(selectStatuses);
  const countries = useAppSelector(selectCountrySelector);
  const {saveAsCsv} = useJsonToCsv();

  const csvFields = {} as any;
  headers(fund).forEach((header) => csvFields[header] = header)
  const filename = `applicants-${fund.slug}`
  const onDownloadApplicants = () => {
    const handleClick = async () => {
      setFetchingData(true)
      if (!exportData?.length) {
        const response = await applicationsAPI.getApplicationsExportList(fund.external_id)
        const data = formatDownloadableData(response, applicantStatuses, fund)
        setExportData(data)
        saveAsCsv({data, fields: csvFields, filename})
      } else {
        saveAsCsv({data: exportData, fields: csvFields, filename})
      }
      setFetchingData(false)
    }
    handleClick()
  }

  const onDownloadAmlKyc = () => {
    const handleDownload = async () => {
      const filename = `aml_kyc-${fund.slug}`;
      if(!amlKycData.length){
        const data = await applicationsAPI.getApplicationAmlKycData(fund.external_id)
        const report = new AmlKYCReport(data, countries, filename);
        report.downloadAmlKycReport();
        setAmlKycData(data)
      }
      else {
        const report = new AmlKYCReport(amlKycData, countries, filename);
        report.downloadAmlKycReport();
      }
    }
    handleDownload();
  }

  return (
    <Dropdown>
       <Dropdown.Toggle
            variant="outline-primary"
            disabled={fetchingData}
          >
            Export
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={onDownloadApplicants}
            >
              Export Applicants
            </Dropdown.Item>
            <Dropdown.Item
              onClick={onDownloadAmlKyc}
            >
              Export AML/KYC report
            </Dropdown.Item>
          </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportApplicants;
