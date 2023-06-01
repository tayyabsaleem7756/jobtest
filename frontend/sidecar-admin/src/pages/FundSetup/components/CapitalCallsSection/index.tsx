import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import API from "../../../../api/backendApi";
import CapitalCallsList from "./components/CapitalCallsList";
import CapitalCallsDetail from "./components/CapitalCallsDetail";
import SideCarLoader from "../../../../components/SideCarLoader";
import {useAppDispatch} from "../../../../app/hooks";
import {fetchFundDetail} from "../../../FundDetail/thunks";


const CapitalCallsSection = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const dispatch = useAppDispatch()
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const paramCapitalCallId = searchParams.get("capitalCallId");

  const {
    getFundCapitalCalls,
    getFundCapitalCallDetail,
    createFundCapitalCall,
    getUserInfo,
  } = API;
  const [selected, setSelected] = useState<any>(null);
  const [callList, setCallList] = useState<any>([]);
  const [investors, setInvestors] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleSelectRow = async (val: any) => {
    if (val?.id) {
      const res = await getFundCapitalCallDetail(externalId, val.id);
      setInvestors(res);
      setSelected(val);
    } else {
      setSelected(val);
      setInvestors([]);
      searchParams.delete("capitalCallId");
      history.replace({
        search: searchParams.toString(),
      });
    }
  };

  const fetchCapitalCallsList = async () => {
    if (externalId) {
      const res = await getFundCapitalCalls(externalId);
      setCallList(res || []);
    }
  };

  const handleFetchUserInfo = async () => {
    const res = await getUserInfo();
    setIsAdmin(res.is_sidecar_admin);
  };

  const createCapitalCall = async (payload: any) => {
    const res = await createFundCapitalCall(externalId, payload);
    await fetchCapitalCallsList();
    return res;
  };

  useEffect(() => {
    dispatch(fetchFundDetail(externalId))
    fetchCapitalCallsList();
    handleFetchUserInfo();
  }, [externalId]);

  const getRowFromId = (id: any) => {
    return callList.find((dat: any) => dat.id.toString() === id);
  };

  useEffect(() => {
    if (paramCapitalCallId && callList.length > 0) {
      handleSelectRow(getRowFromId(paramCapitalCallId));
      // searchParams.delete("capitalCallId");
      // history.replace({
      //   search: searchParams.toString(),
      // });
    }
  }, [callList]);

  return (
    <div>
      {selected && investors.length > 0 ? (
        <CapitalCallsDetail
          goBack={() => handleSelectRow(null)}
          data={investors}
          capitalCall={selected}
        />
      ) : paramCapitalCallId ? (
        <SideCarLoader />
      ) : (
        <CapitalCallsList
          data={callList}
          isAdmin={isAdmin}
          handleSelectRow={(row: any) => handleSelectRow(row)}
          createCapitalCall={createCapitalCall}
        />
      )}
    </div>
  );
};

export default CapitalCallsSection;
