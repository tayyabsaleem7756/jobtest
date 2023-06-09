# Generated by Django 3.2.16 on 2023-03-08 13:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0008_auto_20220812_1904'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('street1', models.CharField(max_length=100)),
                ('street2', models.CharField(blank=True, max_length=100, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=50, null=True)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='address_countries', to='geographics.country')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='address_states', to='geographics.usstate')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
