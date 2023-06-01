from django.db.models import Prefetch
from slugify import slugify

from api.agreements.services.application_data import SubscriptionField
from api.agreements.services.application_data.base import ModelBasedOptions
from api.agreements.services.application_data.constants import CHECKBOX_TYPE, ELIGIBILITY_ID, TEXT_FIELD_TYPE, \
    OTHER_LICENSE_VALUE
from api.eligibility_criteria.blocks_data.US import US_COUNTRY_CODE
from api.eligibility_criteria.blocks_data.US.accredited_investor_blocks import ACCREDITED_INVESTOR_CODE
from api.eligibility_criteria.blocks_data.all_blocks import ALL_BLOCKS
from api.eligibility_criteria.blocks_data.investor_blocks import KNOWLEDGEABLE_EMPLOYEE_CODE
from api.eligibility_criteria.models import EligibilityCriteriaResponse, FundEligibilityCriteria, CriteriaBlock, \
    CustomSmartBlock, CustomSmartBlockField
from api.eligibility_criteria.serializers import FundEligibilityCriteriaDetailSerializer, CustomSmartBlockSerializer
from api.funds.models import Fund

IS_KNOWLEDGEABLE_FIELD = 'is_knowledgeable'
LICENSE_TYPE = 'license_type'
OTHER_LICENSE_FIELD = 'other_license'


