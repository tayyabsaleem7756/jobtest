# Generated by Django 3.2.13 on 2022-07-04 10:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0019_merge_20220628_1412'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='application',
            options={'ordering': ('-created_at',)},
        ),
    ]
