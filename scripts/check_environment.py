from pathlib import Path
import importlib
import sys


required = ["pandas", "numpy", "sklearn", "matplotlib", "pyarrow", "jupyterlab"]
optional = ["xgboost"]
missing = []

print(f"Python: {sys.version.split()[0]}")
for name in required + optional:
    try:
        module = importlib.import_module(name)
        print(f"OK  {name:<12} {getattr(module, '__version__', '')}")
    except Exception as exc:
        label = "OPTIONAL" if name in optional else "MISSING"
        print(f"{label:<8} {name} ({type(exc).__name__})")
        if name in required:
            missing.append(name)

root = Path(__file__).resolve().parents[1]
data_file = root / "data" / "raw" / "manafeth_customers.parquet"
print(f"{'OK' if data_file.exists() else 'MISSING'} data: {data_file}")

if missing or not data_file.exists():
    raise SystemExit(1)
print("\nالبيئة جاهزة للورشة.")
