from django.db import models
from django.db.models import Q


class PublishedFundUserNotificationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Q(fund__isnull=True) | Q(fund__publish_investment_details=True))
