# Generated by Django 3.2.5 on 2021-11-24 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0016_auto_20211124_0807'),
    ]

    operations = [
        migrations.AddField(
            model_name='loanactivity',
            name='loan_drawn',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='loanactivity',
            name='loan_repayment',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
