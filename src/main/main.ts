import { app, protocol, nativeTheme } from 'electron'
import { registerIpcEvents } from '@/lib/ipcEvents'
import { AccountController, NethVoiceAPI } from './classes/controllers'
import { PhoneIslandController } from './classes/controllers/PhoneIslandController'
import { Account, AvailableThemes } from '@shared/types'
import { TrayController } from './classes/controllers/TrayController'
import { IPC_EVENTS } from '@shared/constants'
import { LoginController } from './classes/controllers/LoginController'
import { resolve } from 'path'
import { log } from '@shared/utils/logger'
import { NethLinkController } from './classes/controllers/NethLinkController'
import { SplashScreenController } from './classes/controllers/SplashScreenController'
import { delay } from '@shared/utils/utils'

new AccountController(app)

//registro tutti gli eventi che la parte frontend emette verso il backend
registerIpcEvents()

app.setLoginItemSettings({
  openAtLogin: true
})

app.whenReady().then(async () => {
  protocol.handle('tel', (req) => {
    return handleTelProtocol(req.url)
  })
  protocol.handle('callto', (req) => {
    return handleTelProtocol(req.url)
  })

  let windowsLoaded = 0
  //Creo l'istanza del Tray controller - gli definisco la funzione che deve eseguire al click sull'icona
  new SplashScreenController()
  new TrayController()

  //Visualizzo la splashscreen all'avvio dell'applicazione.
  SplashScreenController.instance.window.addOnBuildListener(async () => {
    SplashScreenController.instance.show()
    new PhoneIslandController()
    new NethLinkController()
    new LoginController()
    const addBuildedWindow = () => windowsLoaded++
    PhoneIslandController.instance.window.addOnBuildListener(addBuildedWindow)
    NethLinkController.instance.window.addOnBuildListener(addBuildedWindow)
    LoginController.instance.window.addOnBuildListener(addBuildedWindow)

    //aspetto che tutte le finestre siano pronte o un max di 2,5 secondi
    let time = 0
    while (windowsLoaded <= 2 && time < 25) {
      await delay(100)
      time++
      //log(time, windowsLoaded)
    }

    //constollo se esiste il file di config (il file esiste solo se almeno un utente ha effettuato il login)
    if (AccountController.instance.hasConfigsFolder()) {
      //sia che riesco ad effettuare il login con il token sia che lo faccio con la pagina di login mi devo registrare a questo evento
      AccountController.instance.addEventListener('LOGIN', onAccountLogin)
      try {
        //provo a loggare l'utente con il token che aveva
        await AccountController.instance.autologin()
      } catch (e) {
        AccountController.instance.addEventListener('LOGIN', onLoginFromloginPage)
        LoginController.instance.show()
      } finally {
        //il caricamento è terminato, posso rimuovere la splashscreen
        SplashScreenController.instance.hide()
      }
    } else {
      //il caricamento è terminato, posso rimuovere la splashscreen
      SplashScreenController.instance.hide()
      //dichiaro cosa deve accadere quando l'utente effettua il login
      AccountController.instance.addEventListener('LOGIN', onLoginFromloginPage)
      AccountController.instance.addEventListener('LOGIN', onAccountLogin)
      LoginController.instance.show()
    }
  })
})

const onAccountLogin = (account: Account) => {
  try {
    //loggo il nuovo accopunt sulla phone island
    PhoneIslandController.instance.login(account)
    //inizializzo la pagina di nethLink e avvio i fetch di history, speeddials e l'interval sugli operatori
    NethLinkController.instance.init(account)
    //quando l'utente cambia devo riloggarlo sulla phone island
  } catch (e) {
    console.error(e)
  }
  AccountController.instance.removeEventListener('LOGIN', onAccountLogin)

  //essendomi loggato mi registro all'evento di logout
  AccountController.instance.addEventListener('LOGOUT', onAccountLogout)
}

const onAccountLogout = () => {
  //ormai mi sono sloggato quindi rimuovo il listener
  AccountController.instance.removeEventListener('LOGOUT', onAccountLogout)
  PhoneIslandController.instance.logout()
  NethLinkController.instance.hide()

  AccountController.instance.addEventListener('LOGIN', onLoginFromloginPage)
  AccountController.instance.addEventListener('LOGIN', onAccountLogin)
  LoginController.instance.show()
}

const onLoginFromloginPage = (account: Account) => {
  log('Account', account.username, 'logged from login page')
  LoginController.instance.hide()
  AccountController.instance.removeEventListener('LOGIN', onLoginFromloginPage)
}

app.on('window-all-closed', () => {
  app.dock?.hide()
})

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient('tel')
app.removeAsDefaultProtocolClient('callto')

// if we are running a non-packaged version of the app && on windows
if (process.env.node_env === 'development' && process.platform === 'win32') {
  // set the path of electron.exe and your app.
  // these two additional parameters are only available on windows.
  app.setAsDefaultProtocolClient('tel', process.execPath, [resolve(process.argv[1])])
  app.setAsDefaultProtocolClient('callto', process.execPath, [resolve(process.argv[1])])
} else {
  app.setAsDefaultProtocolClient('tel')
  app.setAsDefaultProtocolClient('callto')
}

//windows
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

app.on('open-url', (ev, origin) => {
  handleTelProtocol(origin)
})

app.dock?.hide()

function handleTelProtocol(url: string): Promise<Response> {
  const tel = decodeURI(url)
    .replace(/ /g, '')
    .replace(/tel:\/\//g, '')
    .replace(/callto:\/\//g, '')
    .replace(/\//g, '')
  log('TEL:', tel)
  PhoneIslandController.instance.call(tel)
  return new Promise((resolve) => resolve)
}
