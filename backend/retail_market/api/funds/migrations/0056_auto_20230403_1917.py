# Generated by Django 3.2.16 on 2023-04-03 19:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0055_merge_20230403_1858'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fund',
            name='document_filter',
        ),
        migrations.CreateModel(
            name='DocumentFilter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('code', models.TextField(blank=True, null=True)),
                ('fund', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='document_filter', to='funds.fund')),
            ],
            options={
                'db_table': 'document_filter',
            },
        ),
    ]
