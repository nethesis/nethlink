import { AccountController, NethVoiceAPI } from '@/classes/controllers'
import { PhoneIslandController } from '@/classes/controllers/PhoneIslandController'
import { IPC_EVENTS, PHONE_ISLAND_EVENTS } from '@shared/constants'
import { Account } from '@shared/types'
import { ipcMain, shell } from 'electron'
import { join } from 'path'

export function registerIpcEvents() {
  ipcMain.on(IPC_EVENTS.LOGIN, async (event, ...args) => {
    console.log('LOGIN')
    const [host, username, password] = args
    console.log(args)
    const tempAccount: Account = {
      host,
      username
    }
    const account = await AccountController.instance.login(tempAccount, password)
    event.returnValue = account
  })

  ipcMain.on(IPC_EVENTS.LOGOUT, async (event) => {
    console.log('LOGOUT')
    AccountController.instance.logout()
  })

  ipcMain.on(IPC_EVENTS.LOAD_ACCOUNTS, async (event) => {
    console.log('LOAD_ACCOUNTS')
    event.returnValue = AccountController.instance.listAvailableAccounts()
  })

  ipcMain.on(IPC_EVENTS.CREATE_NEW_ACCOUNT, async (event) => {
    console.log('CREATE_NEW_ACCOUNT')
  })

  ipcMain.on(IPC_EVENTS.GET_SPEED_DIALS, async (event) => {
    console.log('get GET_SPEED_DIALS')
    const speeddials = await NethVoiceAPI.instance.Phonebook.speeddials()
    event.returnValue = speeddials
  })

  ipcMain.on(IPC_EVENTS.OPEN_SPEEDDIALS_PAGE, async (event) => {
    console.log('get OPEN_SPEEDDIALS_PAGE')
    const account = AccountController.instance.getLoggedAccount()
    shell.openExternal(join(account!.host, 'phonebook'))
  })

  ipcMain.on(IPC_EVENTS.GET_LAST_CALLS, async (event) => {
    console.log('get GET_LAST_CALL')
    const last_calls = await NethVoiceAPI.instance.HistoryCall.interval()
    event.returnValue = last_calls
  })

  ipcMain.on(IPC_EVENTS.OPEN_ALL_CALLS_PAGE, async (event) => {
    console.log('get OPEN_ALL_CALLS_PAGE')
    const account = AccountController.instance.getLoggedAccount()
    shell.openExternal(join(account!.host, 'history'))
  })

  ipcMain.on(IPC_EVENTS.OPEN_ADD_TO_PHONEBOOK_PAGE, async (event) => {
    console.log('get OPEN_ADD_TO_PHONEBOOK_PAGE')
    const account = AccountController.instance.getLoggedAccount()
    shell.openExternal(join(account!.host, 'phonebook'))
  })
  ipcMain.on(IPC_EVENTS.START_CALL, async (event, phoneNumber) => {
    console.log('get OPEN_PHONE_ISLAND', phoneNumber)
    PhoneIslandController.instance.call(phoneNumber)
  })

  ipcMain.on(IPC_EVENTS.PHONE_ISLAND_RESIZE, (e, w: number, h: number) => {
    console.log(e, w, h)
    PhoneIslandController.instance.resize(w, h)
  })

  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-main-presence'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-main-presence'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-conversations'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-conversations'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-queue-update'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-queue-update'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-queue-member-update'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-queue-member-update'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-user-already-login'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-user-already-login'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-server-reloaded'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-server-reloaded'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-server-disconnected'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-server-disconnected'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-socket-disconnected'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-socket-disconnected'], args)
  })
  ipcMain.on(PHONE_ISLAND_EVENTS['phone-island-parking-update'], (ev, ...args) => {
    console.log(PHONE_ISLAND_EVENTS['phone-island-parking-update'], args)
  })
}
