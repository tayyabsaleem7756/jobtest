from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from api.activities.services.update_fund_investor import FundInvestorActivityService
from api.companies.serializers import CompanyUserSerializer
from api.currencies.services.fund_currency_info import FundCurrencyDetail
from api.applications.models import Application
from api.funds.models import Fund, FundNav, FundTag
from api.investors.models import FundInvestor, FundOrder, Investor, RequestStatusChoice, FundSale
from api.investors.services.get_application_current_url import GetApplicationCurrentUrl
from api.investors.services.handle_order_completion import CompleteOrderService
from api.libs.utils.urls import get_eligibility_url


class InvestorSerializer(serializers.ModelSerializer):
    company_user = CompanyUserSerializer()

    class Meta:
        model = Investor
        exclude = ('created_at', 'modified_at')


class FundInvestorSerializer(serializers.ModelSerializer):
    investor_name = serializers.SerializerMethodField(read_only=True)
    fund_name = serializers.SerializerMethodField(read_only=True)
    is_legacy = serializers.SerializerMethodField(read_only=True)
    currency = serializers.SerializerMethodField(read_only=True)
    years_invested = serializers.SerializerMethodField(read_only=True)
    invested_since = serializers.SerializerMethodField(read_only=True)
    equity_remaining = serializers.SerializerMethodField(read_only=True)
    percent_of_account = serializers.SerializerMethodField(read_only=True)
    fund_nav = serializers.SerializerMethodField(read_only=True)
    loan_to_value = serializers.SerializerMethodField(read_only=True)
    has_data = serializers.SerializerMethodField(read_only=True)
    initial_leverage_ratio = serializers.SerializerMethodField()
    current_leverage_ratio = serializers.SerializerMethodField()
    fund_ownership_percent = serializers.SerializerMethodField()
    net_commitment_called_to_date = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()
    is_nav_disabled = serializers.SerializerMethodField()

    class Meta:
        model = FundInvestor
        exclude = ('modified_at',)

    @staticmethod
    def get_company_logo(obj: FundInvestor):
        company = obj.fund.company
        if company.logo:
            return company.logo.url
        return None

    @staticmethod
    def get_fund_ownership_percent(obj: FundInvestor) -> float:
        return obj.fund_ownership_percent * 100

    @staticmethod
    def get_initial_leverage_ratio(obj: FundInvestor) -> float:
        return obj.initial_leverage_ratio * 100

    @staticmethod
    def get_current_leverage_ratio(obj: FundInvestor) -> float:
        return obj.current_leverage_ratio * 100

    @staticmethod
    def get_investor_name(obj: FundInvestor) -> str:
        return obj.investor.name

    @staticmethod
    def get_fund_name(obj: FundInvestor) -> str:
        return obj.fund.name

    @staticmethod
    def get_is_legacy(obj: FundInvestor) -> bool:
        return obj.fund.is_legacy

    @staticmethod
    def get_currency(obj: FundInvestor) -> str:
        fund_detail = FundCurrencyDetail(fund=obj.fund)
        return fund_detail.process()

    @staticmethod
    def get_years_invested(obj: FundInvestor) -> float:
        first_capital_call_date = FundInvestorActivityService.get_first_capital_call(fund_investor=obj)
        if not first_capital_call_date:
            return 0
        return (timezone.now().date() - first_capital_call_date).days / 365

    @staticmethod
    def get_invested_since(obj: FundInvestor) -> str:
        first_capital_call_date = FundInvestorActivityService.get_first_capital_call(fund_investor=obj)
        if not first_capital_call_date:
            return ''
        return str(first_capital_call_date)

    @staticmethod
    def get_equity_remaining(obj: FundInvestor) -> Decimal:
        return obj.equity_commitment - obj.equity_called

    @staticmethod
    def get_net_commitment_called_to_date(obj: FundInvestor) -> Decimal:
        return obj.called_to_date - obj.gross_distributions_recallable_to_date

    @staticmethod
    def get_percent_of_account(obj: FundInvestor) -> float:
        overall_net_equity = FundInvestor.objects.filter(investor=obj.investor).aggregate(
            total_equity=Sum('current_net_equity'))
        total_equity = overall_net_equity['total_equity']
        return 100 * obj.current_net_equity / total_equity if total_equity else 0

    @staticmethod
    def get_fund_nav(obj: FundInvestor):
        fund = obj.fund
        try:
            fund_nav = FundNav.objects.filter(fund=fund).latest('as_of')
            return fund_nav.nav
        except FundNav.DoesNotExist:
            return None

    @staticmethod
    # This is a percentage, so multiply the result by 100
    def get_loan_to_value(obj: FundInvestor):
        denominator = obj.gross_share_of_investment_product + obj.capital_calls_since_last_nav - obj.distributions_calls_since_last_nav
        if denominator:
            return (obj.loan_balance / denominator) * 100
        return 0

    @staticmethod
    def get_has_data(obj: FundInvestor):
        return FundNav.objects.filter(fund=obj.fund).exists()

    @staticmethod
    def get_is_nav_disabled(obj: FundInvestor):
        return obj.fund.is_nav_disabled


