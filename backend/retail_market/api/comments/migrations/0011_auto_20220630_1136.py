# Generated by Django 3.2.13 on 2022-06-30 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0010_auto_20220623_0907'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationcomment',
            name='module',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Eligibility Criteria'), (2, 'KYC Record'), (3, 'Tax Record'), (4, 'Banking Details'), (5, 'Fund Documents'), (6, 'Requested Documents'), (7, 'Investment Allocation'), (8, 'Participant'), (9, 'Agreements'), (10, 'Power of Attorney Document')], db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='historicalapplicationcomment',
            name='module',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Eligibility Criteria'), (2, 'KYC Record'), (3, 'Tax Record'), (4, 'Banking Details'), (5, 'Fund Documents'), (6, 'Requested Documents'), (7, 'Investment Allocation'), (8, 'Participant'), (9, 'Agreements'), (10, 'Power of Attorney Document')], db_index=True, null=True),
        ),
    ]
