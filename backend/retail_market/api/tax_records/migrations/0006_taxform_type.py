# Generated by Django 3.2.12 on 2022-03-03 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tax_records', '0005_auto_20220302_2019'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxform',
            name='type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Goverment'), (2, 'Self Certification')], default=1),
        ),
    ]
