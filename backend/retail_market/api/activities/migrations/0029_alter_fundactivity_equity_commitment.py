# Generated by Django 3.2.16 on 2023-01-11 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0028_auto_20230110_1954'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundactivity',
            name='equity_commitment',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=13),
        ),
    ]
