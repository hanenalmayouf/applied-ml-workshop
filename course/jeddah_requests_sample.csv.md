## jeddah_requests_sample.csv

- الحجم: 12,000 صفًا × 8 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `request_id` | `str` | 0 | 12,000 | R000001 |
| `district` | `str` | 0 | 24 | district_19 |
| `category` | `str` | 0 | 5 | flooding |
| `hour_of_day` | `int64` | 0 | 24 | 7 |
| `day_of_week` | `str` | 0 | 7 | Tue |
| `month` | `int64` | 0 | 12 | 2 |
| `is_ramadan` | `int64` | 0 | 2 | 0 |
| `resolution_hours` | `float64` | 0 | 1,680 | 35.6 |

- أول 3 صفوف:

| request_id   | district    | category    |   hour_of_day | day_of_week   |   month |   is_ramadan |   resolution_hours |
|:-------------|:------------|:------------|--------------:|:--------------|--------:|-------------:|-------------------:|
| R000001      | district_19 | flooding    |             7 | Tue           |       2 |            0 |               35.6 |
| R000002      | district_02 | road_damage |            23 | Wed           |       7 |            0 |               95.4 |
| R000003      | district_12 | road_damage |            16 | Fri           |       1 |            0 |               19.9 |

## jubail_sensors_sample.parquet

- الحجم: 5,000 صفًا × 9 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `compressor_id` | `str` | 0 | 28 | K-021 |
| `reading_ts` | `datetime64[us]` | 0 | 2,372 | 2025-09-02 13:00:00 |
| `vibration_mm_s` | `float64` | 0 | 482 | 1.66 |
| `vibration_trend_7d` | `float64` | 0 | 817 | -0.139 |
| `bearing_temp_c` | `float64` | 0 | 413 | 73.3 |
| `temp_delta_24h` | `float64` | 0 | 154 | 2.4 |
| `discharge_pressure_bar` | `float64` | 0 | 990 | 17.99 |
| `running_hours` | `int64` | 0 | 4,796 | 4261 |
| `trip_within_72h` | `int64` | 0 | 2 | 0 |

- أول 3 صفوف:

| compressor_id   | reading_ts          |   vibration_mm_s |   vibration_trend_7d |   bearing_temp_c |   temp_delta_24h |   discharge_pressure_bar |   running_hours |   trip_within_72h |
|:----------------|:--------------------|-----------------:|---------------------:|-----------------:|-----------------:|-------------------------:|----------------:|------------------:|
| K-021           | 2025-09-02 13:00:00 |             1.66 |               -0.139 |             73.3 |              2.4 |                    17.99 |            4261 |                 0 |
| K-021           | 2025-08-07 02:00:00 |             1.24 |                0.016 |             67.8 |              4.4 |                    18.08 |           58818 |                 0 |
| K-001           | 2025-07-10 08:00:00 |             2.4  |               -0.206 |             62.5 |             -0.9 |                    17.81 |           56062 |                 0 |

## makkah_demand_sample.parquet

- الحجم: 8,000 صفًا × 6 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `property_id` | `str` | 0 | 11 | P-09 |
| `night` | `datetime64[us]` | 0 | 730 | 2024-08-22 00:00:00 |
| `occupancy_rate` | `float64` | 0 | 693 | 0.56 |
| `adr_sar` | `float64` | 0 | 1,127 | 466.0 |
| `is_ramadan` | `int64` | 0 | 2 | 0 |
| `is_hajj_window` | `int64` | 0 | 2 | 0 |

- أول 3 صفوف:

| property_id   | night               |   occupancy_rate |   adr_sar |   is_ramadan |   is_hajj_window |
|:--------------|:--------------------|-----------------:|----------:|-------------:|-----------------:|
| P-09          | 2024-08-22 00:00:00 |            0.56  |       466 |            0 |                0 |
| P-09          | 2024-04-28 00:00:00 |            0.665 |       360 |            0 |                0 |
| P-05          | 2024-04-22 00:00:00 |            0.439 |       554 |            0 |                0 |

## manafeth_customers.csv

