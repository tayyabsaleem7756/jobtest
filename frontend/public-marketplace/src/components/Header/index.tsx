import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles';
import Logo from 'assets/images/gp-solutions-logo.png'
import useWindowDimensions from 'utils/WindowDimensions'
import { useState } from 'react'
import DropDown from './components/DropDown'
import Drawer from './components/Drawer'
import {
	PageCont,
	HeaderLogo,
	RightPadding,
	MidPadding,
	FlexRow,
	HeaderText,
} from './styled'
import { SM } from './constants'
import { get } from 'lodash';

const dissAllowedPages = ['login']
const currentPage = 'Browse'

const Header = () => {
	const { pathname } = useLocation()
	const theme = useTheme()
	const companyLogo = get(theme,'components.logo')
	const [open, setOpen] = useState(false)
	const hide = pathname.split('/').some(item => dissAllowedPages.includes(item));
	const { width } = useWindowDimensions()
	const mobileVersion = () => width < SM
	// eslint-disable-next-line react/jsx-no-useless-fragment
	if (hide) return <></>
	return (
		<PageCont
			sx={
				mobileVersion() && open
					? {
							boxShadow: 'none !important',
					  }
					: {}
			}
		>
			<FlexRow>
				<HeaderLogo src={companyLogo || Logo} alt='Logo' />
				{!mobileVersion() &&
					['Browse', 'Your Investments'].map(text => (
						<MidPadding
							key={text}
							sx={
								text === currentPage
									? { borderColor: 'primary.main' }
									: {}
							}
						>
							<HeaderText>{text}</HeaderText>
						</MidPadding>
					))}
			</FlexRow>

			{mobileVersion() ? (
				<RightPadding>
					<Drawer
						currentPage={currentPage}
						sendToParent={(
							e: boolean | ((prevState: boolean) => boolean),
						) => setOpen(e)}
					/>
				</RightPadding>
			) : (
				<FlexRow>
					{['Support'].map(text => (
						<MidPadding key={text}>
							<HeaderText>{text}</HeaderText>
						</MidPadding>
					))}
					<RightPadding sx={{ height: '25px' }}>
						<DropDown />
					</RightPadding>
				</FlexRow>
			)}
		</PageCont>
	)
}

export default Header
