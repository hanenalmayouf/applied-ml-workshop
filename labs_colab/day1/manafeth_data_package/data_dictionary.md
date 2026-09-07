# Manafeth Data Dictionary — SDA-AIE-111 (Applied Machine Learning Foundations)

**Snapshot date:** 2025-11-01 · **Unit of analysis:** one row = one customer at the monthly snapshot · **Seed:** 42
**Target:** `churned_30d` = no completed order in the 30 days following the snapshot date (14.0% positive).

Used in Lab 1 for the leakage exercise ("Leak or feature?" — apply the timestamp test: *would this value exist at prediction time?*) and for completing the framing canvas.

## `manafeth_customers` — 48,000 rows × 19 columns

| # | Column | Type | Description | Prediction-time? |
|---|---|---|---|---|
| 1 | `customer_id` | string | Unique customer identifier (never a feature — IDs are leakage vectors) | ✔ (but excluded) |
| 2 | `signup_date` | date | Account creation date | ✔ |
| 3 | `snapshot_date` | date | Observation date (2025-11-01 for all rows) | ✔ |
| 4 | `city` | categorical (3) | Riyadh / Jeddah / Dammam | ✔ |
| 5 | `city_tier` | ordinal (1–3) | Market-tier encoding of city (order is real) | ✔ |
| 6 | `device` | categorical (2) | iOS / Android | ✔ |
| 7 | `payment_method` | categorical (4) | mada / credit_card / apple_pay / cash_on_delivery | ✔ |
| 8 | `tenure_months` | float | Months since signup at snapshot | ✔ |
| 9 | `orders_per_month` | float | Average monthly order frequency to date | ✔ |
| 10 | `avg_basket_sar` | float | Average basket value (SAR), long right tail (bulk orders) | ✔ |
| 11 | `days_since_last_order` | int | Recency at snapshot — the CRM 21-day heuristic ranks on this | ✔ |
| 12 | `distinct_categories` | int | Distinct product categories ever purchased | ✔ |
| 13 | `promo_usage_rate` | float 0–1 | Share of orders using a promo code | ✔ |
| 14 | `avg_rating` | float 1–5 | Average order rating — **31% missing, overwhelmingly new customers** (missingness is signal: use `add_indicator=True`) | ✔ |
| 15 | `last_promo_used` | categorical (5) | Last promo code redeemed — 22% missing ("never used" — absence is information) | ✔ |
| 16 | `churned_30d` | int 0/1 | **TARGET** — no completed order in (snapshot, snapshot+30d] | — |
| 17 | `refund_issued` | int 0/1 | **PLANTED LEAK** — refunds mostly happen *after* the churn decision | ✘ |
| 18 | `support_ticket_after_snapshot` | int 0/1 | **PLANTED LEAK** — the name confesses; recorded post-snapshot | ✘ |
| 19 | `next_month_orders` | int | **PLANTED LEAK** — "looks like a feature"; it *is* the target in disguise (0 for churners by construction) | ✘ |

Roughly half of each cohort misses `next_month_orders` on first pass — it is the heart of Lab 1.

## `manafeth_orders` — 610,000 rows × 11 columns

Order-level companion table. All Module 3 aggregates (`orders_90d`, `basket_trend`, `days_to_ramadan`, `ramadan_order_share`, `weekend_order_share`, RFM) are engineered from this table **using only orders strictly before the snapshot date** — an aggregate over all orders summarises the future.

| # | Column | Type | Description |
|---|---|---|---|
| 1 | `order_id` | string | Unique order identifier |
| 2 | `customer_id` | string | Join key to `manafeth_customers` |
| 3 | `order_ts` | timestamp | Order placement time. Ramadan seasonality is real: in-window daily volume ≈ 2× baseline, concentrated post-Iftar (19:00–02:59). Weekend = **Fri/Sat** (KSA — a locale bug in every imported code sample) |
| 4 | `basket_sar` | float | Order value (SAR) |
| 5 | `items_count` | int | Items in the order |
| 6 | `top_category` | categorical (10) | Dominant product category |
| 7 | `delivery_slot` | categorical (3) | express_30min / same_day / scheduled |
| 8 | `payment_method` | categorical (4) | Payment used on this order |
| 9 | `promo_code` | categorical (5) | Promo code applied (null = none) |
| 10 | `delivery_city` | categorical (3) | Delivery city |
| 11 | `order_rating` | float 1–5 | Post-delivery rating (~55% unrated) |

## Companion files

| File | Rows | Purpose |
|---|---|---|
| `shifted_month.parquet` | 9,000 | Manafeth scored one month later (2025-12-01) — Module 4 threshold-drift simulation (contact rate silently rises) |
| `markabat_listings_sample.csv` | 2,000 | Module 2 case study — used-car price regression (log target, temporal drift) |
| `jeddah_requests_sample.csv` | 12,000 | Module 6 case study — municipal service-request clustering (district-aggregated) |
| `jubail_sensors_sample.parquet` | 5,000 | Module 5 case study — compressor trip prediction (severe imbalance, grouped structure) |
| `makkah_demand_sample.parquet` | 8,000 | Module 7 case study — hotel demand with Ramadan/Hajj regimes (tuning under a compute window) |
| `validation_report.txt` | — | Regeneration checks: churn 14.0%, split 38,400/9,600, heuristic ≈ 0.42, honest logistic ≈ 0.48 PR-AUC, leak inflation demonstrated, shuffled-label ≈ 0.14–0.20 |

## Regeneration

```bash
python generate_manafeth.py      # seed 42; writes ./data
python validate_data.py          # re-runs the sanity workflow
```

CSV + parquet mirrors are provided for both golden-thread tables. **Never open the course CSVs in Excel** (mangled encodings/dtypes) — use the parquet mirrors. Exact benchmark values (e.g., PR-AUC to three decimals) depend on pinned library versions; verify the seven solution notebooks after any dependency change, per the instructor preparation checklist.
