import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from manafeth.features import FEATURE_COLUMNS, LEAKAGE_COLUMNS, build_preprocessor


def test_leakage_columns_are_not_features():
    assert not set(FEATURE_COLUMNS).intersection(LEAKAGE_COLUMNS)


def test_pipeline_handles_missing_and_unknown_categories():
    train = pd.DataFrame(
        {
            "city_tier": [1, 2], "tenure_months": [2.0, 8.0],
            "orders_per_month": [1.0, 4.0], "avg_basket_sar": [50.0, 120.0],
            "days_since_last_order": [30, 2], "distinct_categories": [1, 4],
            "promo_usage_rate": [0.0, 0.5], "avg_rating": [None, 4.5],
            "city": ["Riyadh", "Jeddah"], "device": ["iOS", "Android"],
            "payment_method": ["mada", "cash_on_delivery"],
            "last_promo_used": [np.nan, "WELCOME"],
        }
    )
    model = Pipeline([("prep", build_preprocessor()), ("model", LogisticRegression())])
    model.fit(train, [1, 0])
    new = train.iloc[[0]].copy()
    new["city"] = "New City"
    assert model.predict_proba(new).shape == (1, 2)
