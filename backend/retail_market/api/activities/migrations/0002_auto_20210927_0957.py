# Generated by Django 3.2.5 on 2021-09-27 09:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0003_companytoken'),
        ('activities', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('transaction_date', models.DateTimeField()),
                ('investor_id', models.CharField(db_index=True, max_length=250)),
                ('investor_code', models.CharField(db_index=True, max_length=250)),
                ('investor_name', models.CharField(db_index=True, max_length=250)),
                ('investment_code', models.CharField(db_index=True, max_length=250)),
                ('investment_name', models.CharField(db_index=True, max_length=250)),
                ('equity', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('commitment_amount', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('outstanding_commitment', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('escrow_balance', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('income_distributions', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('capital_distributions', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('distributions_recallable', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('leveraged_irr', models.FloatField(default=0)),
                ('unleveraged_irr', models.FloatField(default=0)),
                ('current_leverage_rate', models.FloatField(default=0)),
                ('initial_leverage_rate', models.FloatField(default=0)),
                ('current_interest_rate', models.FloatField(default=0)),
                ('fund_ownership', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('capital_called_since_last_nav', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('distributions_since_last_nav', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('unrealized_gain_loss', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('called_to_date', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_fund_activities', to='companies.company')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LoanActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('transaction_date', models.DateTimeField()),
                ('investor_id', models.CharField(db_index=True, max_length=250)),
                ('investment_entity_id', models.CharField(db_index=True, max_length=250)),
                ('currency', models.CharField(max_length=3)),
                ('loan_commitment', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('loan_only', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('interest_balance', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('interest_repay_income', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('employee_repay_income', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('interest_repay_capital', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('employee_repay_capital', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_loan_activities', to='companies.company')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='Activity',
        ),
    ]
