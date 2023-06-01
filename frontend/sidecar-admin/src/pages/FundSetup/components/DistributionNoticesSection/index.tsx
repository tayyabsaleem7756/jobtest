import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import API from "../../../../api/backendApi";
import DistributionNoticesList from "./components/DistributionNoticesList";
import DistributionNoticesDetail from "./components/DistributionNoticesDetail";
import SideCarLoader from "../../../../components/SideCarLoader";
import {useAppDispatch} from "../../../../app/hooks";
import {fetchFundDetail} from "../../../FundDetail/thunks";

const DistributionNoticesSection = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const dispatch = useAppDispatch()
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const paramDistributionNoticeId = searchParams.get("distributionNoticeId");

  const {
    getFundDistributionNotices,
    getFundDistributionNoticeDetail,
    createFundDistributionNotice,
    getUserInfo,
  } = API;
  const [selected, setSelected] = useState<any>(null);
  const [distributionList, setDistributionList] = useState<any>([]);
  const [investors, setInvestors] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleSelectRow = async (val: any) => {
    if (val?.id) {
      const res = await getFundDistributionNoticeDetail(externalId, val.id);
      setInvestors(res);
      setSelected(val);
    } else {
      setSelected(val);
      setInvestors([]);
      searchParams.delete("distributionNoticeId");
      history.replace({
        search: searchParams.toString(),
      });
    }
  };

  const fetchDistributionNoticesList = async () => {
    if (externalId) {
      const res = await getFundDistributionNotices(externalId);
      setDistributionList(res || []);
    }
  };

  const handleFetchUserInfo = async () => {
    const res = await getUserInfo();
    setIsAdmin(res.is_sidecar_admin);
  };

  const createDistributionNotice = async (payload: any) => {
    const res = await createFundDistributionNotice(externalId, payload);
    await fetchDistributionNoticesList();
    return res;
  };

  useEffect(() => {
    dispatch(fetchFundDetail(externalId))
    fetchDistributionNoticesList();
    handleFetchUserInfo();
  }, [externalId]);

  const getRowFromId = (id: any) => {
    return distributionList.find((dat: any) => dat.id.toString() === id);
  };

  useEffect(() => {
    if (paramDistributionNoticeId && distributionList.length > 0) {
      handleSelectRow(getRowFromId(paramDistributionNoticeId));
    }
  }, [distributionList]);

  return (
    <div>
      {selected && investors.length > 0 ? (
        <DistributionNoticesDetail
          goBack={() => handleSelectRow(null)}
          data={investors}
          selectedRow={selected}
        />
      ) : paramDistributionNoticeId ? (
        <SideCarLoader />
      ) : (
        <DistributionNoticesList
          data={distributionList}
          isAdmin={isAdmin}
          handleSelectRow={(row: any) => handleSelectRow(row)}
          createDistributionNotice={createDistributionNotice}
        />
      )}
    </div>
  );
};

export default DistributionNoticesSection;
