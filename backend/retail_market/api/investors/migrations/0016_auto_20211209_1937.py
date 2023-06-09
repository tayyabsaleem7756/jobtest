# Generated by Django 3.2.5 on 2021-12-09 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0015_auto_20211125_0740'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundinvestor',
            name='distributions_recallable',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinvestor',
            name='distributions_to_employee',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinvestor',
            name='distributions_used_for_interest',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinvestor',
            name='distributions_used_for_loan',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
