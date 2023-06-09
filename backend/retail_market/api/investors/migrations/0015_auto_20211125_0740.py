# Generated by Django 3.2.5 on 2021-11-25 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0014_auto_20211125_0736'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundinvestor',
            name='profit_distributions',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinvestor',
            name='return_of_capital',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
