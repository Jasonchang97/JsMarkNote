import { app } from 'electron'
import { showAboutDialog } from '../actions/help'
import * as actions from '../actions/jsmarknote'
import { t } from '../../i18n'

// macOS only menu.

export default function(keybindings) {
  return {
    label: t('menu.jsmarknote.title'),
    submenu: [{
      label: t('menu.jsmarknote.about'),
      click(menuItem, focusedWindow) {
        showAboutDialog(focusedWindow)
      }
    }, {
      label: t('menu.jsmarknote.checkUpdates'),
      click(menuItem, focusedWindow) {
        actions.checkUpdates(focusedWindow)
      }
    }, {
      label: t('menu.jsmarknote.preferences'),
      accelerator: keybindings.getAccelerator('file.preferences'),
      click() {
        actions.userSetting()
      }
    }, {
      type: 'separator'
    }, {
      label: t('menu.jsmarknote.services'),
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: t('menu.jsmarknote.hide'),
      accelerator: keybindings.getAccelerator('mt.hide'),
      click() {
        actions.osxHide()
      }
    }, {
      label: t('menu.jsmarknote.hideOthers'),
      accelerator: keybindings.getAccelerator('mt.hide-others'),
      click() {
        actions.osxHideAll()
      }
    }, {
      label: t('menu.jsmarknote.showAll'),
      click() {
        actions.osxShowAll()
      }
    }, {
      type: 'separator'
    }, {
      label: t('menu.jsmarknote.quit'),
      accelerator: keybindings.getAccelerator('file.quit'),
      click: app.quit
    }]
  }
}
