# Generated by Django 3.2.12 on 2022-04-12 18:51

from django.db import migrations
import encrypted_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0023_merge_20220404_2023'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='date_of_birth',
            field=encrypted_fields.fields.EncryptedDateField(null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='source_of_funds',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, default='', max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='date_of_birth',
            field=encrypted_fields.fields.EncryptedDateField(null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='source_of_funds',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, default='', max_length=500, null=True),
        ),
    ]
