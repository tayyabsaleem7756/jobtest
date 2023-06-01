# Generated by Django 3.2.12 on 2022-04-25 15:54

from django.db import migrations, models
import django.db.models.deletion
import encrypted_fields.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('companies', '0014_auto_20220404_1635'),
        ('currencies', '0002_alter_currencyrate_rate_date'),
        ('geographics', '0005_alter_countryiddocumenttype_id_document_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('bank_name', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('street_address', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('city', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('state', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('province', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('postal_code', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('account_name', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('account_number', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('routing_number', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('swift_code', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('iban_number', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('credit_account_name', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('credit_account_number', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('reference', encrypted_fields.fields.EncryptedCharField(max_length=120)),
                ('have_intermediary_bank', models.BooleanField(default=False)),
                ('intermediary_bank_name', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('intermediary_bank_swift_code', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('ach', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('wires', encrypted_fields.fields.EncryptedCharField(blank=True, max_length=120, null=True)),
                ('bank_country', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='geographics.country')),
                ('currency', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='currencies.currency')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='payment_detail', to='users.retailuser')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