class FundOrderSerializer(serializers.ModelSerializer):
    status_name = serializers.SerializerMethodField(read_only=True)
    ordered_by_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FundOrder
        exclude = ('created_at', 'modified_at')

    def update(self, instance, validated_data):
        updated_instance = super().update(instance, validated_data)
        if 'status' in validated_data and updated_instance.status == RequestStatusChoice.COMPLETED.value:
            complete_order_service = CompleteOrderService(order=instance)
            complete_order_service.complete()

        return updated_instance

    @staticmethod
    def get_status_name(obj: FundOrder) -> str:
        return obj.get_status_display()

    @staticmethod
    def get_ordered_by_name(obj: FundOrder) -> str:
        return obj.investor.name


class OpportunitySerializer(serializers.ModelSerializer):
    fund_investors = FundInvestorSerializer(many=True)
    fund_orders = FundOrderSerializer(many=True)
    fund_type_name = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_fund_type_name(obj: Fund) -> str:
        return obj.get_fund_type_display()

    @staticmethod
    def get_currency(obj: Fund):
        fund_detail = FundCurrencyDetail(fund=obj)
        return fund_detail.process()

class FundTagSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=False)
    slug = serializers.CharField(required=False)

    class Meta:
        model = FundTag
        exclude = ('created_at', 'modified_at', 'company')

    def create(self, validated_data):
        if 'name' not in validated_data:
            raise serializers.ValidationError({'name': 'This field is required.'})

        if 'company' not in validated_data:
            validated_data['company'] = self.context['company']
        if 'slug' not in validated_data:
            validated_data['slug'] = validated_data['name'].lower().replace(' ', '-')

        return super().create(validated_data)

class NonInvestedOpportunitySerializer(serializers.ModelSerializer):
    tags = FundTagSerializer(many=True)
    currency = serializers.SerializerMethodField()
    application_link = serializers.SerializerMethodField()
    is_application_started = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()
    external_onboarding_url = serializers.URLField(source="external_onboarding.url", read_only=True)
    document_filter = serializers.CharField(source="document_filter.code", read_only=True)

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_company_logo(obj: Fund):
        company = obj.company
        if company.logo:
            return company.logo.url
        return None

    @staticmethod
    def get_currency(obj: Fund):
        fund_detail = FundCurrencyDetail(fund=obj)
        return fund_detail.process()

    def get_application_link(self, obj: Fund):
        user = self.context['request'].user
        return GetApplicationCurrentUrl(
            fund=obj,
            user=user
        ).process()

    def get_is_application_started(self, obj: Fund):
        user = self.context['request'].user
        return Application.objects.filter(
            user=user,
            fund=obj,
            eligibility_response__isnull=False
        ).exists()


class FundSaleSerializer(serializers.ModelSerializer):
    fund_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FundSale
        exclude = ('created_at', 'modified_at')
        read_only_fields = ('sold_by',)

    def create(self, validated_data):
        validated_data['sold_by'] = self.context['user'].investor_profile
        return super().create(validated_data)

    @staticmethod
    def get_fund_name(obj: FundSale) -> str:
        return obj.fund.name


