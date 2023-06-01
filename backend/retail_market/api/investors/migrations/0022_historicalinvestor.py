# Generated by Django 3.2.15 on 2022-08-22 13:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('investors', '0021_auto_20220427_1841'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalInvestor',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('leverage_used', models.DecimalField(decimal_places=3, default=0, max_digits=13)),
                ('name', models.CharField(max_length=120)),
                ('partner_id', models.CharField(db_index=True, max_length=250)),
                ('investor_account_code', models.CharField(db_index=True, max_length=250)),
                ('vehicle_type', models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Individual'), (2, 'Entity')], null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical investor',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
