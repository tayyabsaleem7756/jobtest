import { useNavigate, useParams } from 'react-router-dom'
import { IActiveApplicationFund } from 'interfaces/common/applicationStatus'
import Button from 'components/Button/ThemeButton'
import EastIcon from '@mui/icons-material/East'
import { Cont, ColView, RowView, Title, Text, StatusCell } from './styled'
import { toLower } from 'lodash'
import arrowRight from "../../../../../assets/images/white-arrow-right.svg"

const CONTINUE_STATUS = ['continue', 'approved']

const ApplicationTile = ({
	application,
}: {
	application: IActiveApplicationFund
}) => {
	const {
		name,
		focus_region,
		type,
		risk_profile,
		application_status,
		continue_url,
		external_id,
	} = application
	const navigate = useNavigate()
	const { company } =useParams()
	const continuePageName = continue_url.split('/').pop()
	const generatePageUrl = () => {
		return `/${company}/funds/${external_id}/application`
	}

	return (
		<Cont>
			<ColView>
				<Title>{name}</Title>
				{/* <StatusCell>Reviewing your eligibility</StatusCell> */}
			</ColView>
			<RowView>
				<ColView>
					<Text>{focus_region}</Text>
					<Text>{type}</Text>
					<Text>{risk_profile}</Text>
				</ColView>
				<Button
						contSx={{ minWidth: '200px' }}
						position='right'
						solo
						onClick={() =>

							navigate(
								generatePageUrl(),
							)
						}
						size='sm'
					>
					<img src={arrowRight} className={'ms-2'}/> View Application
					</Button>
			</RowView>
		</Cont>
	)
}

export default ApplicationTile
