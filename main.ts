// news-image-20261121 entry (Node 22, standard library only).
// The picture is the entry.png beside this file — a full newspaper front
// page for Friday 21 November 2026 — and the program copies it to
// /output/entry.png. The gate takes a whole PNG or JPEG of at most 1 MiB
// and 1024 by 1024 pixels, and the judge sees exactly the bytes copied,
// so the copy is verified below before success is reported.
//
// The run is deterministic: the same entry.png goes in, the same bytes
// come out, on the first run and on the grader's repeat run alike.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), out);

// The gate tells PNG from JPEG by first bytes and caps the file at 1 MiB,
// so check the copied bytes here: a truncated or swapped image must fail
// loudly in this run rather than score 0 at the gate.
const bytes = readFileSync(out);
const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (!isPng && !isJpeg) throw new Error('entry.png is neither PNG nor JPEG');
if (bytes.length > 1_048_576) throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
console.log(`entry.png written: ${isPng ? 'PNG' : 'JPEG'}, ${bytes.length} bytes`);
