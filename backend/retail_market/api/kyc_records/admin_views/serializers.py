from rest_framework import serializers

from api.kyc_records.models import KYCRecord


class KYCUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCRecord
        fields = '__all__'