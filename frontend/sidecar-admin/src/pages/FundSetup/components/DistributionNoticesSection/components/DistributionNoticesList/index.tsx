import RsuiteTable from "../../../../../../components/Table/RSuite";
import { getColumns } from "./constants";
import { TopRow, Title } from "./styles";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import CreateModal from "./components/CreateModal";

const CapitalCallsList = ({
  handleSelectRow,
  data,
  createDistributionNotice,
  isAdmin,
}: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleHide = () => {
    setShowModal(false);
  };

  const handleConfirm = async (selectedFile: File, selectedDate: string) => {
    const formData = new FormData();
    formData.append("distribution_date", selectedDate);
    formData.append("document_file", selectedFile as File);
    const res = await createDistributionNotice(formData);
    return res;
  };

  return (
    <div>
      <TopRow>
        <Title>Distribution Notices</Title>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Create
          </Button>
        )}
      </TopRow>
      <CreateModal
        showModal={showModal}
        handleHide={handleHide}
        handleConfirm={handleConfirm}
      />
      <RsuiteTable
        isLoading={false}
        columns={getColumns(handleSelectRow)}
        data={data}
        rowSelection={false}
      />
    </div>
  );
};

export default CapitalCallsList;
