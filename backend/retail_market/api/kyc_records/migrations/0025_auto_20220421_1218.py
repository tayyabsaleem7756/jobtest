# Generated by Django 3.2.12 on 2022-04-21 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0024_auto_20220417_1648'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'ENTITY'), (4, 'Private Company'), (5, 'Limited Partnership'), (6, 'Trust')], default=1),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'ENTITY'), (4, 'Private Company'), (5, 'Limited Partnership'), (6, 'Trust')], default=1),
        ),
    ]
