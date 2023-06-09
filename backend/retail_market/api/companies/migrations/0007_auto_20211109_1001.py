# Generated by Django 3.2.5 on 2021-11-09 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0006_companyfaq_companyprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyprofile',
            name='contact_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='companyprofile',
            name='opportunities_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='companytoken',
            name='display_on_top',
            field=models.BooleanField(default=False),
        ),
    ]
