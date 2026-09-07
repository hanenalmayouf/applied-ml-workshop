from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate


def evaluate_classifier(model, X, y, folds: int = 5, random_state: int = 42):
    """Evaluate every classifier on identical folds and useful imbalance metrics."""
    cv = StratifiedKFold(n_splits=folds, shuffle=True, random_state=random_state)
    scores = cross_validate(
        model,
        X,
        y,
        cv=cv,
        scoring={"pr_auc": "average_precision", "roc_auc": "roc_auc"},
        n_jobs=-1,
    )
    return pd.Series(
        {
            "pr_auc_mean": scores["test_pr_auc"].mean(),
            "pr_auc_std": scores["test_pr_auc"].std(),
            "roc_auc_mean": scores["test_roc_auc"].mean(),
            "fit_seconds": scores["fit_time"].sum(),
        }
    )


def recall_at_fraction(y_true, probabilities, fraction: float = 0.20):
    """Recall when the business can contact only the top fraction of customers."""
    y_true = np.asarray(y_true)
    probabilities = np.asarray(probabilities)
    count = max(1, int(np.ceil(len(y_true) * fraction)))
    selected = np.argsort(probabilities)[::-1][:count]
    positives = y_true.sum()
    return float(y_true[selected].sum() / positives) if positives else 0.0


def threshold_for_fraction(probabilities, fraction: float = 0.20):
    """Return the score threshold that selects approximately a fixed fraction."""
    return float(np.quantile(np.asarray(probabilities), 1 - fraction))
