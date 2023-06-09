# Generated by Django 3.2.13 on 2022-06-28 09:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('funds', '0031_merge_20220427_2052'),
        ('applications', '0020_alter_application_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserApplicationState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('module', models.PositiveSmallIntegerField(choices=[(1, 'Eligibility Criteria'), (2, 'KYC Record'), (3, 'Tax Record'), (4, 'Banking Details'), (5, 'Fund Documents'), (6, 'Requested Documents'), (7, 'Investment Allocation'), (8, 'Participant'), (10, 'Agreement')])),
                ('last_position', models.CharField(max_length=50)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_applications_states', to='funds.fund')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_applications_states', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'fund')},
            },
        ),
    ]
