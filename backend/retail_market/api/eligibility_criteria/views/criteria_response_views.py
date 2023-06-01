from django.http import Http404
from rest_framework.generics import CreateAPIView, RetrieveAPIView, get_object_or_404, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from api.applications.models import Application
from api.applications.serializers import ApplicationSerializer
from api.eligibility_criteria.models import (
    ResponseBlockDocument, EligibilityCriteriaResponse, InvestmentAmount, CriteriaBlock, CriteriaBlockResponse
)
from api.eligibility_criteria.serializers import (
    CriteriaResponseBlockSerializer, UserResponseFetchSerializer, CriteriaResponseBlockDocumentSerializer,
    CriteriaResponseUpdateSerializer, EligibilityStatusSerializer, InvestmentAmountSerializer,
    UpdateInvestmentAmountSerializer, CriteriaResponseSerializer, CriteriaBlockSerializer
)
from api.eligibility_criteria.services.calculate_eligibility import CalculateEligibilityService
from api.eligibility_criteria.services.check_for_self_certification import EligibilityResponseSelfCertification
from api.eligibility_criteria.services.eligibility_response_documents import EligibilityResponseDocuments
from api.eligibility_criteria.services.get_eligibility_card import GetEligibilityCriteriaCard
from api.eligibility_criteria.services.get_eligibility_criteria_user_response import \
    FundEligibilityCriteriaPreviewResponse
from api.eligibility_criteria.services.get_investment_amount_card import GetInvestmentAmountCard
from api.eligibility_criteria.services.respose_review_service import EligibilityCriteriaReviewService
from api.eligibility_criteria.services.smart_decision_service import SmartDecisionBlockService
from api.funds.models import Fund
from api.geographics.models import Country
from api.mixins.company_user_mixin import CompanyUserViewMixin
from api.workflows.models import WorkFlow, Task


class CriteriaBlockResponseAPIView(CreateAPIView):
    serializer_class = CriteriaResponseBlockSerializer


class CriteriaBlockResponseGetCreateAPIView(APIView):
    serializer_class = UserResponseFetchSerializer

    def post(self, request, fund_external_id, country_code, vehicle_type):
        fund = get_object_or_404(
            Fund,
            external_id=fund_external_id,
            is_finalized=False
        )
        country = get_object_or_404(
            Country,
            iso_code__iexact=country_code
        )

        applicant_info = request.data
        response_data = FundEligibilityCriteriaPreviewResponse(
            fund=fund,
            user=self.request.user,
            country=country,
            vehicle_type=vehicle_type,
            applicant_info=applicant_info
        ).process()
        return Response(response_data)


class CriteriaResponseEligibilityStatusView(RetrieveAPIView):
    serializer_class = EligibilityStatusSerializer

    def get_object(self):
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse,
            pk=self.kwargs['pk']
        )
        if criteria_response.response_by.user_id != self.request.user.id:
            raise Http404
        eligibility_service = CalculateEligibilityService(user_response=criteria_response)
        return {'is_eligible': eligibility_service.calculate()}


class CriteriaResponseUpdateAPIView(UpdateAPIView):
    serializer_class = CriteriaResponseUpdateSerializer
    queryset = EligibilityCriteriaResponse.objects.all()

    def get_object(self):
        criteria_response = super().get_object()
        if criteria_response.response_by.user_id != self.request.user.id:
            raise Http404
        return criteria_response


class ResponseBlockDocumentCreateAPIView(CompanyUserViewMixin, CreateAPIView):
    serializer_class = CriteriaResponseBlockDocumentSerializer
    queryset = ResponseBlockDocument.objects.all()


class ResponseDocumentsAPIView(CompanyUserViewMixin, APIView):
    queryset = ResponseBlockDocument.objects.all()

    def get(self, request, *args, **kwargs):
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse,
            pk=self.kwargs['pk']
        )
        if criteria_response.response_by.user_id != self.request.user.id:
            raise Http404
        criteria_response_documents = EligibilityResponseDocuments(criteria_response=criteria_response)
        data = criteria_response_documents.get_required_documents()
        return Response(data)


class CreateInvestmentAmountAPIView(CompanyUserViewMixin, CreateAPIView, UpdateAPIView):
    serializer_class = InvestmentAmountSerializer
    queryset = InvestmentAmount.objects.all()

    def get_queryset(self):
        return InvestmentAmount.objects.all()

    def get_serializer_context(self):
        response_id = self.kwargs.get('response_id')
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse,
            pk=response_id,
            criteria__fund__company_id__in=self.company_ids
        )
        context = super().get_serializer_context()
        context['criteria_response'] = criteria_response
        return context


class SubmitEligibilityResponseAPIView(CompanyUserViewMixin, APIView):
    def get(self, request, response_id):
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse,
            pk=response_id,
            criteria__fund__company_id__in=self.company_ids
        )
        workflow = criteria_response.workflow  # type: WorkFlow
        workflow.workflow_tasks.filter(
            status=Task.StatusChoice.CHANGES_REQUESTED.value,
            task_type=Task.TaskTypeChoice.REVIEW_REQUEST.value,
        ).update(
            completed=False,
            status=Task.StatusChoice.PENDING.value
        )
        return Response({'status': 'success'})


