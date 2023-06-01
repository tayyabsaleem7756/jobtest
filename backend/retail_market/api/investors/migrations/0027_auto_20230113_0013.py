# Generated by Django 3.2.16 on 2023-01-13 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0026_auto_20230111_2011'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundinvestor',
            name='called_to_date',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='capital_calls_since_last_nav',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='commitment_amount',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='commitment_to_date',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='current_net_equity',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='distributions_calls_since_last_nav',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='distributions_recallable',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='distributions_to_employee',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='distributions_used_for_interest',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='distributions_used_for_loan',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='equity_called',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='equity_commitment',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='gain',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='gross_distributions_recallable_to_date',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='gross_share_of_investment_product',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='interest_accrued',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='interest_paid',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='leverage_used',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='loan_balance',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='loan_balance_with_unpaid_interest',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='loan_commitment',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='loan_drawn',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='loan_repayment',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='pending_distributions',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='profit_distributions',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='purchase_price',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='remaining_equity',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='return_of_capital',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='total_distributions',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='uncalled_amount',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='unpaid_interest',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundinvestor',
            name='unrealized_gain',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundorder',
            name='approved_allocation',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=18, null=True),
        ),
        migrations.AlterField(
            model_name='fundorder',
            name='requested_allocation',
            field=models.DecimalField(decimal_places=8, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundorder',
            name='requested_leverage',
            field=models.DecimalField(decimal_places=8, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundsale',
            name='requested_sale',
            field=models.DecimalField(decimal_places=8, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundsaleoffer',
            name='leverage_requested',
            field=models.DecimalField(decimal_places=8, max_digits=18),
        ),
        migrations.AlterField(
            model_name='fundsaleoffer',
            name='offer_amount',
            field=models.DecimalField(decimal_places=8, max_digits=18),
        ),
        migrations.AlterField(
            model_name='historicalinvestor',
            name='leverage_used',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
        migrations.AlterField(
            model_name='investor',
            name='leverage_used',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
    ]
