#!/usr/bin/env node
// build-fact-lessons.js
// Reads fact-lesson-template.html + fact-lesson-config.json
// Generates one lesson HTML file per config entry
// Run: node build-fact-lessons.js

const fs = require('fs');

const template = fs.readFileSync('fact-lesson-template.html', 'utf8');
const config   = JSON.parse(fs.readFileSync('fact-lesson-config.json', 'utf8'));

// Chart href by type (storage keys and chart IDs now come from config per-item)
const META = {
  add:  { chartHref: 'chart.html' },
  mult: { chartHref: 'chart.html' },
};

// Build a human-readable label from the family data
function makeLabel(item) {
  if (item.type === 'add') {
    return `${item.famA[0]} · ${item.famA[1]} · ${item.famA[2]}  and  ${item.famB[0]} · ${item.famB[1]} · ${item.famB[2]}`;
  }
  return `\u00d7${item.famA} and \u00d7${item.famB}`;
}

config.forEach(item => {
  const meta   = META[item.type];
  const label  = makeLabel(item);
  const famAJs = JSON.stringify(item.famA);
  const famBJs = JSON.stringify(item.famB);

  const output = template
    .replaceAll('%%FACT_TYPE%%',   item.type)
    .replaceAll('%%LABEL%%',       label)
    .replaceAll('%%FAM_A%%',       famAJs)
    .replaceAll('%%FAM_B%%',       famBJs)
    .replaceAll('%%STORAGE_KEY%%', item.storageKey)
    .replaceAll('%%CHART_ID%%',    item.chartId)
    .replaceAll('%%CHART_HREF%%',  meta.chartHref)
    .replaceAll('%%NEXT_HREF%%',   item.nextHref);

  fs.writeFileSync(item.output, output, 'utf8');
  console.log(`✓  ${item.output}  (${label})`);
});

console.log(`\nDone — ${config.length} lesson files generated.`);
