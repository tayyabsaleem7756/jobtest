# Generated by Django 3.2.16 on 2023-01-11 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0029_alter_fundactivity_equity_commitment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundactivity',
            name='equity_commitment',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=15),
        ),
    ]
