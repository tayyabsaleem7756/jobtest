import filter from 'lodash/filter'
import size from 'lodash/size'
import Button from 'components/Button/ThemeButton'
import { IRequiredDocument } from 'interfaces/OpportunityOnboarding/documents_required'
import { ErrorDiv } from './styled'
import DocumentUploadSection from './components/DocumentUploadSection'

interface UserDocsBlockProps {
	handleNext: () => void
	handleBack: () => void
	requiredDocuments: IRequiredDocument[]
	refreshDocsAndStatus: () => void
}

const UserDocsBlock = ({
	requiredDocuments,
	refreshDocsAndStatus,
	handleNext,
	handleBack,
}: UserDocsBlockProps) => {
	const isValid = () =>
		size(filter(requiredDocuments, doc => size(doc.documents) === 0)) === 0

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

			{requiredDocuments &&
				requiredDocuments.map(requiredDocument => (
					<DocumentUploadSection
						key={`${requiredDocument.response_block_id}-${requiredDocument.options[0]?.id}`}
						requiredDocument={requiredDocument}
						refreshDocsAndStatus={refreshDocsAndStatus}
					/>
				))}

			{!isValid() && <ErrorDiv>Please upload the documents.</ErrorDiv>}
			<Button
				solo
				size='sm'
				disabled={!isValid()}
				position='right'
				onClick={handleNext}
			>
				Next
			</Button>
		</>
	)
}

export default UserDocsBlock
