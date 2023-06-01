# Generated by Django 3.2.5 on 2021-11-24 10:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0014_fundinterest_interest_details'),
        ('documents', '0005_alter_document_document_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='investordocument',
            name='fund',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='fund_investor_documents', to='funds.fund'),
        ),
    ]
