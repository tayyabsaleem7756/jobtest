from api.agreements.services.application_data.constants import TEXT_FIELD_TYPE, CHECKBOX_TYPE, SIGNATURE_TYPE, DATE_TYPE

GLOBAL_INDIVIDUAL_SC = {
        "fields": [
            {
                'tab_label': 'AccountHolderName',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'eSignDate_dob_af_date',
                'type': DATE_TYPE,
                'retain_style': True,
                'height': '19px',
                'required': 'true'
            },
            {
                'tab_label': 'PlaceCountryBirth',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'NumberStreet',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'CityTown',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'StateProvinceCounty',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'PostCode',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'Country',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'Number Street_2',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'CityTown_2',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'StateProvinceCounty_2',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'PostCode_2',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Country_2',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'toggle_1',
                'tab_group_labels': ['declaration_of_citizenship'],
                'type': CHECKBOX_TYPE
            },
            {
                'tab_label': 'ssn',
                "conditional_parent_label": 'toggle_1',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'true'
            },
            {
                'tab_label': 'toggle_2',
                'tab_group_labels': ['declaration_of_citizenship'],
                'type': CHECKBOX_TYPE
            },
            {
                'tab_label': 'toggle_3',
                'tab_group_labels': ['declaration_of_citizenship'],
                'type': CHECKBOX_TYPE
            },
            {
                'tab_label': 'Countrycountries_of_tax_residencyRow1',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Countrycountries_of_tax_residencyRow2',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Countrycountries_of_tax_residencyRow3',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_number_typeRow1',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_number_typeRow2',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_number_typeRow3',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_numberRow1',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_numberRow2',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Tax_reference_numberRow3',
                "conditional_parent_label": 'toggle_3',
                "conditional_parent_value": 'on',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'NotApplicableJurisdiction',
                'type': TEXT_FIELD_TYPE,
                'required': 'false'
            },
            {
                'tab_label': 'Signature1',
                'optional': 'false',
                'type': SIGNATURE_TYPE
            },
            {
                'tab_label': 'eSignDate_af_date',
                'optional': 'false',
                'type': DATE_TYPE
            }
        ],
        "groups": [
            {
                "document_id": "1",
                "group_label": 'declaration_of_citizenship',
                "maximum_allowed": "1",
                "minimum_required": "1",
                "group_rule": 'SelectAtLeast',
                "page_number": "1"
            }
        ]
    }