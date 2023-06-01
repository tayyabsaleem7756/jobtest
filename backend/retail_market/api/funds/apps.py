from django.apps import AppConfig


class FundsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.funds'

    def ready(self):
        import api.funds.signals
