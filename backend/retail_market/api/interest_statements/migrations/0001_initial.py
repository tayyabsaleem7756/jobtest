# Generated by Django 3.2.12 on 2022-03-11 01:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('admin_users', '0001_initial'),
        ('investors', '0017_fundinvestor_gross_distributions_recallable_to_date'),
        ('funds', '0023_fund_domicile'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProcessState',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('process_id', models.UUIDField(db_index=True, primary_key=True, serialize=False)),
                ('process_name', models.CharField(max_length=120)),
                ('state', models.PositiveSmallIntegerField(choices=[(1, 'Started'), (2, 'In Progress'), (3, 'Completed'), (4, 'Failed')])),
                ('description', models.TextField(max_length=250)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_users.adminuser')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InterestStatement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('quarter', models.CharField(db_index=True, max_length=120)),
                ('reason', models.PositiveSmallIntegerField(choices=[(1, 'First Processed'), (2, 'Forced Processed')])),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Success'), (2, 'Failure')])),
                ('fund_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='funds.fund')),
                ('investor_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='investors.investor')),
                ('process_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='interest_statements.processstate')),
            ],
            options={
                'unique_together': {('investor_id', 'fund_id', 'process_id')},
            },
        ),
    ]
