from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


TARGET = "churned_30d"
LEAKAGE_COLUMNS = [
    "customer_id",
    "refund_issued",
    "support_ticket_after_snapshot",
    "next_month_orders",
]
NUMERIC_COLUMNS = [
    "city_tier",
    "tenure_months",
    "orders_per_month",
    "avg_basket_sar",
    "days_since_last_order",
    "distinct_categories",
    "promo_usage_rate",
    "avg_rating",
]
CATEGORICAL_COLUMNS = ["city", "device", "payment_method", "last_promo_used"]
FEATURE_COLUMNS = NUMERIC_COLUMNS + CATEGORICAL_COLUMNS


def build_preprocessor(scale_numeric: bool = True) -> ColumnTransformer:
    """Return one preprocessing definition shared by training and inference."""
    numeric_steps = [
        ("impute", SimpleImputer(strategy="median", add_indicator=True)),
    ]
    if scale_numeric:
        numeric_steps.append(("scale", StandardScaler()))

    numeric = Pipeline(numeric_steps)
    categorical = Pipeline(
        [
            ("impute", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        [("num", numeric, NUMERIC_COLUMNS), ("cat", categorical, CATEGORICAL_COLUMNS)]
    )


def make_customer_aggregates(
    orders: pd.DataFrame, snapshot_date: str | pd.Timestamp
) -> pd.DataFrame:
    """Create temporal-safe order features using events before the snapshot only."""
    snapshot = pd.Timestamp(snapshot_date)
    frame = orders.copy()
    frame["order_ts"] = pd.to_datetime(frame["order_ts"])
    frame = frame.loc[frame["order_ts"] < snapshot].copy()
    frame["days_before_snapshot"] = (snapshot - frame["order_ts"]).dt.days
    recent = frame.loc[frame["days_before_snapshot"] <= 90]

    result = recent.groupby("customer_id").agg(
        orders_90d=("order_id", "count"),
        avg_basket_90d=("basket_sar", "mean"),
        active_days_90d=("order_ts", lambda x: x.dt.date.nunique()),
    )
    result["log_orders_90d"] = np.log1p(result["orders_90d"])
    return result.reset_index()
