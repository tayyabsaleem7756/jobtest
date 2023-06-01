# Generated by Django 3.2.5 on 2021-11-16 11:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0008_auto_20211109_1041'),
        ('funds', '0012_fundprofile_eligibility_criteria'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundInterest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_interests', to='funds.fund')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='interested_in_funds', to='companies.companyuser')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
