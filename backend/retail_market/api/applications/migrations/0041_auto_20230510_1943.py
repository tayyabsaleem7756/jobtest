# Generated by Django 3.2.18 on 2023-05-10 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0040_applicationcompanydocument_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='userapplicationstate',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterUniqueTogether(
            name='userapplicationstate',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='userapplicationstate',
            constraint=models.UniqueConstraint(condition=models.Q(('deleted', False)), fields=('user', 'fund'), name='unique_user_fund_validation'),
        ),
    ]
