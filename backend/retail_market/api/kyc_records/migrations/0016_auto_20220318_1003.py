# Generated by Django 3.2.12 on 2022-03-18 10:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0005_alter_countryiddocumenttype_id_document_type'),
        ('kyc_records', '0015_auto_20220317_2310'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='job_title',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='office_location',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='geographics.country'),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='job_title',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='office_location',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geographics.country'),
        ),
    ]
