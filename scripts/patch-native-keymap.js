/**
 * Patches for native-keymap Windows CI build:
 * 1. Disable Spectre mitigation in binding.gyp
 * 2. Add MSVC compat for __builtin_frame_address in Electron headers
 */
const fs = require('fs');
const path = require('path');

// --- Patch 1: SpectreMitigation in binding.gyp ---
const bindingPath = path.join(__dirname, '..', 'node_modules', 'native-keymap', 'binding.gyp');

if (fs.existsSync(bindingPath)) {
  let content = fs.readFileSync(bindingPath, 'utf8');
  if (content.includes("'SpectreMitigation': 'Spectre'")) {
    content = content.replace(/'SpectreMitigation'\s*:\s*'Spectre'/g, "'SpectreMitigation': 'false'");
    fs.writeFileSync(bindingPath, content, 'utf8');
    console.log("Patched binding.gyp: SpectreMitigation -> 'false'");
  } else {
    console.log('binding.gyp: SpectreMitigation already patched or not found');
  }
}

// --- Patch 2: __builtin_frame_address in Electron cppgc/heap.h ---
const electronGypDir = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.electron-gyp'
);

if (!fs.existsSync(electronGypDir)) {
  console.log('.electron-gyp dir not found, skipping header patch');
  process.exit(0);
}

// Find the Electron version directory (e.g., 42.0.1)
const versionDirs = fs.readdirSync(electronGypDir)
  .filter(d => /^\d+\.\d+\.\d+/.test(d))
  .sort();

let patched = false;
for (const ver of versionDirs) {
  const heapH = path.join(electronGypDir, ver, 'include', 'node', 'cppgc', 'heap.h');
  if (!fs.existsSync(heapH)) continue;

  let header = fs.readFileSync(heapH, 'utf8');
  if (header.includes('__builtin_frame_address')) {
    const compatGuard = [
      '#ifdef _MSC_VER',
      '#  include <intrin.h>',
      'extern "C" void* _ReturnAddress(void);',
      '#  pragma intrinsic(_ReturnAddress)',
      '#  define __builtin_frame_address(x) ((void*)0)',
      '#endif',
      ''
    ].join('\n');

    header = compatGuard + header;
    fs.writeFileSync(heapH, header, 'utf8');
    console.log(`Patched ${heapH}: added MSVC __builtin_frame_address compat`);
    patched = true;
  }
}

if (!patched) {
  console.log('No __builtin_frame_address found in Electron headers (already patched or different version)');
}
