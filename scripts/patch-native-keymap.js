/**
 * Patches native-keymap's binding.gyp for Windows CI:
 * 1. Disable Spectre mitigation
 * 2. Add MSVC compat for __builtin_frame_address via compiler /D flag
 */
const fs = require('fs');
const path = require('path');

const bindingPath = path.join(__dirname, '..', 'node_modules', 'native-keymap', 'binding.gyp');

if (!fs.existsSync(bindingPath)) {
  console.log('native-keymap binding.gyp not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(bindingPath, 'utf8');

// Patch 1: Disable Spectre mitigation
if (content.includes("'SpectreMitigation': 'Spectre'")) {
  content = content.replace(/'SpectreMitigation'\s*:\s*'Spectre'/g, "'SpectreMitigation': 'false'");
  console.log("Patched binding.gyp: SpectreMitigation -> 'false'");
} else {
  console.log('binding.gyp: SpectreMitigation already patched or not found');
}

// Patch 2: Add /D__builtin_frame_address(x)=((void)0) to MSVC compiler options
// This makes Electron 42.x cppgc/heap.h compile on MSVC
if (content.includes('__builtin_frame_address')) {
  console.log('binding.gyp: __builtin_frame_address define already present');
} else {
  const marker = "'/ZH:SHA_256'";
  if (content.includes(marker)) {
    content = content.replace(
      marker,
      marker + ",\n            '/D__builtin_frame_address(x)=((void)0)'"
    );
    console.log('Patched binding.gyp: added /D__builtin_frame_address compiler flag');
  } else {
    console.log('WARNING: Could not find marker in binding.gyp');
  }
}

fs.writeFileSync(bindingPath, content, 'utf8');
console.log('Done');
