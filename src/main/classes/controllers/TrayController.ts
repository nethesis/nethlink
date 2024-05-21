import { Menu, MenuItem, MenuItemConstructorOptions, Tray, app, nativeImage, nativeTheme } from 'electron'
import path, { join } from 'path'
import { AccountController } from './AccountController'
import { LoginController } from './LoginController'
import { NethLinkController } from './NethLinkController'
import { SplashScreenController } from './SplashScreenController'
import { PhoneIslandController } from './PhoneIslandController'
import { AppController } from './AppController'
import { log } from '@shared/utils/logger'

export class TrayController {
  tray: Tray
  enableClick = false

  static instance: TrayController
  constructor() {
    TrayController.instance = this
    const theme = nativeTheme.shouldUseDarkColors
      ? 'dark'
      : 'light'
    log(theme)
    const image = this.getImage(theme)
    log(image)
    this.tray = new Tray(image)
    this.tray.setIgnoreDoubleClickEvents(true)
    this.tray.on('click', () => {
      if (this.enableClick) {
        if (LoginController.instance.window?.isOpen()) LoginController.instance.hide()
        else if (NethLinkController.instance.window.isOpen()) NethLinkController.instance.hide()
        else if (AccountController.instance.getLoggedAccount()) NethLinkController.instance.show()
        else LoginController.instance.show()
      }
    })
    const menu: (MenuItemConstructorOptions | MenuItem)[] = [
      {
        role: 'close',
        //accelerator: 'Command+Q',
        commandId: 1,
        click: () => {
          //TODO: trovare un modo per killare l'app
          AppController.safeQuit()
        }
      }
    ]
    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu(Menu.buildFromTemplate(menu))
    })


  }

  getImage(theme: 'light' | 'dark') {
    let pathImage = '../../public/TrayToolbarIconWhite.png'
    if (process.platform !== 'linux') {
      pathImage = theme === 'light' ? '../../public/TrayToolbarIconBlack.png' : '../../public/TrayToolbarIconWhite.png'
    }
    const image = nativeImage.createFromPath(
      path.join(__dirname, pathImage)
    )
    image.resize({ height: 18, width: 18 });
    return image
  }


  changeIconByTheme(theme: 'light' | 'dark') {
    const image = this.getImage(theme)
    log(image)
    this.tray.setImage(image)
  }

}
