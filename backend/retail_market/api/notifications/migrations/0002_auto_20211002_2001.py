# Generated by Django 3.2.5 on 2021-10-02 20:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0004_auto_20211002_2001'),
        ('funds', '0002_fundnav'),
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usernotification',
            name='fund',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='funds.fund'),
        ),
        migrations.AlterField(
            model_name='usernotification',
            name='notification_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'New Investment'), (2, 'Capital Call'), (3, 'Purchase Offer'), (4, 'Quarterly Statement'), (5, 'Purchase Confirmation'), (6, 'Prospectus'), (7, 'Agreement'), (8, 'Interest Statement'), (9, 'Nav Statement'), (10, 'Pitch Book'), (11, 'Tax'), (12, 'Other')]),
        ),
        migrations.CreateModel(
            name='NotificationDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_notifications', to='documents.document')),
                ('notification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_documents', to='notifications.usernotification')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='usernotification',
            name='documents',
            field=models.ManyToManyField(through='notifications.NotificationDocument', to='documents.Document'),
        ),
    ]
