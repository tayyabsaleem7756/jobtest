# Generated by Django 3.2.5 on 2021-11-24 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0012_auto_20211110_0715'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundinvestor',
            name='loan_drawn',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinvestor',
            name='loan_repayment',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
