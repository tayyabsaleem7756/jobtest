# Generated by Django 3.2.13 on 2022-07-05 06:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0019_merge_20220628_1412'),
        ('documents', '0043_auto_20220705_0626'),
        ('agreements', '0006_auto_20220705_0654'),
    ]

    operations = [
        migrations.AddField(
            model_name='applicantagreementdocument',
            name='agreement_document',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fund_document_applicants', to='documents.funddocument'),
        ),
        migrations.AlterUniqueTogether(
            name='applicantagreementdocument',
            unique_together={('agreement_document', 'application')},
        ),
    ]
