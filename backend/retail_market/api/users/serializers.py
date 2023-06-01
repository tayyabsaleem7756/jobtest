from django.contrib.auth.models import Group
from django.db.models import Q
from rest_framework import serializers

from api.admin_users.models import AdminUser
from api.companies.models import CompanyUser, Company
from api.libs.user.user_helper import UserHelper
from api.libs.utils.user_name import get_display_name
from api.notifications.models import PublishedFundUserNotification
from api.users.models import RetailUser
from api.users.services.create_user import CreateUserService


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name',)


class RetailUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailUser
        exclude = ('created_at', 'modified_at')


class RetailUserListSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    group_ids = serializers.JSONField(write_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = RetailUser
        fields = ('id', 'first_name', 'last_name', 'email', 'full_name', 'groups', 'group_ids', 'display_name')

    def update(self, instance, validated_data):
        group_ids = validated_data.pop('group_ids', [])
        if group_ids and hasattr(instance, 'admin_user'):
            groups = Group.objects.filter(id__in=group_ids)
            admin_user = instance.admin_user
            admin_user.groups.set(groups)
            admin_user.save()

        updated_instance = super().update(instance=instance, validated_data=validated_data)

        return updated_instance

    def get_groups(self, instance):
        groups = []
        if hasattr(instance, 'admin_user'):
            groups = [GroupSerializer(group).data for group in instance.admin_user.groups.all()]

        return groups

    @staticmethod
    def get_display_name(instance):
        return get_display_name(instance)


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        exclude = ('created_at', 'modified_at')


class CompanyUserSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = CompanyUser
        exclude = ('created_at', 'modified_at')


class RetailUserInfoSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    company_users = serializers.SerializerMethodField()

    class Meta:
        model = RetailUser
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_display_name(obj: RetailUser):
        return get_display_name(user=obj)

    @staticmethod
    def get_company_users(obj: RetailUser):
        companyUsers = CompanyUser.objects.filter(user=obj)
        if companyUsers:
            return CompanyUserSerializer(companyUsers, many=True).data
        return []


class RetailUserBaseSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = RetailUser
        fields = ('email', 'display_name')

    @staticmethod
    def get_display_name(obj: RetailUser):
        return get_display_name(user=obj)


class UserNotificationCountSerializer(serializers.ModelSerializer):
    unread_notification_count = serializers.SerializerMethodField()

    class Meta:
        model = RetailUser
        fields = ('unread_notification_count',)

    @staticmethod
    def get_unread_notification_count(obj: RetailUser):
        company_user_ids = UserHelper.get_company_user_ids(user=obj)
        investor_ids = UserHelper.get_investor_ids(company_user_ids=company_user_ids)
        return PublishedFundUserNotification.objects.filter(is_read=False).filter(
            Q(user_id__in=company_user_ids) |
            Q(investor_id__in=investor_ids)
        ).count()


class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    group_ids = serializers.JSONField(write_only=True)

    def create(self, validated_data):
        company = self.context['company']
        user_service = CreateUserService(
            payload={'email': validated_data['email']},
            company=company
        )
        created_user = user_service.create_user()
        if validated_data['first_name']:
            created_user.first_name = validated_data['first_name']

        if validated_data['last_name']:
            created_user.last_name = validated_data['last_name']

        created_user.save()
        admin_user, _ = AdminUser.objects.get_or_create(
            user=created_user,
            company=company
        )

        group_ids = validated_data.pop('group_ids', [])
        if group_ids:
            groups = Group.objects.filter(id__in=group_ids)
            admin_user.groups.set(groups)
            admin_user.save()

        return validated_data