- الحجم: 48,000 صفًا × 19 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `customer_id` | `str` | 0 | 48,000 | C000001 |
| `signup_date` | `str` | 0 | 593 | 2025-08-08 |
| `snapshot_date` | `str` | 0 | 1 | 2025-11-01 |
| `city` | `str` | 0 | 3 | Jeddah |
| `city_tier` | `int64` | 0 | 3 | 2 |
| `device` | `str` | 0 | 2 | Android |
| `payment_method` | `str` | 0 | 4 | mada |
| `tenure_months` | `float64` | 0 | 593 | 2.8 |
| `orders_per_month` | `float64` | 0 | 1,293 | 2.51 |
| `avg_basket_sar` | `float64` | 0 | 15,370 | 83.56 |
| `days_since_last_order` | `int64` | 0 | 121 | 12 |
| `distinct_categories` | `int64` | 0 | 16 | 7 |
| `promo_usage_rate` | `float64` | 0 | 858 | 0.322 |
| `avg_rating` | `float64` | 14,859 | 246 | 3.86 |
| `last_promo_used` | `str` | 10,560 | 5 | WKND20 |
| `churned_30d` | `int64` | 0 | 2 | 0 |
| `refund_issued` | `int64` | 0 | 2 | 0 |
| `support_ticket_after_snapshot` | `int64` | 0 | 2 | 0 |
| `next_month_orders` | `int64` | 0 | 32 | 5 |

- أول 3 صفوف:

| customer_id   | signup_date   | snapshot_date   | city   |   city_tier | device   | payment_method   |   tenure_months |   orders_per_month |   avg_basket_sar |   days_since_last_order |   distinct_categories |   promo_usage_rate |   avg_rating | last_promo_used   |   churned_30d |   refund_issued |   support_ticket_after_snapshot |   next_month_orders |
|:--------------|:--------------|:----------------|:-------|------------:|:---------|:-----------------|----------------:|-------------------:|-----------------:|------------------------:|----------------------:|-------------------:|-------------:|:------------------|--------------:|----------------:|--------------------------------:|--------------------:|
| C000001       | 2025-08-08    | 2025-11-01      | Jeddah |           2 | Android  | mada             |             2.8 |               2.51 |            83.56 |                      12 |                     7 |              0.322 |       nan    | WKND20            |             0 |               0 |                               0 |                   5 |
| C000002       | 2022-08-11    | 2025-11-01      | Riyadh |           1 | Android  | mada             |            38.7 |               1.58 |           165.64 |                       4 |                     6 |              0.114 |         3.86 | nan               |             0 |               0 |                               0 |                   0 |
| C000003       | 2024-08-20    | 2025-11-01      | Dammam |           3 | iOS      | apple_pay        |            14.4 |               4.21 |           149.29 |                      21 |                     5 |              0.194 |         4.01 | WELCOME10         |             0 |               0 |                               0 |                   4 |

## manafeth_customers.parquet

- الحجم: 48,000 صفًا × 19 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `customer_id` | `str` | 0 | 48,000 | C000001 |
| `signup_date` | `datetime64[us]` | 0 | 593 | 2025-08-08 00:00:00 |
| `snapshot_date` | `datetime64[us]` | 0 | 1 | 2025-11-01 00:00:00 |
| `city` | `str` | 0 | 3 | Jeddah |
| `city_tier` | `int64` | 0 | 3 | 2 |
| `device` | `str` | 0 | 2 | Android |
| `payment_method` | `str` | 0 | 4 | mada |
| `tenure_months` | `float64` | 0 | 593 | 2.8 |
| `orders_per_month` | `float64` | 0 | 1,293 | 2.51 |
| `avg_basket_sar` | `float64` | 0 | 15,370 | 83.56 |
| `days_since_last_order` | `int64` | 0 | 121 | 12 |
| `distinct_categories` | `int64` | 0 | 16 | 7 |
| `promo_usage_rate` | `float64` | 0 | 858 | 0.322 |
| `avg_rating` | `float64` | 14,859 | 246 | 3.86 |
| `last_promo_used` | `str` | 10,560 | 5 | WKND20 |
| `churned_30d` | `int64` | 0 | 2 | 0 |
| `refund_issued` | `int64` | 0 | 2 | 0 |
| `support_ticket_after_snapshot` | `int64` | 0 | 2 | 0 |
| `next_month_orders` | `int64` | 0 | 32 | 5 |

- أول 3 صفوف:

