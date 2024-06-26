import { PAGES } from '@shared/types'
import { BaseWindow } from './BaseWindow'

export class SplashScreenWindow extends BaseWindow {
  constructor() {
    const size = { w: 400, h: 450 }
    super(PAGES.SPLASHSCREEN, {
      width: size.w,
      height: size.h,
      show: true,
      fullscreenable: false,
      autoHideMenuBar: true,
      closable: false,
      alwaysOnTop: true,
      minimizable: false,
      maximizable: false,
      movable: false,
      resizable: false,
      skipTaskbar: false,
      roundedCorners: true,
      transparent: true,
      hiddenInMissionControl: true,
      hasShadow: false,
      center: true,
      fullscreen: false,
      acceptFirstMouse: false,
      frame: false,
      thickFrame: false,
      trafficLightPosition: { x: 0, y: 0 }
    })
  }
}
