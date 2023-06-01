# Generated by Django 3.2.13 on 2022-04-22 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0005_auto_20220407_1959'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Created'), (2, 'Submitted'), (3, 'Denied'), (4, 'Approved'), (5, 'Withdrawn'), (6, 'Finalized')], default=1),
        ),
        migrations.AlterField(
            model_name='historicalapplication',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Created'), (2, 'Submitted'), (3, 'Denied'), (4, 'Approved'), (5, 'Withdrawn'), (6, 'Finalized')], default=1),
        ),
    ]
