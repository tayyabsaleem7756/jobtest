import { SxProps } from '@mui/system'
import Logo from 'assets/images/NavableLogo.png'
import { CardCont, Text, CompanyLogo } from './styled'

const SponsoredCard = ({ sx }: { sx?: SxProps }) => (
	<CardCont sx={sx}>
		<Text>
			This investment plaform is being powered by our financial technology
			partner
		</Text>
		<CompanyLogo src={Logo} />
	</CardCont>
)

export default SponsoredCard

SponsoredCard.defaultProps = {
	sx: {},
}
