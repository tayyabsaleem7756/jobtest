# Generated by Django 3.2.16 on 2022-12-14 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0023_auto_20221110_1035'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundinvestor',
            name='nav_share',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=20),
        ),
    ]
