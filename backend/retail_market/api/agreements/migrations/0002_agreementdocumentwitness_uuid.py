# Generated by Django 3.2.13 on 2022-05-16 09:37

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('agreements', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='agreementdocumentwitness',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
