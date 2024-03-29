import { IPC_EVENTS } from '@shared/constants'
import { LoginWindow } from '../windows'
import { AccountController } from './AccountController'

export class LoginController {
  static instance: LoginController

  window: LoginWindow

  constructor() {
    LoginController.instance = this
    this.window = new LoginWindow()
  }

  resize(h: number) {
    const loginPage = this.window!.getWindow()
    if (loginPage) {
      const bounds = loginPage.getBounds()
      loginPage.setBounds({ ...bounds, width: 500, height: h }, true)
      loginPage.center()
    }
  }
  show() {
    const availableAccounts = AccountController.instance.listAvailableAccounts()
    this.window.emit(IPC_EVENTS.LOAD_ACCOUNTS, availableAccounts)
    this.window.show()
  }

  hide() {
    this.window!.hide()
  }
}
