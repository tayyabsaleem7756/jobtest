# Generated by Django 3.2.16 on 2023-02-16 16:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0051_merge_20230131_1317'),
        ('backup', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundDocumentsBackup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('storage_key', models.CharField(max_length=120)),
                ('fund', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='document_backups', to='funds.fund')),
            ],
            options={
                'db_table': 'fund_documents_backups',
            },
        ),
        migrations.CreateModel(
            name='FundBackup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('storage_key', models.CharField(max_length=120)),
                ('fund', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='backups', to='funds.fund')),
            ],
            options={
                'db_table': 'fund_backups',
            },
        ),
    ]
