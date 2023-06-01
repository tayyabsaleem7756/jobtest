# Generated by Django 3.2.5 on 2021-09-20 09:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('companies', '0002_initial'),
        ('funds', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundSale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('requested_sale', models.DecimalField(decimal_places=3, max_digits=13)),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Pending'), (2, 'Accepted'), (3, 'Denied'), (4, 'Completed')], default=1)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_sales', to='funds.fund')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Investor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('leverage_used', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('name', models.CharField(max_length=120)),
                ('partner_id', models.CharField(db_index=True, max_length=250, unique=True)),
                ('vehicle_type', models.PositiveSmallIntegerField(choices=[(1, 'Individual')], default=1)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FundSaleOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('offer_amount', models.DecimalField(decimal_places=3, max_digits=13)),
                ('leverage_requested', models.DecimalField(decimal_places=3, max_digits=13)),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Pending'), (2, 'Accepted'), (3, 'Denied'), (4, 'Completed')], default=1)),
                ('offered_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_purchase_offers', to='investors.investor')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_offers', to='investors.fundsale')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='fundsale',
            name='purchased_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purchased_sales', to='investors.investor'),
        ),
        migrations.AddField(
            model_name='fundsale',
            name='sold_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='investor_sales', to='investors.investor'),
        ),
        migrations.CreateModel(
            name='FundOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('requested_allocation', models.DecimalField(decimal_places=3, max_digits=13)),
                ('requested_leverage', models.DecimalField(decimal_places=3, max_digits=13)),
                ('approved_allocation', models.DecimalField(blank=True, decimal_places=3, max_digits=13, null=True)),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Pending'), (2, 'Accepted'), (3, 'Denied'), (4, 'Completed')], default=1)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_orders', to='funds.fund')),
                ('handled_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='handled_fund_orders', to='companies.companyuser')),
                ('investor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invested_orders', to='investors.investor')),
                ('used_role_leverage', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='companies.companyrole')),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
        migrations.CreateModel(
            name='FundInvestor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('initial_leverage_ratio', models.FloatField(default=0)),
                ('current_leverage_ratio', models.FloatField(default=0)),
                ('purchase_price', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('commitment_to_date', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('uncalled_amount', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('total_distributions', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('pending_distributions', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('leverage_used', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('loan_balance_with_unpaid_interest', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('current_interest_rate', models.FloatField(default=0)),
                ('interest_accrued', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('interest_paid', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('equity_commitment', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('equity_called', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('current_net_equity', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('fund_ownership_percent', models.FloatField(default=0)),
                ('fund_nav_date', models.DateField(blank=True, null=True)),
                ('percent_of_account', models.FloatField(default=0)),
                ('nav_share', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('remaining_equity', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('unrealized_gain', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('leveraged_irr', models.FloatField(default=0)),
                ('un_leveraged_irr', models.FloatField(default=0)),
                ('last_nav_update', models.DateTimeField(blank=True, null=True)),
                ('capital_calls_since_last_nav', models.PositiveIntegerField(default=0)),
                ('distributions_calls_since_last_nav', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_investors', to='funds.fund')),
                ('investor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invested_funds', to='investors.investor')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='order_allocations', to='investors.fundorder')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CompanyUserInvestor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('role', models.PositiveSmallIntegerField(choices=[(1, 'Manager')], default=1)),
                ('company_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='associated_investor_profiles', to='companies.companyuser')),
                ('investor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='associated_users', to='investors.investor')),
            ],
            options={
                'unique_together': {('company_user', 'investor')},
            },
        ),
    ]
