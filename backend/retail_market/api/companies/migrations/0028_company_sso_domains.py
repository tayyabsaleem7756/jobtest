# Generated by Django 3.2.16 on 2022-12-20 05:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0027_merge_20220907_1450'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='sso_domains',
            field=models.JSONField(default=list),
        ),
    ]