class UpdateInvestmentAmountAPIView(CompanyUserViewMixin, UpdateAPIView):
    serializer_class = UpdateInvestmentAmountSerializer
    queryset = InvestmentAmount.objects.all()

    def get_queryset(self):
        return InvestmentAmount.objects.all()


class KYCEligibilityCardsAPIView(CompanyUserViewMixin, APIView):
    def get(self, request, application_id: int):
        application = get_object_or_404(
            Application,
            id=application_id,
            user=request.user
        )

        criteria_response = application.eligibility_response
        if not criteria_response:
            return Response({'eligibility_card': None, 'investment_card': None, 'response_id': None})

        card_data = GetEligibilityCriteriaCard(eligibility_criteria_response=criteria_response).process()
        investment_card = GetInvestmentAmountCard(eligibility_criteria_response=criteria_response).process()
        fund = criteria_response.criteria.fund
        kyc_record = criteria_response.kyc_record

        return Response(
            {
                'eligibility_card': card_data,
                'investment_card': investment_card,
                'response_id': criteria_response.id,
                'max_leverage_ratio': kyc_record.max_leverage_ratio,
                'minimum_investment': fund.minimum_investment,
                'offer_leverage': fund.offer_leverage
            }
        )


class GetFundCriteriaResponse(CompanyUserViewMixin, APIView):
    def get(self, request, fund_external_id: str):
        application = get_object_or_404(
            Application,
            fund__external_id=fund_external_id,
            user=request.user,
            company_id__in=self.company_ids,
            eligibility_response__isnull=False,
        )
        parsed_response_data = CriteriaResponseSerializer(application.eligibility_response).data
        return Response({
            'criteria_preview': FundEligibilityCriteriaPreviewResponse.get_criteria_preview(
                eligibility_criteria=application.eligibility_response.criteria
            ),
            'user_response': parsed_response_data,
            'application': ApplicationSerializer(application).data
        })


class EligibilityCriteriaResponseTaskAPIView(CompanyUserViewMixin, APIView):

    def post(self, request, response_id):
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse,
            id=response_id,
        )
        if criteria_response.is_eligible:
            eligibility_service = CalculateEligibilityService(user_response=criteria_response)
            criteria_blocks = eligibility_service.parse_criteria_blocks(exclude_nlc=False)
            if criteria_response.criteria.is_self_certified(criteria_blocks=criteria_blocks):
                EligibilityResponseSelfCertification.process(
                    criteria_response=criteria_response
                )
            else:
                criteria_review_service = EligibilityCriteriaReviewService(
                    eligibility_response_id=criteria_response.id,
                    user=self.request.user
                )
                criteria_review_service.complete_user_task(workflow=criteria_response.workflow)
                criteria_review_service.start_review()
        return Response({"status": "created"})


class SmartDecisionNavigationView(RetrieveAPIView):
    serializer_class = CriteriaBlockSerializer

    @staticmethod
    def update_last_position(response: EligibilityCriteriaResponse, block: CriteriaBlock):
        response.last_position = block.id
        response.save(update_fields=['last_position'])

    def get_object(self):
        fund_external_id = self.kwargs['fund_external_id']
        try:
            criteria_block =  CriteriaBlock.objects.get(pk=self.kwargs['pk'],criteria__fund__external_id=fund_external_id)
        except CriteriaBlock.DoesNotExist:
            application = Application.objects.get(
                user=self.request.user,
                fund__external_id=fund_external_id
            )
            if not application.eligibility_response:
                return None

            return application.eligibility_response.criteria.criteria_blocks.filter(
                is_country_selector=False
            ).order_by('position').first()
        company_user = self.request.user.associated_company_users.get(company=criteria_block.criteria.fund.company)
        criteria_response = get_object_or_404(
            EligibilityCriteriaResponse, criteria=criteria_block.criteria, response_by=company_user
        )

        is_next = self.kwargs['navigation_point'] == 'next'

        if is_next:
            try:
                response_block = criteria_block.user_responses.get(criteria_response=criteria_response)
                response_json = response_block.response_json
            except CriteriaBlockResponse.DoesNotExist:
                response_json = {}

            initial_data = {
                'block_id': criteria_block.id,
                'response_json': response_json,
                'eligibility_criteria_id': criteria_block.criteria.id
            }
            self.update_last_position(
                response=criteria_response,
                block=criteria_block
            )
            block = SmartDecisionBlockService(initial_data=initial_data).next_block()
        else:
            self.update_last_position(
                response=criteria_response,
                block=criteria_block
            )
            block = SmartDecisionBlockService.previous_block(
                criteria_block=criteria_block, criteria_response=criteria_response
            )

        if not block:
            if is_next:
                return criteria_block.criteria.criteria_blocks.get(is_final_step=True)
            else:
                return criteria_block.criteria.criteria_blocks.get(is_country_selector=True)

        return block
