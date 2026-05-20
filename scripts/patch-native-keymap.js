/**
 * Patches native-keymap for Windows CI:
 * 1. binding.gyp: Disable Spectre mitigation
 * 2. src/keymapping.cc: Add MSVC compat for __builtin_frame_address (Electron 42.x)
 *
 * Approach borrowed from marktext/marktext.
 */
const fs = require('fs');
const path = require('path');

const nmDir = path.join(__dirname, '..', 'node_modules', 'native-keymap');

// --- Patch 1: SpectreMitigation in binding.gyp ---
const bindingPath = path.join(nmDir, 'binding.gyp');
if (fs.existsSync(bindingPath)) {
  let content = fs.readFileSync(bindingPath, 'utf8');
  if (content.includes("'SpectreMitigation': 'Spectre'")) {
    content = content.replace(/'SpectreMitigation'\s*:\s*'Spectre'/g, "'SpectreMitigation': 'false'");
    fs.writeFileSync(bindingPath, content, 'utf8');
    console.log("Patched binding.gyp: SpectreMitigation -> 'false'");
  } else {
    console.log('binding.gyp: SpectreMitigation already patched or not found');
  }
} else {
  console.log('binding.gyp not found, skipping SpectreMitigation patch');
}

// --- Patch 2: MSVC __builtin_frame_address compat in keymapping.cc ---
const keymappingPath = path.join(nmDir, 'src', 'keymapping.cc');
if (fs.existsSync(keymappingPath)) {
  let src = fs.readFileSync(keymappingPath, 'utf8');
  if (src.includes('__builtin_frame_address')) {
    console.log('keymapping.cc: __builtin_frame_address compat already present');
  } else {
    // Insert MSVC compat defines before #include <node.h>
    const msvcCompat = [
      '#ifdef _MSC_VER',
      '#include <intrin.h>',
      '#define __builtin_frame_address(x) (_AddressOfReturnAddress())',
      '#endif',
      ''
    ].join('\n');

    src = src.replace('#include <node.h>', msvcCompat + '#include <node.h>');
    fs.writeFileSync(keymappingPath, src, 'utf8');
    console.log('Patched keymapping.cc: added MSVC __builtin_frame_address compat');
  }
} else {
  console.log('keymapping.cc not found, skipping source patch');
}

console.log('Done');
