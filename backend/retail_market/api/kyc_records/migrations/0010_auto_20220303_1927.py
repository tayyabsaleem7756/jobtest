# Generated by Django 3.2.12 on 2022-03-03 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0009_auto_20220301_2311'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='authorized_signatories',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='current_directors_managers',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='entity_name',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='kyc_entity',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='kyc_records.kycrecord'),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'Private Company'), (4, 'Limited Partnership')], default=1),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='authorized_signatories',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='current_directors_managers',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='entity_name',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='kyc_entity',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='kyc_records.kycrecord'),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'Private Company'), (4, 'Limited Partnership')], default=1),
        ),
    ]
