import { IPC_EVENTS } from "./constants"
import { Account } from "./types"
import { log } from "./utils/logger"

export const useLogin = () => {

  const parseConfig = (account: Account, config): Account => {
    log(IPC_EVENTS.GET_NETHVOICE_CONFIG)
    const voiceHost = account.host.split('.')
    voiceHost.shift()
    voiceHost.join('.')
    let SIP_HOST = '127.0.0.1'
    let SIP_PORT = '5060'
    let NUMERIC_TIMEZONE = '+0200'
    let TIMEZONE = 'Europe/Rome'
    let VOICE_ENDPOINT = `voice.${voiceHost}`

    if (account.host.includes('demo-leopard')) {
      SIP_PORT = '5060'
    } else if (account.host.includes('nethvoice')) {
      SIP_PORT = '20139'
    } else {

      SIP_HOST = config.split("SIP_HOST: '")[1].split("',")[0].trim() //
      SIP_PORT = config.split("SIP_PORT: '")[1].split("',")[0].trim() //
      NUMERIC_TIMEZONE = config.split("NUMERIC_TIMEZONE: '")[1].split("',")[0].trim() //
      TIMEZONE = config.split(" TIMEZONE: '")[1].split("',")[0].trim() //
      VOICE_ENDPOINT = config.split(" VOICE_ENDPOINT: '")[1].split("',")[0].trim() //
    }
    account.sipHost = SIP_HOST
    account.sipPort = SIP_PORT
    account.numeric_timezone = NUMERIC_TIMEZONE
    account.timezone = TIMEZONE
    account.voiceEndpoint = VOICE_ENDPOINT

    return account
  }

  return {
    parseConfig
  }
}
