/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useParams } from 'react-router-dom'
import Tick from 'assets/images/Icontick.png'
import Button from 'components/Button/ThemeButton'
import Loader from 'components/Loader'
import { getApplicationStatus } from 'services/OpportunityOnboarding'
import { BtnsSection, Cont, Description, Icon, Title } from './styled'

const NEXT_STEP_MESSAGE =
	'Thank you. Please continue to the next step to fill AML/KYC details'

const WillReviewSection = ({
	EligibilityResText,
	isEligible,
	externalId,
 	handleBack
}: any) => {
	const { user } = useAuth0()
	const navigate = useNavigate()
	const {company} =useParams()
	const [appStatus, setAppStatus] = useState<any>({})

	const handleGetApplicationStatus = async () => {
		const res = await getApplicationStatus(externalId)
		if (res.success) {
			setAppStatus(res.data)
			// setAppStatus({ is_approved: true })
		}
	}

	useEffect(() => {
		handleGetApplicationStatus()
	}, [])

	if (Object.keys(appStatus).length === 0)
		return (
			<Cont>
				<Loader />
			</Cont>
		)

	return (
		<>
		<Button
			onClick={handleBack}
			solo
			position='left'
			variant='outlined'
			size='sm'
		>
			Back
		</Button>
		<Cont>
			{isEligible ? (
				<>
					<Icon src={Tick} alt='tick' />
					{appStatus?.is_approved ? (
						<Title>{NEXT_STEP_MESSAGE}</Title>
					) : (
						<>
							<Title>{EligibilityResText.need_review_text}</Title>
							<Description>
								Expect an email to {user?.email} in the
								following week with your eligibility result and
								next steps.
							</Description>
						</>
					)}
					<BtnsSection>
						<Button
							size='sm'
							onClick={() =>
								navigate(
									appStatus?.is_approved
										? `/${company}/funds/${externalId}/amlkyc`
										: `/${company}`,
								)
							}
						>
							{appStatus?.is_approved ? 'Next' : 'Close'}
						</Button>
						<Button
							size='sm'
							onClick={() => navigate(`/${company}`)}
							variant='outlined'
						>
							See all funds
						</Button>
					</BtnsSection>
				</>
			) : (
				<>
					<Title>Not Eligible</Title>
					<Description>{EligibilityResText.failure_text}</Description>
					<BtnsSection>
						<Button size='sm' onClick={() => navigate(`/${company}`)}>
							Close
						</Button>
					</BtnsSection>
				</>
			)}
		</Cont>
	</>
	)
}

export default WillReviewSection
