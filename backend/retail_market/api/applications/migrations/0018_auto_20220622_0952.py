# Generated by Django 3.2.13 on 2022-06-22 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0017_merge_0015_auto_20220614_0648_0016_auto_20220607_2022'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='withdrawn_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='withdrawn_comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
