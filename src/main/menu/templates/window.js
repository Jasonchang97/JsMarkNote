import { Menu } from 'electron'
import { minimizeWindow, toggleAlwaysOnTop, toggleFullScreen } from '../actions/window'
import { zoomIn, zoomOut } from '../../windows/utils'
import { isOsx } from '../../config'
import { t, setLanguage, getCurrentLanguage } from '../../i18n'

export default function(keybindings) {
  const menu = {
    label: t('menu.window.title'),
    role: 'window',
    submenu: [{
      label: t('menu.window.minimize'),
      accelerator: keybindings.getAccelerator('window.minimize'),
      click(menuItem, browserWindow) {
        minimizeWindow(browserWindow)
      }
    }, {
      id: 'alwaysOnTopMenuItem',
      label: t('menu.window.alwaysOnTop'),
      type: 'checkbox',
      accelerator: keybindings.getAccelerator('window.toggle-always-on-top'),
      click(menuItem, browserWindow) {
        toggleAlwaysOnTop(browserWindow)
      }
    }, {
      type: 'separator'
    }, {
      label: t('menu.window.zoomIn'),
      accelerator: keybindings.getAccelerator('window.zoomIn'),
      click(menuItem, browserWindow) {
        zoomIn(browserWindow)
      }
    }, {
      label: t('menu.window.zoomOut'),
      accelerator: keybindings.getAccelerator('window.zoomOut'),
      click(menuItem, browserWindow) {
        zoomOut(browserWindow)
      }
    }, {
      type: 'separator'
    }, {
      label: t('menu.edit.language'),
      submenu: [
        {
          label: t('menu.edit.languageEn'),
          type: 'radio',
          checked: getCurrentLanguage() === 'en',
          click() { setLanguage('en') }
        },
        {
          label: t('menu.edit.languageZhCN'),
          type: 'radio',
          checked: getCurrentLanguage() === 'zh-CN',
          click() { setLanguage('zh-CN') }
        },
        {
          label: t('menu.edit.languageZhTW'),
          type: 'radio',
          checked: getCurrentLanguage() === 'zh-TW',
          click() { setLanguage('zh-TW') }
        },
        {
          label: t('menu.edit.languageEs'),
          type: 'radio',
          checked: getCurrentLanguage() === 'es',
          click() { setLanguage('es') }
        },
        {
          label: t('menu.edit.languageFr'),
          type: 'radio',
          checked: getCurrentLanguage() === 'fr',
          click() { setLanguage('fr') }
        },
        {
          label: t('menu.edit.languageDe'),
          type: 'radio',
          checked: getCurrentLanguage() === 'de',
          click() { setLanguage('de') }
        },
        {
          label: t('menu.edit.languageJa'),
          type: 'radio',
          checked: getCurrentLanguage() === 'ja',
          click() { setLanguage('ja') }
        },
        {
          label: t('menu.edit.languageKo'),
          type: 'radio',
          checked: getCurrentLanguage() === 'ko',
          click() { setLanguage('ko') }
        },
        {
          label: t('menu.edit.languagePt'),
          type: 'radio',
          checked: getCurrentLanguage() === 'pt',
          click() { setLanguage('pt') }
        }
      ]
    }, {
      type: 'separator'
    }, {
      label: t('menu.window.fullScreen'),
      accelerator: keybindings.getAccelerator('window.toggle-full-screen'),
      click(item, browserWindow) {
        if (browserWindow) {
          toggleFullScreen(browserWindow)
        }
      }
    }]
  }

  if (isOsx) {
    menu.submenu.push({
      label: t('menu.window.bringAllToFront'),
      click() {
        Menu.sendActionToFirstResponder('arrangeInFront:')
      }
    })
  }
  return menu
}
