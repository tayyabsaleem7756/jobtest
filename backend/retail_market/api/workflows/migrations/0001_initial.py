# Generated by Django 3.2.11 on 2022-01-24 11:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('admin_users', '0001_initial'),
        ('companies', '0013_alter_companyuser_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkFlow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=250)),
                ('workflow_type', models.PositiveSmallIntegerField(choices=[(1, 'Review')])),
                ('module', models.PositiveSmallIntegerField(choices=[(1, 'Eligibility'), (2, 'Indication Of Interest'), (3, 'AML/KYC')])),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_workflows', to='companies.company')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_workflows', to='admin_users.adminuser')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'Review'), (2, 'Approved'), (3, 'Changes Requested'), (4, 'Rejected')], default=1)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_tasks', to='admin_users.adminuser')),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_tasks', to='workflows.workflow')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_comments', to='admin_users.adminuser')),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_comments', to='workflows.workflow')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
