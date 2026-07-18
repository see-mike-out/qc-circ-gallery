import * as fs from "fs";

async function import_backup() {
  // file copy and paste
  const TARGET_PATHS = ['static/data-save', 'static/qc-images'];
  const ORIGIN_PATHS = ['../qc-circuit-vis-space-backup/data-save', '../qc-circuit-vis-space-backup/qc-images'];
  for (const i in ORIGIN_PATHS) {
    const SRC = ORIGIN_PATHS[i], TAR = TARGET_PATHS[i];
    console.log(SRC, TAR)
    fs.cpSync(SRC, TAR, { recursive: true });
  }
}

import_backup();