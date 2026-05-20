/**
 * Patches native-keymap's binding.gyp to disable Spectre mitigation,
 * which requires VS Spectre-mitigated libraries not available on CI runners.
 */
const fs = require('fs');
const path = require('path');

const bindingPath = path.join(__dirname, '..', 'node_modules', 'native-keymap', 'binding.gyp');

if (!fs.existsSync(bindingPath)) {
  console.log('native-keymap binding.gyp not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(bindingPath, 'utf8');

if (!content.includes('SpectreMitigation')) {
  console.log('No SpectreMitigation found, patch not needed');
  process.exit(0);
}

content = content.replace(/'SpectreMitigation'\s*:\s*'Spectre'/g, "'SpectreMitigation': 'false'");
fs.writeFileSync(bindingPath, content, 'utf8');

// Verify the patch
const verify = fs.readFileSync(bindingPath, 'utf8');
if (verify.includes("'SpectreMitigation': 'false'")) {
  console.log("Patched SpectreMitigation -> 'false' successfully");
} else if (verify.includes('SpectreMitigation')) {
  console.error('ERROR: Patch verification failed, SpectreMitigation still present');
  process.exit(1);
} else {
  console.log('SpectreMitigation removed entirely');
}