| customer_id   | signup_date         | snapshot_date       | city   |   city_tier | device   | payment_method   |   tenure_months |   orders_per_month |   avg_basket_sar |   days_since_last_order |   distinct_categories |   promo_usage_rate |   avg_rating | last_promo_used   |   churned_30d |   refund_issued |   support_ticket_after_snapshot |   next_month_orders |
|:--------------|:--------------------|:--------------------|:-------|------------:|:---------|:-----------------|----------------:|-------------------:|-----------------:|------------------------:|----------------------:|-------------------:|-------------:|:------------------|--------------:|----------------:|--------------------------------:|--------------------:|
| C000001       | 2025-08-08 00:00:00 | 2025-11-01 00:00:00 | Jeddah |           2 | Android  | mada             |             2.8 |               2.51 |            83.56 |                      12 |                     7 |              0.322 |       nan    | WKND20            |             0 |               0 |                               0 |                   5 |
| C000002       | 2022-08-11 00:00:00 | 2025-11-01 00:00:00 | Riyadh |           1 | Android  | mada             |            38.7 |               1.58 |           165.64 |                       4 |                     6 |              0.114 |         3.86 | nan               |             0 |               0 |                               0 |                   0 |
| C000003       | 2024-08-20 00:00:00 | 2025-11-01 00:00:00 | Dammam |           3 | iOS      | apple_pay        |            14.4 |               4.21 |           149.29 |                      21 |                     5 |              0.194 |         4.01 | WELCOME10         |             0 |               0 |                               0 |                   4 |

## manafeth_orders.csv

- الحجم: 610,000 صفًا × 11 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `order_id` | `str` | 0 | 610,000 | O0000001 |
| `customer_id` | `str` | 0 | 45,649 | C002388 |
| `order_ts` | `str` | 0 | 351,961 | 2024-05-02 00:04:00 |
| `basket_sar` | `float64` | 0 | 38,084 | 222.46 |
| `items_count` | `int64` | 0 | 58 | 4 |
| `top_category` | `str` | 0 | 10 | snacks |
| `delivery_slot` | `str` | 0 | 3 | scheduled |
| `payment_method` | `str` | 0 | 4 | credit_card |
| `promo_code` | `str` | 452,057 | 5 | WELCOME10 |
| `delivery_city` | `str` | 0 | 3 | Riyadh |
| `order_rating` | `float64` | 335,413 | 5 | 5.0 |

- أول 3 صفوف:

| order_id   | customer_id   | order_ts            |   basket_sar |   items_count | top_category   | delivery_slot   | payment_method   | promo_code   | delivery_city   |   order_rating |
|:-----------|:--------------|:--------------------|-------------:|--------------:|:---------------|:----------------|:-----------------|:-------------|:----------------|---------------:|
| O0000001   | C002388       | 2024-05-02 00:04:00 |       222.46 |             4 | snacks         | scheduled       | credit_card      | WELCOME10    | Riyadh          |            nan |
| O0000002   | C033259       | 2024-05-02 00:05:00 |        23.24 |             1 | fresh_produce  | same_day        | apple_pay        | nan          | Riyadh          |            nan |
| O0000003   | C004646       | 2024-05-02 00:11:00 |       157.84 |             5 | fresh_produce  | same_day        | apple_pay        | nan          | Dammam          |            nan |

## manafeth_orders.parquet

- الحجم: 610,000 صفًا × 11 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `order_id` | `str` | 0 | 610,000 | O0000001 |
| `customer_id` | `str` | 0 | 45,649 | C002388 |
| `order_ts` | `datetime64[us]` | 0 | 351,961 | 2024-05-02 00:04:00 |
| `basket_sar` | `float64` | 0 | 38,084 | 222.46 |
| `items_count` | `int64` | 0 | 58 | 4 |
| `top_category` | `str` | 0 | 10 | snacks |
| `delivery_slot` | `str` | 0 | 3 | scheduled |
| `payment_method` | `str` | 0 | 4 | credit_card |
| `promo_code` | `str` | 452,057 | 5 | WELCOME10 |
| `delivery_city` | `str` | 0 | 3 | Riyadh |
| `order_rating` | `float64` | 335,413 | 5 | 5.0 |

- أول 3 صفوف:

| order_id   | customer_id   | order_ts            |   basket_sar |   items_count | top_category   | delivery_slot   | payment_method   | promo_code   | delivery_city   |   order_rating |
|:-----------|:--------------|:--------------------|-------------:|--------------:|:---------------|:----------------|:-----------------|:-------------|:----------------|---------------:|
| O0000001   | C002388       | 2024-05-02 00:04:00 |       222.46 |             4 | snacks         | scheduled       | credit_card      | WELCOME10    | Riyadh          |            nan |
| O0000002   | C033259       | 2024-05-02 00:05:00 |        23.24 |             1 | fresh_produce  | same_day        | apple_pay        | nan          | Riyadh          |            nan |
| O0000003   | C004646       | 2024-05-02 00:11:00 |       157.84 |             5 | fresh_produce  | same_day        | apple_pay        | nan          | Dammam          |            nan |

