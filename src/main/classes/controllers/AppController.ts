import { Account } from "@shared/types"
import { AccountController } from "./AccountController"
import { LoginController } from "./LoginController"
import { NethLinkController } from "./NethLinkController"
import { PhoneIslandController } from "./PhoneIslandController"
import { SplashScreenController } from "./SplashScreenController"
import { TrayController } from "./TrayController"
import { log } from "@shared/utils/logger"
import { DevToolsController } from "./DevToolsController"
import { store } from "@/lib/mainStore"
import { isDev } from "@shared/utils/utils"

export class AppController {
  static _app: Electron.App
  static onQuit = false
  constructor(app: Electron.App) {
    AppController._app = app
  }


  static async safeQuit() {
    if (!AppController.onQuit) {
      AppController.onQuit = true
      log('SAFE QUIT')
      if (PhoneIslandController.instance) {
        try {
          await PhoneIslandController.instance.logout()
        } catch (e) {
          log(e)
        }
      }
      if (NethLinkController.instance) {
        try {
          NethLinkController.instance.logout()
        } catch (e) {
          log(e)
        }
      }
      try {
        TrayController.instance.tray.destroy()
      } catch (e) {
        log(e)
      }
      setTimeout(async () => {
        try {
          DevToolsController.instance?.window?.quit()
        } catch (e) {
          log(e)
        }
        store.saveToDisk()
        AppController._app.exit()
      }, 1500)
    }
  }
}
