import datetime


def get_date_after_n_working_days(start_date, add_days):
    business_days_to_add = add_days
    current_date = start_date
    while business_days_to_add > 0:
        current_date += datetime.timedelta(days=1)
        weekday = current_date.weekday()
        if weekday >= 5:
            continue
        business_days_to_add -= 1
    return current_date
