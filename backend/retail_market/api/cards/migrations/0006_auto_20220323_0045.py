# Generated by Django 3.2.12 on 2022-03-23 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0005_auto_20220309_1737'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'Private Company'), (4, 'Limited Partnership')], null=True),
        ),
        migrations.AddField(
            model_name='historicalcard',
            name='kyc_investor_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Individual'), (2, 'Participant'), (3, 'Private Company'), (4, 'Limited Partnership')], null=True),
        ),
    ]
