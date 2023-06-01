# Generated by Django 3.2.12 on 2022-03-05 21:04

from django.db import migrations

from api.documents.models import Document


def update_investor_document_scope(apps, schema_editor):
    InvestorDocument = apps.get_model('documents', 'InvestorDocument')
    for investor_document in InvestorDocument.objects.all():
        document = investor_document.document
        document.access_scope = Document.AccessScopeOptions.INVESTOR_ONLY
        document.save()


class Migration(migrations.Migration):
    dependencies = [
        ('documents', '0013_alter_document_access_scope'),
    ]

    operations = [
        migrations.RunPython(update_investor_document_scope)
    ]
