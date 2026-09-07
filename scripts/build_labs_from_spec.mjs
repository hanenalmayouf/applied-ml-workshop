import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const specPath = path.join(root, "course", "MANAFETH_DAILY_LABS_SPEC_AR.md");
const source = fs.readFileSync(specPath, "utf8");

const filenames = [
  "labs/day1/lab_1_manafeth_leakage.ipynb",
  "labs/day2/lab_2_manafeth_preprocessing.ipynb",
  "labs/day3/lab_3_manafeth_models.ipynb",
  "labs/day4/lab_4_manafeth_evaluation.ipynb",
  "labs/day5/final_project_manafeth_churn.ipynb",
];

const headingMatches = [...source.matchAll(/^# مختبر اليوم (الأول|الثاني|الثالث|الرابع|الخامس) — (.+)$/gm)];
if (headingMatches.length !== 5) throw new Error(`Expected five labs, found ${headingMatches.length}`);

const setup = `from pathlib import Path\n\n# يعمل محليًا داخل المستودع أو عند وضع الحزمة في مجلد مستقل\nDATA_CANDIDATES = [Path("manafeth_data_package"), Path("data/raw"), Path("../../data/raw")]\nDATA_DIR = next((p for p in DATA_CANDIDATES if p.exists()), DATA_CANDIDATES[0])\nCUSTOMERS_PATH = DATA_DIR / "manafeth_customers.parquet"\nORDERS_PATH = DATA_DIR / "manafeth_orders.parquet"\nVEHICLES_PATH = DATA_DIR / "markabat_listings_sample.csv"\nSHIFTED_PATH = DATA_DIR / "shifted_month.parquet"\nprint("DATA_DIR:", DATA_DIR.resolve())`;

function lines(text) {
  const value = text.endsWith("\n") ? text : `${text}\n`;
  return value.split(/(?<=\n)/);
}

function cellsFromMarkdown(block) {
  const cells = [];
  const pattern = /```(?:python)?\n([\s\S]*?)```/g;
  let cursor = 0;
  for (const match of block.matchAll(pattern)) {
    const before = block.slice(cursor, match.index).trim();
    if (before) cells.push({ cell_type: "markdown", metadata: {}, source: lines(before) });
    cells.push({ cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: lines(match[1].trim()) });
    cursor = match.index + match[0].length;
  }
  const after = block.slice(cursor).trim();
  if (after) cells.push({ cell_type: "markdown", metadata: {}, source: lines(after) });
  return cells;
}

for (let index = 0; index < headingMatches.length; index++) {
  const match = headingMatches[index];
  const end = headingMatches[index + 1]?.index ?? source.indexOf("\n## المراجع", match.index);
  const body = source.slice(match.index + match[0].length, end > 0 ? end : source.length).trim();
  const title = `# ${match[0].slice(2)}\n\n> هذا الدفتر مبني مباشرة من مواصفات مختبرات منافذ المعتمدة للدورة.`;
  const notebook = {
    cells: [
      { cell_type: "markdown", metadata: {}, source: lines(title) },
      { cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: lines(setup) },
      ...cellsFromMarkdown(body),
    ],
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python", version: "3" },
      colab: { name: path.basename(filenames[index]), provenance: [] },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
  const output = path.join(root, filenames[index]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(notebook, null, 2)}\n`);
}

console.log(`Built ${filenames.length} Manafeth lab notebooks from the approved specification.`);
