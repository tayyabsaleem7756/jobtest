import {FunctionComponent, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {useParams} from "react-router-dom";
import { getFundCriteriaDetail } from "../../thunks";
import {useAppDispatch} from "../../../../app/hooks";
import {ModalHeading} from "./styles";
import BlocksList from "./components/Blocks";
import Button from "react-bootstrap/Button";
import {EligibilityModal} from "../../../../presentational/EligibilityModal";
import SmartBlockModal from "./SmartBlockModal";
import CustomSmartBlock from "./components/CriteriaForm/components/CustomSmartBlock/Modal";

interface CreateCriteriaButtonProps {}

const AddBlockButton: FunctionComponent<CreateCriteriaButtonProps> = () => {
  const {criteriaId} = useParams<{ criteriaId: string | undefined }>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [smartBlockId, setSmartBlockModalId] = useState<null | number>(null);
  const [showCreateBlockModal, setCreateBlockModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const callbackSelectModal = (data: any) => {
    setSmartBlockModalId(data.id);
  };

  const handleCreateBlockModal = (show: boolean) => {
    setCreateBlockModal(show);
    if(show) setShowModal(false);
    else {
      if(criteriaId)
        dispatch(getFundCriteriaDetail(parseInt(criteriaId)));
    }
   } 

  return <>
    <Button variant={'outline-primary'} className={'float-end'} onClick={() => setShowModal(true)}>+ Add</Button>
    <EligibilityModal size={'xl'} show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title><ModalHeading>Select block type</ModalHeading></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Eligibility is determined by the jurisdiction of the fund and the location of 
          the investor. Please add the blocks as needed to meet all these criteria.
        </p>
        <div className="text-end mb-2">
          <Button variant="outline-primary" onClick={() => handleCreateBlockModal(true)}>Create Custom Smart Block</Button>
        </div>
        <BlocksList callbackSelectModal={callbackSelectModal}/>

      </Modal.Body>
    </EligibilityModal>
      <SmartBlockModal
        blockId={smartBlockId}
        handleClose={() => setSmartBlockModalId(null)}
        callbackOpenSmartModal={() => setShowModal(false)}
      />
      <CustomSmartBlock 
        showModal={showCreateBlockModal}
        hideModal={() => handleCreateBlockModal(false)} 
      />
  </>;
};

export default AddBlockButton;
