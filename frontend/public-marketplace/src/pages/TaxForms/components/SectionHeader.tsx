import React, { FunctionComponent } from 'react'
import { FieldComponent } from '../interfaces'

type Props = FieldComponent

const SectionHeader: FunctionComponent<Props> = ({ question }) => {
	const { label } = question

	return <h3>{label}</h3>
}

export default SectionHeader
