import React, {FunctionComponent, useEffect, useState} from 'react';
import API from '../../../../api'
import {useHistory} from "react-router-dom";
import {BUSINESS_LINE_OPTIONS, FUND_TYPE_OPTIONS, INVITE_TYPE_OPTIONS, LEVERAGE_TYPE_OPTIONS} from '../../../Funds/components/CreateFund/constants';
import {ADMIN_URL_PREFIX} from "../../../../constants/routes";
import { IFundDetailExtended } from '../../interfaces';
import { IFundBaseInfo } from '../../../../interfaces/fundDetails';
import {ICurrency} from "../../../../interfaces/currency";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {deleteFund} from "../../../Funds/fundsSlice";
import Header from '../../../../components/Header'
import CreateFundForm from '../../../Funds/components/CreateFund/CreateFundForm';
import {Button, ContentInner, FundFormContainer, H3} from './styles';
import {ContentContainer} from '../../styles'
import {selectFundDetail} from "../../../FundDetail/selectors";

interface FundSetupProps {
    fund: IFundBaseInfo
}

const FundSetup: FunctionComponent<FundSetupProps> = ({fund}) => {
    const [fundWithFields, setFundWithFields] = useState<IFundDetailExtended | undefined>();
    const fundDetails = useAppSelector(selectFundDetail);

    const dispatch = useAppDispatch();
    const history = useHistory()

    useEffect(() => {
        const setSelectors = async () => {
            if (!fundDetails) return;
            const currencies = await API.getCurrencies()

            const getCurrencyOption = (currencyId: number) => {
                const currency = currencies.find((currency: ICurrency) => currency.id === currencyId)
                return currency && { value: currency.id, label: currency.code }
            }
            const getInviteOption = (isInviteOnly: boolean) => {
                const val = isInviteOnly ? 1 : 0;
                return INVITE_TYPE_OPTIONS.find((option: any) => val === option.value);
            }
            const getOfferLeverageOption = (isOfferedLeverage: boolean) => {
                const val = isOfferedLeverage ? 1 : 0;
                return LEVERAGE_TYPE_OPTIONS.find((option: any) => val === option.value);
            }
            const fundForForm: IFundDetailExtended = Object.assign({}, fundDetails, {
                "fund_type_selector": FUND_TYPE_OPTIONS.find(option => option.value === fundDetails.fund_type),
                "business_line_selector": BUSINESS_LINE_OPTIONS.find(option => option.label === fundDetails.business_line_name),
                "currency_selector": getCurrencyOption(fundDetails.fund_currency),
                "is_invite_only": getInviteOption(fundDetails.is_invite_only),
                "offer_leverage": getOfferLeverageOption(fundDetails.offer_leverage),
            });
            
            setFundWithFields(fundForForm);
        }
        setSelectors()
    }, [fundDetails])
    
    if (!fundWithFields || !fundDetails) return <></>

    const performFundDeletion = async () => {
        if (window.confirm('Are you sure you want to delete this fund?')) {
            await API.deleteFund(fundDetails.id)
            dispatch(deleteFund(fundDetails.id))
            history.push(`/${ADMIN_URL_PREFIX}/funds`)
        }
    }

    return <ContentContainer>
        <ContentInner>
            <Header title="Fund Setup" isSubtitle >
            </Header>
            <FundFormContainer>
                <CreateFundForm fund={fundWithFields} closeModal={() => { }} />
            </FundFormContainer>
            <H3>Delete fund</H3>
            <Button variant="outline-secondary" onClick={performFundDeletion} >
                Delete fund
            </Button>
        </ContentInner>
    </ContentContainer>
}


export default FundSetup;