class EligibilityCriteriaOptions(ModelBasedOptions):
    PREFIX_ID = ELIGIBILITY_ID

    def get_block_ids(self, fund):
        block_ids = set({})
        eligibilityCriteria = FundEligibilityCriteria.objects.filter(
            fund=fund
        ).prefetch_related(
            Prefetch(
                'criteria_blocks',
                queryset=CriteriaBlock.objects.filter(is_user_documents_step=False)
            )
        ).prefetch_related(
            'criteria_blocks__block'
        )
        fund_criteria = FundEligibilityCriteriaDetailSerializer(eligibilityCriteria, many=True).data
        for criteria in fund_criteria:
            blocks = criteria['criteria_blocks']
            for block in blocks:
                if block['block'] is not None:
                    block_ids.add(block['block']['block_id'])
                if block['custom_block'] is not None:
                    block_ids.add(slugify(block['custom_block']['title']))

        return list(block_ids)

    def get_smart_block_field_index(self, fields, field_id):
        for index, field in enumerate(fields, start=1):
            if field.id == int(field_id):
                return index
        return 0

    def get_fields(self, fund):
        custom_blocks = CustomSmartBlock.objects.filter(fund=fund).prefetch_related('custom_fields')
        custom_blocks = CustomSmartBlockSerializer(custom_blocks, many=True).data
        fund_block_ids = self.get_block_ids(fund=fund)
        options = []
        for block_container in ALL_BLOCKS:
            if not isinstance(block_container, list):
                blocks = [block_container]
            else:
                blocks = block_container
            for block in blocks:
                if block['block_id'] in fund_block_ids:
                    for option in block.get('options', {}).get('individual', []):
                        field_id = self.generate_id(field_id=option['id'])
                        options.append(SubscriptionField(
                            id=field_id,
                            field_name='',
                            type=CHECKBOX_TYPE,
                            text=option['text']
                        ).to_json())
                        if 'options' in option:
                            options.append(SubscriptionField(
                                id=self.generate_id(
                                    field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{LICENSE_TYPE}'),
                                field_name='',
                                type=TEXT_FIELD_TYPE,
                                text=''
                            ).to_json())
                            options.append(SubscriptionField(
                                id=self.generate_id(
                                    field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{OTHER_LICENSE_FIELD}'),
                                field_name='',
                                type=TEXT_FIELD_TYPE,
                                text=''
                            ).to_json())

        if custom_blocks:
            for block in custom_blocks:
                block_title = slugify(block['title'])
                if block_title in fund_block_ids:
                    for index, field in enumerate(block['custom_fields'], start=1):
                        field_id = index
                        field_id = f'csb-{block_title}-{field_id}'
                        options.append(SubscriptionField(
                            id=self.generate_id(field_id=field_id),
                            field_name='',
                            type=CHECKBOX_TYPE,
                            text=field['title']
                        ).to_json())
        options.append(
            {
                'id': self.generate_id(field_id=IS_KNOWLEDGEABLE_FIELD),
                'text': 'Is knowledgeable employee?',
                'type': CHECKBOX_TYPE
            }
        )

        return options

    @staticmethod
    def get_other_knowledgeable_values(criteria_block_response, value):
        try:
            block_id = criteria_block_response.block.block.block_id
            if block_id.lower() != KNOWLEDGEABLE_EMPLOYEE_CODE:
                return None

            options = criteria_block_response.block.payload.get('options')
            option_position = 1
            for option in options:
                logical_value = option.get('logical_value')
                if value == option['id']:
                    if not logical_value:
                        return f'{KNOWLEDGEABLE_EMPLOYEE_CODE.lower()}.0'
                    return f'{KNOWLEDGEABLE_EMPLOYEE_CODE.lower()}.{option_position}'
                if logical_value:
                    option_position += 1
        except:
            return None

    def get_values(self, instance: EligibilityCriteriaResponse, fund: Fund):
        if not instance or not fund:
            return
        selected_options = []
        license_type_answer = None
        certificate_name_answer = None
        for criteria_block_response in instance.user_block_responses.filter(
                block__is_final_step=False,
                block__is_country_selector=False,
                block__is_user_documents_step=False,
                block__is_custom_logic_block=False,
                block__auto_completed=False
        ).exclude(
            block__block__is_admin_only=True
        ).order_by('block__position').prefetch_related('block').prefetch_related('block__block'):
            answer_payload = criteria_block_response.response_json
            value = answer_payload.get('value')
            license_type = answer_payload.get('license_type')
            certificate_name = answer_payload.get('certificate_name')

            if value:
                if isinstance(value, str):
                    selected_options.append(self.generate_id(field_id=value))
                    other_value = self.get_other_knowledgeable_values(
                        criteria_block_response=criteria_block_response,
                        value=value
                    )
                    if other_value:
                        selected_options.append(self.generate_id(field_id=other_value))

            if license_type:
                selected_options.append(
                    self.generate_id(field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{LICENSE_TYPE}')
                )
                license_type_answer = license_type

            if certificate_name:
                selected_options.append(
                    self.generate_id(field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{OTHER_LICENSE_FIELD}')
                )
                certificate_name_answer = certificate_name

            for _key, value in answer_payload.items():
                if value == True:
                    selected_options.append(self.generate_id(field_id=_key))

        for smart_block_response in instance.user_block_responses.filter(
                block__is_custom_block=True
        ).order_by('block__position').prefetch_related('block__custom_block'):
            answer_payload = smart_block_response.response_json
            custom_block_fields = CustomSmartBlockField.objects.filter(
                block=smart_block_response.block.custom_block
            ).order_by('created_at')
            if smart_block_response.block.custom_block.is_multiple_selection_enabled:
                for _key, value in answer_payload.items():
                    if value == True:
                        index = self.get_smart_block_field_index(custom_block_fields, _key)
                        field_id = f'csb-{slugify(smart_block_response.block.custom_block.title)}-{index}'
                        selected_options.append(self.generate_id(field_id=field_id))
            else:
                selected_option_id = answer_payload.get('value')
                if selected_option_id:
                    try:
                        index = self.get_smart_block_field_index(custom_block_fields, selected_option_id)
                        field_id = f'csb-{slugify(smart_block_response.block.custom_block.title)}-{index}'
                        selected_options.append(self.generate_id(field_id=field_id))
                    except CustomSmartBlockField.DoesNotExist:
                        continue

        knowledgeable_id = self.generate_id(field_id=IS_KNOWLEDGEABLE_FIELD)
        license_type_id = self.generate_id(field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{LICENSE_TYPE}')
        other_license_id = self.generate_id(field_id=f'{US_COUNTRY_CODE}.{ACCREDITED_INVESTOR_CODE}.{OTHER_LICENSE_FIELD}')

        fields = self.get_fields(fund=fund)

        for field in fields:
            if field['id'] == knowledgeable_id:
                field['value'] = instance.is_knowledgeable
            elif field['id'] == other_license_id and license_type_id in selected_options \
                    and certificate_name_answer and license_type_answer.get('label') == OTHER_LICENSE_VALUE:
                field['value'] = certificate_name_answer
            elif field['id'] == license_type_id and field['id'] in selected_options and license_type_answer:
                field['value'] = license_type_answer.get('label')
            else:
                field['value'] = field['id'] in selected_options if field['id'] not \
                                                                    in [license_type_id, other_license_id] else ''
        return fields
