import { Account, PhoneIslandConfig } from '@shared/types'
import { PhoneIslandWindow } from '../windows'
import { IPC_EVENTS } from '@shared/constants'
import { log } from '@shared/utils/logger'
import { NethVoiceAPI } from './NethCTIController'
import { AccountController } from './AccountController'

export class PhoneIslandController {
  static instance: PhoneIslandController
  window: PhoneIslandWindow

  constructor() {
    PhoneIslandController.instance = this
    this.window = new PhoneIslandWindow()
  }

  async login(account: Account) {
    const phoneIslandTokenLoginResponse =
      await NethVoiceAPI.instance.Authentication.phoneIslandTokenLogin()
    this.updateDataConfig(phoneIslandTokenLoginResponse.token, account)
  }

  private updateDataConfig(token: string, account: Account) {
    const webRTCExtension = account!.data!.endpoints.extension.find((el) => el.type === 'webrtc')
    if (webRTCExtension && account) {
      const hostname = account!.host.split('://')[1]
      const config: PhoneIslandConfig = {
        hostname,
        username: account.username,
        authToken: token,
        sipExten: webRTCExtension.id,
        sipSecret: webRTCExtension.secret,
        sipHost: account.sipHost || '',
        sipPort: account.sipPort || ''
      }
      //;('dm9pY2UuZGVtby1oZXJvbi5zZi5uZXRoc2VydmVyLm5ldDpsb3JlbnpvOmExN2ZjZDBjYTg1NDc2ZDZmOTQxZGRiM2QyNWVmMDZmMzM2M2I3ZDU6MjA5OjQ0MTYzMGYwOGJhMWY4ODdjYTU4MTUxOWFkNmJhM2Q5OjEyNy4wLjAuMToyMDEwNw==')
      const dataConfig = btoa(
        `${config.hostname}:${config.username}:${config.authToken}:${config.sipExten}:${config.sipSecret}:${config.sipHost}:${config.sipPort}`
      )
      log('INIT PHONE-ISLAND', config.hostname, dataConfig)
      this.window.emit(IPC_EVENTS.ON_DATA_CONFIG_CHANGE, dataConfig)
    } else {
      throw new Error('Incorrect configuration for the logged user')
    }
  }

  resize(w: number, h: number) {
    const window = this.window.getWindow()
    if (window) {
      const bounds = window.getBounds()
      if (this.isFirst) {
        bounds.x = (bounds.width - w) / 2
        bounds.y = (bounds.height - h) / 2
        this.isFirst = false
      }
      window.setBounds({ ...bounds, width: w, height: h }, false)
      if (!window?.isVisible()) {
        window?.show()
      }
  }

  showPhoneIsland() {
    const phoneIslandBounds = AccountController.instance.getPhoneIslandBounds()
    const windowPhone = this.window.getWindow()
    if (phoneIslandBounds) {
      windowPhone?.setBounds({ x: phoneIslandBounds.x, y: phoneIslandBounds.y }, false)
    } else {
      windowPhone?.center()
    }
    windowPhone?.show()
  }

  hidePhoneIsland() {
    const window = this.window.getWindow()
    const phoneIslandBounds = window?.getBounds()
    if (phoneIslandBounds) {
      AccountController.instance.setPhoneIslandBounds({
        x: phoneIslandBounds.x,
        y: phoneIslandBounds.y
      })
    }
     window?.hide()
  }

  call(number: string) {
    this.window.emit(IPC_EVENTS.EMIT_START_CALL, number)
  }

  logout() {
    this.window.emit(IPC_EVENTS.ON_DATA_CONFIG_CHANGE, undefined)
  }
}