## markabat_listings_sample.csv

- الحجم: 2,000 صفًا × 10 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `listing_id` | `str` | 0 | 2,000 | L00001 |
| `make` | `str` | 0 | 10 | Hyundai |
| `model_year` | `int64` | 0 | 18 | 2017 |
| `mileage_km` | `int64` | 0 | 1,564 | 172300 |
| `city` | `str` | 0 | 5 | Riyadh |
| `condition_grade` | `str` | 0 | 3 | good |
| `photos_count` | `int64` | 0 | 22 | 18 |
| `days_on_platform` | `int64` | 0 | 90 | 73 |
| `listed_month` | `str` | 0 | 22 | 2024-05 |
| `sale_price_sar` | `int64` | 0 | 790 | 37800 |

- أول 3 صفوف:

| listing_id   | make    |   model_year |   mileage_km | city   | condition_grade   |   photos_count |   days_on_platform | listed_month   |   sale_price_sar |
|:-------------|:--------|-------------:|-------------:|:-------|:------------------|---------------:|-------------------:|:---------------|-----------------:|
| L00001       | Hyundai |         2017 |       172300 | Riyadh | good              |             18 |                 73 | 2024-05        |            37800 |
| L00002       | Nissan  |         2021 |       109700 | Makkah | good              |             22 |                 67 | 2024-10        |            39300 |
| L00003       | Nissan  |         2025 |          500 | Jeddah | good              |             14 |                 53 | 2024-03        |            74800 |

## shifted_month.parquet

- الحجم: 9,000 صفًا × 15 عمودًا
- الأعمدة والأنواع والقيم الناقصة:

| العمود | النوع | القيم الناقصة | القيم المميزة | مثال |
|---|---|---:|---:|---|
| `customer_id` | `str` | 0 | 9,000 | C032772 |
| `signup_date` | `datetime64[us]` | 0 | 526 | 2023-09-20 00:00:00 |
| `snapshot_date` | `datetime64[us]` | 0 | 1 | 2025-12-01 00:00:00 |
| `city` | `str` | 0 | 3 | Riyadh |
| `city_tier` | `int64` | 0 | 3 | 1 |
| `device` | `str` | 0 | 2 | Android |
| `payment_method` | `str` | 0 | 4 | apple_pay |
| `tenure_months` | `float64` | 0 | 526 | 25.4 |
| `orders_per_month` | `float64` | 0 | 837 | 3.53 |
| `avg_basket_sar` | `float64` | 0 | 6,564 | 57.72 |
| `days_since_last_order` | `int64` | 0 | 124 | 35 |
| `distinct_categories` | `int64` | 0 | 14 | 7 |
| `promo_usage_rate` | `float64` | 0 | 760 | 0.104 |
| `avg_rating` | `float64` | 2,782 | 226 | 5.0 |
| `last_promo_used` | `str` | 1,899 | 5 | WELCOME10 |

- أول 3 صفوف:

| customer_id   | signup_date         | snapshot_date       | city   |   city_tier | device   | payment_method   |   tenure_months |   orders_per_month |   avg_basket_sar |   days_since_last_order |   distinct_categories |   promo_usage_rate |   avg_rating | last_promo_used   |
|:--------------|:--------------------|:--------------------|:-------|------------:|:---------|:-----------------|----------------:|-------------------:|-----------------:|------------------------:|----------------------:|-------------------:|-------------:|:------------------|
| C032772       | 2023-09-20 00:00:00 | 2025-12-01 00:00:00 | Riyadh |           1 | Android  | apple_pay        |            25.4 |               3.53 |            57.72 |                      35 |                     7 |              0.104 |          nan | nan               |
| C039513       | 2022-04-29 00:00:00 | 2025-12-01 00:00:00 | Dammam |           3 | Android  | mada             |            42.1 |               5.37 |           116.68 |                      10 |                     7 |              0.146 |          nan | nan               |
| C043582       | 2024-11-07 00:00:00 | 2025-12-01 00:00:00 | Riyadh |           1 | iOS      | apple_pay        |            11.8 |               2.06 |            54.5  |                      50 |                     3 |              0.318 |            5 | WELCOME10         |
