# Generated by Django 3.2.13 on 2022-07-07 18:35

from django.db import migrations, models
import encrypted_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0038_merge_0031_auto_20220615_1821_0037_auto_20220623_2109'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='applicant_organized_for_specific_purpose_of_investing',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='applicant_owned_by_another_entity',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='direct_parent_owned_by_another_entity',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='net_worth',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, default='', max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='applicant_organized_for_specific_purpose_of_investing',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='applicant_owned_by_another_entity',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='direct_parent_owned_by_another_entity',
            field=models.BooleanField(null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='net_worth',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, default='', max_length=120, null=True),
        ),
    ]
