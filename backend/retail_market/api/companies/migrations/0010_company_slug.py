# Generated by Django 3.2.10 on 2022-01-17 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0009_alter_companyuser_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='slug',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
