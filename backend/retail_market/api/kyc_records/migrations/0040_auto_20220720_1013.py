# Generated by Django 3.2.13 on 2022-07-20 10:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tax_records', '0010_auto_20220622_2015'),
        ('kyc_records', '0039_auto_20220707_1835'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='tax_record',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='tax_records.taxrecord'),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='tax_record',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tax_kyc_record', to='tax_records.taxrecord'),
        ),
    ]
