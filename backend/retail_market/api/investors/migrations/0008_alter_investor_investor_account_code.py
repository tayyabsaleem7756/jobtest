# Generated by Django 3.2.5 on 2021-10-11 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0007_investor_investor_account_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='investor',
            name='investor_account_code',
            field=models.CharField(db_index=True, max_length=250, unique=True),
        ),
    ]
