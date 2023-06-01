# Generated by Django 3.2.5 on 2021-10-22 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0010_fundactivity_distributions_since_inception'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundactivity',
            name='gross_share_of_nav',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