class RetrieveFundSerializer(serializers.ModelSerializer):
    fund_type_name = serializers.SerializerMethodField()

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_fund_type_name(obj: Fund) -> str:
        return obj.get_fund_type_display()


class RetrieveFundInvestorSerializer(serializers.ModelSerializer):
    ownership = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    fund = RetrieveFundSerializer()
    investor_name = serializers.CharField(source='investor.name', default=None)
    company_logo = serializers.SerializerMethodField()
    initial_leverage_ratio = serializers.SerializerMethodField()
    current_leverage_ratio = serializers.SerializerMethodField()
    fund_ownership_percent = serializers.SerializerMethodField()

    class Meta:
        model = FundInvestor
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_company_logo(obj: FundInvestor):
        company = obj.fund.company
        if company.logo:
            return company.logo.url
        return None

    @staticmethod
    def get_fund_ownership_percent(obj: FundInvestor) -> float:
        return obj.fund_ownership_percent * 100

    @staticmethod
    def get_initial_leverage_ratio(obj: FundInvestor) -> float:
        return obj.initial_leverage_ratio * 100

    @staticmethod
    def get_current_leverage_ratio(obj: FundInvestor) -> float:
        return obj.current_leverage_ratio * 100

    @staticmethod
    def get_ownership(obj: FundInvestor) -> str:
        return obj.fund.name

    @staticmethod
    def get_currency(obj: FundInvestor):
        fund_detail = FundCurrencyDetail(fund=obj.fund, currency=obj.currency)
        return fund_detail.process()


class RetrieveFundOrderSerializer(serializers.ModelSerializer):
    ownership = serializers.SerializerMethodField()
    fund_slug = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    confirmation_date = serializers.DateField(source='fund.confirmation_date', default=None)
    currency = serializers.SerializerMethodField()
    investor_name = serializers.CharField(source='investor.name', default=None)

    class Meta:
        model = FundOrder
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_ownership(obj: FundOrder) -> str:
        return obj.fund.name

    @staticmethod
    def get_fund_slug(obj: FundOrder) -> str:
        return obj.fund.slug

    @staticmethod
    def get_can_edit(obj: FundOrder) -> bool:
        if obj.status != RequestStatusChoice.PENDING.value:
            return False

        if obj.fund.confirmation_date and obj.fund.confirmation_date < timezone.now().date():
            return False

        return True

    @staticmethod
    def get_currency(obj: FundOrder):
        fund_detail = FundCurrencyDetail(fund=obj.fund)
        return fund_detail.process()


class InvestorDetailSerializer(serializers.ModelSerializer):
    invested_funds = RetrieveFundInvestorSerializer(many=True)
    invested_orders = RetrieveFundOrderSerializer(many=True)
    investor_sales = FundSaleSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['invested_funds'].context.update(self.context)

    class Meta:
        model = Investor
        exclude = ('modified_at',)


class InvestorProfileBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investor
        exclude = ('modified_at',)


class ActiveApplicationsFundSerializer(serializers.ModelSerializer):
    application_link = serializers.SerializerMethodField()
    application_status = serializers.SerializerMethodField()
    continue_url = serializers.SerializerMethodField()

    class Meta:
        model = Fund
        fields = (
            'name',
            'external_id',
            'focus_region',
            'application_link',
            'type',
            'risk_profile',
            'application_status',
            'continue_url'
        )

    def get_application_link(self, obj: Fund):
        user = self.context['request'].user
        return GetApplicationCurrentUrl(
            fund=obj,
            user=user
        ).process()

    def get_application_status(self, obj: Fund):
        fund_status = self.context['fund_status']
        return fund_status.get(obj.external_id, 'continue')

    def get_continue_url(self, obj: Fund):
        continue_url = self.context['continue_url']
        return continue_url.get(obj.external_id, get_eligibility_url(obj.external_id))
