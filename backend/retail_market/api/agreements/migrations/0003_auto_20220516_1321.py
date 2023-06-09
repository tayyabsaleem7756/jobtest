# Generated by Django 3.2.13 on 2022-05-16 13:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0029_alter_document_document_type'),
        ('agreements', '0002_agreementdocumentwitness_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='applicantagreementdocument',
            name='certificate',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='signed_agreement_document', to='documents.document'),
        ),
        migrations.AlterField(
            model_name='applicantagreementdocument',
            name='signed_document',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='actual_agreement_document', to='documents.document'),
        ),
    ]
