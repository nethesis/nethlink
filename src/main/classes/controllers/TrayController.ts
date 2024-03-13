import { Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron'
import { join } from 'path'
import { AccountController } from './AccountController'
import { LoginController } from './LoginController'
import { NethLinkController } from './NethLinkController'

export class TrayController {
  tray: Tray

  static instance: TrayController
  constructor() {
    this.tray = new Tray(join(__dirname, '../../public/TrayLogo.png'))
    this.tray.setIgnoreDoubleClickEvents(true)
    this.tray.on('click', this.onTrayIconClick)
    const menu: (MenuItemConstructorOptions | MenuItem)[] = [
      {
        role: 'quit',
        //accelerator: 'Command+Q',
        commandId: 1
      }
    ]
    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu(Menu.buildFromTemplate(menu))
    })
    TrayController.instance = this
  }

  private onTrayIconClick() {
    if (LoginController.instance.window?.isOpen()) LoginController.instance.hide()
    else if (NethLinkController.instance.window.isOpen()) NethLinkController.instance.hide()
    else if (AccountController.instance.getLoggedAccount()) NethLinkController.instance.show()
    else LoginController.instance.show()
  }
}
