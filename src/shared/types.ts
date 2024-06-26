export type AvailableThemes = 'system' | 'light' | 'dark'

export enum PAGES {
  SPLASHSCREEN = "splashscreenpage",
  LOGIN = "loginpage",
  PHONEISLAND = "phoneislandpage",
  NETHLINK = "nethlinkpage",
  DEVTOOLS = "devtoolspage"

}
export type Account = {
  username: string
  accessToken?: string
  lastAccess?: string
  host: string
  theme: AvailableThemes
  phoneIslandPosition?: { x: number; y: number }
  sipPort?: string
  sipHost?: string
  numeric_timezone?: string
  timezone?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: AccountData,
  cryptPsw?: Buffer
}

export type ConfigFile = {
  lastUser: string | undefined
  accounts: {
    [username: string]: Account
  }
}

export type PhoneIslandConfig = {
  hostname: string
  username: string
  authToken: string
  sipExten: string
  sipSecret: string
  sipHost: string
  sipPort: string
}

export type BaseAccountData = {
  name: string
  username: string
  mainPresence: StatusTypes
  presence: StatusTypes
  presenceOnBusy: StatusTypes
  presenceOnUnavailable: StatusTypes
  recallOnBusy: string
  endpoints: {
    email: BaseEndpoint[]
    jabber: Jabber[]
    extension: Extension[]
    cellphone: BaseEndpoint[]
    voicemail: BaseEndpoint[]
    mainextension: BaseEndpoint[]
  }
}
export type AccountData = BaseAccountData & {
  profile: {
    id: string
    name: string
    macro_permissions: {
      [macro_permission_name: string]: {
        value: boolean
        permissions: {
          [permission_name: string]: { id: string; name: string; value: boolean }
        }
      }
    }
    outbound_routes_permissions: OutboundRoutePermission[]
  }
  default_device: Extension
  settings: UserSettings
}

export type BaseEndpoint = {
  id: string
  description?: string
}

export type Jabber = {
  server: string
} & BaseEndpoint

export type Extension = {
  type: string
  secret: string
  username: string
  actions: object
  proxy_port: string | null
} & BaseEndpoint

export type OutboundRoutePermission = {
  route_id: string
  name: string
  permission: boolean
}
export type UserSettings = {
  desktop_notifications: true
  open_ccard: 'enabled' | 'disabled'
  chat_notifications: true
  avatar?: string
}

export type MultipleResponse<T> = {
  count: number
  rows: T[]
}
export type HistorySpeedDialType = MultipleResponse<ContactType>
export type HistoryCallData = MultipleResponse<CallData>
export type SearchCallData = MultipleResponse<SearchData>

export type SearchData = {
  isOperator: boolean
  kind: 'person' | 'company',
  contacts?: any
  displayName: string
  cellphone: string
  company: string
  extension: string
  fax: string
  homecity: string
  homecountry: string
  homeemail: string
  homephone: string
  homepob: string
  homepostalcode: string
  homeprovince: string
  homestreet: string
  id: number
  name: string
  notes: string
  owner_id: string
  source: string
  speeddial_num: string
  title: string
  type: string
  url: string
  workcity: string
  workcountry: string
  workemail: string
  workphone: string
  workpob: string
  workpostalcode: string
  workprovince: string
  workstreet: string
}
export type CallData = {
  time?: number
  channel?: string
  dstchannel?: string
  uniqueid?: string
  linkedid?: string
  userfield?: string
  duration?: number
  billsec?: number
  disposition?: string
  dcontext?: string
  lastapp?: string
  recordingfile?: string
  cnum?: string
  cnam?: string
  ccompany?: string
  src?: string
  dst?: string
  dst_cnam?: string
  dst_ccompany?: string
  clid?: string
  direction?: string
  queue?: string
}

export type StatusTypes =
  | 'available'
  | 'online'
  | 'dnd'
  | 'voicemail'
  | 'cellphone'
  | 'callforward'
  | 'busy'
  | 'incoming'
  | 'ringing'
  | 'offline'

export type ContactType = {
  id?: string | number
  owner_id?: string
  type?: string
  homeemail?: string
  workemail?: string
  homephone?: string
  workphone?: string
  cellphone?: string
  fax?: string
  title?: string
  company?: string
  notes?: string
  name?: string
  homestreet?: string
  homepob?: string
  homecity?: string
  homeprovince?: string
  homepostalcode?: string
  homecountry?: string
  workstreet?: string
  workpob?: string
  workcity?: string
  workprovince?: string
  workpostalcode?: string
  workcountry?: string
  url?: string
  extension?: string
  speeddial_num?: string
  source?: string
  privacy?: string
  favorite?: boolean
  selectedPrefNum?: string
}

export type NewContactType = {
  name: string
  privacy?: string
  favorite?: boolean
  selectedPrefNum?: string
  setInput?: string
  type?: string
  speeddial_num?: string
  company?: string
}

export type NewSpeedDialType = {
  name: string
  privacy?: string
  favorite?: boolean
  selectedPrefNum?: string
  setInput?: string
  type?: string
  speeddial_num?: string
}

export type OperatorData = {
  userEndpoints: UserEndpointsType
  extensions: ExtensionsType
  operators: OperatorsType
  groups: GroupsType
  avatars: AvatarType
}

export type UserEndpointsType = {
  [username: string]: BaseAccountData & {
    avatarBase64?: string
  }
}

export type OperatorsType = {
  [username: string]: BaseAccountData
}

export type GroupsType = {
  [groupName: string]: {
    users: string[] // contains the usernames
  }
}

export type ExtensionsType = {
  [phoneNumber: string]: {
    cf: string
    cfVm: string
    cfb: string
    cfbVm: string
    cfu: string
    cfuVm: string
    chanType: string
    codecs: string[]
    context: string
    conversations: {}
    dnd: false
    exten: string
    ip: string
    mac: string
    name: string
    port: string
    sipuseragent: string
    status: string
    username: string
  }
}

export type AvatarType = {
  [username: string]: string //if present there is base64
}

export type QueuesType = {
  [username: string]: {
    name: string
    queue: string
    members: {
      [user: string]: {
        callsTakenCount: number
        lastCallTimestamp: number
        lastPausedInReason: string
        lastPausedInTimestamp: number
        lastPausedOutTimestamp: number
        loggedIn: boolean
        member: string
        name: string
        paused: boolean
        queue: string
        type: string
      }
    }
    avgHoldTime: string
    avgTalkTime: string
    serviceLevelPercentage: string
    serviceLevelTimePeriod: string
    waitingCallers: object
  }
}

export type PageType = {
  query: string
  props: {
    appVersion?: string
  }
}


export type Size = { w: number; h: number }

