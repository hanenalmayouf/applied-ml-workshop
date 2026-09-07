from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATA_DIR = PROJECT_ROOT / "data" / "raw"


def load_customers(data_dir: str | Path = DEFAULT_DATA_DIR) -> pd.DataFrame:
    """Load the customer snapshot, preferring parquet to preserve dtypes."""
    data_dir = Path(data_dir)
    parquet_path = data_dir / "manafeth_customers.parquet"
    csv_path = data_dir / "manafeth_customers.csv"
    if parquet_path.exists():
        return pd.read_parquet(parquet_path)
    if csv_path.exists():
        return pd.read_csv(csv_path, parse_dates=["signup_date", "snapshot_date"])
    raise FileNotFoundError(f"Customer data not found in {data_dir}")


def split_customers(df: pd.DataFrame, random_state: int = 42):
    """Create the one official stratified split used throughout the course."""
    from .features import FEATURE_COLUMNS

    X = df[FEATURE_COLUMNS].copy()
    y = df["churned_30d"].astype(int)
    return train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=random_state
    )
