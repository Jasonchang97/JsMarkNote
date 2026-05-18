const path = require('path')
const { execFileSync } = require('child_process')
const fs = require('fs')

exports.default = async function (context) {
  const platformName = context.electronPlatformName || ''
  if (platformName && !platformName.includes('win')) return

  const appOutDir = context.appOutDir
  const exeName = 'jsmarknote'
  const exePath = path.join(appOutDir, `${exeName}.exe`)

  if (!fs.existsSync(exePath)) {
    console.warn(`[afterPack] EXE not found at ${exePath}, skipping.`)
    return
  }

  const projectDir = context.projectDir || process.cwd()
  const iconPath = path.resolve(projectDir, 'static', 'icon.ico')

  if (!fs.existsSync(iconPath)) {
    console.warn(`[afterPack] Icon not found at ${iconPath}, skipping.`)
    return
  }

  // Find rcedit in electron-builder cache
  const cacheBase = path.join(process.env.LOCALAPPDATA || '', 'electron-builder', 'Cache', 'winCodeSign')
  let rceditPath = null

  if (fs.existsSync(cacheBase)) {
    const dirs = fs.readdirSync(cacheBase)
    for (const dir of dirs) {
      const candidate = path.join(cacheBase, dir, 'rcedit-x64.exe')
      if (fs.existsSync(candidate)) {
        rceditPath = candidate
        break
      }
    }
  }

  if (!rceditPath) {
    console.warn('[afterPack] rcedit not found in cache, skipping icon embedding.')
    return
  }

  console.log(`[afterPack] Embedding icon: ${iconPath}`)
  console.log(`[afterPack] Target EXE: ${exePath}`)
  console.log(`[afterPack] rcedit: ${rceditPath}`)
  execFileSync(rceditPath, [exePath, '--set-icon', iconPath])
  console.log('[afterPack] Icon embedded successfully.')
}
