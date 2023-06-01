from rest_framework import serializers

from api.currencies.models import Currency, CurrencyRate


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        exclude = ('created_at',)


class CurrencyRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyRate
        exclude = ('created_at', 'modified_at')
