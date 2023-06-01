def get_eligibility_criteria_name(eligibility_criteria):
    name_tags = []
    for criteria_region in eligibility_criteria.criteria_regions.select_related('region').all():
        name_tags.append(criteria_region.region.name)

    for criteria_country in eligibility_criteria.criteria_countries.select_related('country').all():
        name_tags.append(criteria_country.country.name)

    return ', '.join(name_tags)


def get_criteria_selected_region_country_codes(eligibility_criteria):
    region_codes = []
    country_codes = []
    for criteria_region in eligibility_criteria.criteria_regions.all():
        region_codes.append(f"RG|{criteria_region.region.region_code}")

    for criteria_country in eligibility_criteria.criteria_countries.all():
        country_codes.append(criteria_country.country.iso_code)

    return {
        'region_codes': region_codes,
        'country_codes': country_codes
    }
