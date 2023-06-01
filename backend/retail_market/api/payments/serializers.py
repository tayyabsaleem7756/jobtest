from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api.applications.models import Application
from api.comments.models import ApplicationComment, ModuleChoices
from api.comments.services.update_comment_status import UpdateCommentService
from api.payments.models import PaymentDetail


class PaymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetail
        fields = "__all__"
        read_only_fields = ('user',)

    def validate(self, attrs):
        country = attrs['bank_country']

        if country.iso_code == "US":
            self.validate_us_fields(attrs)
        else:
            self.validate_non_us_fields(attrs)

        return attrs

    def validate_us_fields(self, attrs):
        required_fields = ['state', 'routing_number']

        if errors := self.validate_required_fields(required_fields, attrs):
            raise ValidationError(errors)

    def validate_non_us_fields(self, attrs):
        # required_fields = ['province', 'swift_code', 'iban_number']
        required_fields = ['swift_code', 'iban_number']

        if attrs.get('have_intermediary_bank') and not all(
                (attrs.get('intermediary_bank_name'), attrs.get('intermediary_bank_swift_code'))
        ):
            if not attrs.get('intermediary_bank_name'):
                required_fields.extend(['intermediary_bank_name'])
            if not attrs.get('intermediary_bank_swift_code'):
                required_fields.extend(['intermediary_bank_swift_code'])

        if errors := self.validate_required_fields(required_fields, attrs):
            raise ValidationError(errors)

    @staticmethod
    def validate_required_fields(fields, attrs):
        return {
            _field: 'This field is required'
            for _field in fields
            if not attrs.get(_field)
        }

    def create(self, validated_data):
        with atomic():
            retail_user = self.context['request'].user
            company = self.context['company']
            fund_external_id = self.context['fund_external_id']
            validated_data['user'] = retail_user
            application = Application.objects.filter(
                user=retail_user,
                fund__external_id=fund_external_id,
                company=company
            ).first()
            if not application:
                raise ValidationError('No application found')
            if application.payment_detail:
                payment_detail = application.payment_detail
                for attr, value in validated_data.items():
                    setattr(payment_detail, attr, value)
                    payment_detail.save()
            else:
                payment_detail = super().create(validated_data)
                application.payment_detail = payment_detail
                application.save()

            if application.kyc_record.payment_detail != payment_detail:
                application.kyc_record.payment_detail = payment_detail
                application.kyc_record.save()

            return payment_detail

    def update(self, instance, validated_data):
        update_comment_status_service = UpdateCommentService(
            module=ModuleChoices.BANKING_DETAILS.value,
            instance=instance,
            update_values=validated_data
        )
        updated_instance = super().update(instance, validated_data)
        update_comment_status_service.update_comments_status()
        return updated_instance
