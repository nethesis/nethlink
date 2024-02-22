import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS, PHONE_ISLAND_EVENTS } from '@shared/constants'
import { Account, HistoryCallData } from '@shared/types'

export type SyncResponse<T> = [T, Error]

export interface IElectronAPI {
  hideLoginWindow(): void
  resizeLoginWindow(height: number): void
  resizePhoneIsland(offsetWidth: number, offsetHeight: number): void
  sendInitializationCompleted(id: string): unknown
  onAccountChange(
    updateAccount: (e: IpcRendererEvent, account: Account | undefined) => void
  ): unknown
  onDataConfigChange(
    updateDataConfig: (event: IpcRendererEvent, dataConfig: string | undefined) => void
  ): void
  onReceiveSpeeddials(saveSpeeddials: (speeddialsResponse: any) => Promise<void>): unknown
  onReciveLastCalls(saveMissedCalls: (historyResponse: HistoryCallData) => Promise<void>): unknown
  login: (host: string, username: string, password: string) => Promise<Account | undefined>
  logout: () => void
  onLoadAccounts(callback: (event: IpcRendererEvent, accounts: Account[]) => void)
  startCall(phoneNumber: string): void
  onStartCall(callback: (event: IpcRendererEvent, ...args: any[]) => void): void

  addPhoneIslandListener: (
    event: PHONE_ISLAND_EVENTS,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void

  (funcName: PHONE_ISLAND_EVENTS): () => void
}

function addListener(event) {
  return (callback) => ipcRenderer.on(event, callback)
}

function setEmitterSync<T>(event): () => Promise<T> {
  return (...args): Promise<T> => {
    return new Promise((resolve) => {
      const res = ipcRenderer.sendSync(event, ...args)
      resolve(res)
    })
  }
}

function setEmitter(event) {
  return (...args) => {
    ipcRenderer.send(event, ...args)
  }
}
// @ts-ignore (define in dts)
// Custom APIs for renderer
const api: IElectronAPI = {
  //SYNC EMITTERS - expect response
  login: setEmitterSync<Account | undefined>(IPC_EVENTS.LOGIN),

  //EMITTER - only emit, no response
  hideLoginWindow: setEmitter(IPC_EVENTS.HIDE_LOGIN_WINDOW),
  logout: setEmitter(IPC_EVENTS.LOGOUT),
  startCall: setEmitter(IPC_EVENTS.START_CALL),
  sendInitializationCompleted: setEmitter(IPC_EVENTS.INITIALIZATION_COMPELTED),
  resizePhoneIsland: setEmitter(IPC_EVENTS.PHONE_ISLAND_RESIZE),
  resizeLoginWindow: setEmitter(IPC_EVENTS.LOGIN_WINDOW_RESIZE),

  //LISTENERS - receive data async
  onLoadAccounts: addListener(IPC_EVENTS.LOAD_ACCOUNTS),
  onStartCall: addListener(IPC_EVENTS.EMIT_START_CALL),
  onDataConfigChange: addListener(IPC_EVENTS.ON_DATA_CONFIG_CHANGE),
  onAccountChange: addListener(IPC_EVENTS.ACCOUNT_CHANGE),
  onReceiveSpeeddials: addListener(IPC_EVENTS.RECEIVE_SPEEDDIALS),
  onReciveLastCalls: addListener(IPC_EVENTS.RECEIVE_HISTORY_CALLS),

  addPhoneIslandListener: (event, callback) => {
    const listener = addListener(`on-${event}`)
    return listener(callback)
  },

  //PHONE ISLAND EVENTS:
  ...Object.keys(PHONE_ISLAND_EVENTS).reduce((p, ev) => {
    console.log(ev)
    p[`${ev}`] = setEmitter(ev)
    return p
  }, {})
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
