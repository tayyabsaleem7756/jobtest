# Generated by Django 3.2.15 on 2022-10-12 07:38

import api.libs.utils.nanoid_generator
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0039_auto_20221003_0932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fund',
            name='external_id',
            field=models.CharField(db_index=True, default=api.libs.utils.nanoid_generator.generate_nanoid, max_length=14, unique=True),
        ),
    ]
