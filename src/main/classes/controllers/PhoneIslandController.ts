import { PhoneIslandConfig } from '@shared/types'
import { PhoneIslandWindow } from '../windows'
import { AccountController } from './AccountController'
import { IPC_EVENTS } from '@shared/constants'
import { screen } from 'electron'

export class PhoneIslandController {
  static instance: PhoneIslandController

  phoneIslandWindow: PhoneIslandWindow

  constructor(phoneIslandWindow: PhoneIslandWindow) {
    PhoneIslandController.instance = this
    this.phoneIslandWindow = phoneIslandWindow
    phoneIslandWindow.getWindow()?.on('moved', (e) => {
      const [x, y] = phoneIslandWindow.getWindow()!.getPosition()
      AccountController.instance.updatePhoneIslandPosition({ x, y })
    })
    //this._addListeners()
  }

  updateDataConfig(token: string) {
    const account = AccountController.instance.getLoggedAccount()
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
      console.log(config)
      const dataConfig = btoa(
        `${config.hostname}:${config.username}:${config.authToken}:${config.sipExten}:${config.sipSecret}:${config.sipHost}:${config.sipPort}`
      )
      this.phoneIslandWindow.emit(IPC_EVENTS.ON_DATA_CONFIG_CHANGE, dataConfig)
    } else {
      throw new Error('Incorrect configuration for the logged user')
    }
  }

  resize(w: number, h: number) {
    const windowPhone = this.phoneIslandWindow.getWindow()
    if (windowPhone) {
      const bounds = windowPhone.getBounds()
      windowPhone.setBounds({ ...bounds, width: w, height: h }, false)
    }
  }

  call(number: string) {
    this.phoneIslandWindow.emit(IPC_EVENTS.EMIT_START_CALL, number)
  }

  logout() {
    this.phoneIslandWindow.emit(IPC_EVENTS.ON_DATA_CONFIG_CHANGE, undefined)
  }
}
