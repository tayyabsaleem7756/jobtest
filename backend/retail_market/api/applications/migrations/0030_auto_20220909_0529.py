# Generated by Django 3.2.15 on 2022-09-09 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0029_alter_applicationcompanydocument_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='allocation_approval_email_sent',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='allocation_approval_email_sent',
            field=models.BooleanField(default=False),
        ),
    ]
