from django.db import models
from api.models import BaseModel


class ApplicationBackup(BaseModel):
    application = models.ForeignKey('applications.Application', on_delete=models.SET_NULL, related_name='backups', null=True)
    storage_key = models.CharField(max_length=120)

    class Meta:
        db_table = 'application_backups'


class FundBackup(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.SET_NULL, related_name='backups', null=True)
    storage_key = models.CharField(max_length=120)

    class Meta:
        db_table = 'fund_backups'


class FundDocumentsBackup(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.SET_NULL, related_name='document_backups', null=True)
    storage_key = models.CharField(max_length=120)

    class Meta:
        db_table = 'fund_documents_backups'
