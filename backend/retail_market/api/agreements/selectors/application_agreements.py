from api.agreements.models import ApplicantAgreementDocument
from api.applications.models import Application


def has_agreement_documents(application: Application):
    return ApplicantAgreementDocument.objects.filter(application=application).count() > 0

def all_agreements_signed(application: Application):
    if not has_agreement_documents(application=application):
        return False

    return not ApplicantAgreementDocument.objects.filter(
        application=application,
        completed=False
    ).exists()

