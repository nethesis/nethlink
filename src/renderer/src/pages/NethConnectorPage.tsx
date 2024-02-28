import { MissedCallsBox } from '@renderer/components/MissedCallsBox'
import { Navbar } from '../components/Navbar'
import { MENU_ELEMENT, Sidebar } from '../components/Sidebar'
import { SpeedDialsBox } from '../components/SpeedDialsBox'
import { useInitialize } from '../hooks/useInitialize'
import { Account, AvailableThemes, CallData, HistoryCallData, SpeedDialType } from '@shared/types'
import { useEffect, useState } from 'react'
import { SearchNumberBox } from '@renderer/components/SearchNumberBox'
import { PHONE_ISLAND_EVENTS } from '@shared/constants'
import { debouncer } from '@shared/utils/utils'
import { useLocalStoreState } from '@renderer/hooks/useLocalStoreState'

export function NethConnectorPage() {
  const [search, setSearch] = useState('')
  const [account, setAccount] = useState<Account>()
  const [selectedMenu, setSelectedMenu] = useState<MENU_ELEMENT>(MENU_ELEMENT.ZAP)
  const [speeddials, setSpeeddials] = useState<SpeedDialType[]>([])
  const [missedCalls, setMissedCalls] = useState<CallData[]>([])
  const [_, setOperators] = useLocalStoreState('operators')
  const [isContactSaved, setIsContactSaved] = useState<boolean>(false)
  const [isAddingToPhonebook, setIsAddingToPhonebook] = useState<boolean>(false)
  useInitialize(() => {
    initialize()
  }, true)

  //Potrebbe non servire
  const [theme, setTheme] = useState<AvailableThemes | undefined>()

  useEffect(() => {
    if (search) {
      debouncer(
        'search',
        () => {
          console.log('debounce')
          window.api.sendSearchText(search)
        },
        250
      )
    }
  }, [search])

  /* Problema con il tema del sistema se cambio il tema del sistema non viene effettutato  */

  /* useEffect(() => {
    if (account) {
      if (account.theme === 'system') {
        setTheme(() => {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        })
      } else {
        setTheme(() => account.theme)
      }
    }
  }, [account]) */

  function initialize() {
    console.log('initialize')
    window.api.onAccountChange(updateAccount)
    window.api.addPhoneIslandListener(
      PHONE_ISLAND_EVENTS['phone-island-main-presence'],
      onMainPresence
    )
    window.api.onReceiveSpeeddials(saveSpeeddials)
    window.api.onReceiveLastCalls(saveMissedCalls)
  }

  function onMainPresence(op: any) {
    Object.entries(op).forEach(([k, v]) => {
      setOperators((o) => ({
        ...o,
        [k]: v
      }))
    })
  }

  function updateAccount(account: Account | undefined) {
    setAccount(() => account)
  }

  async function saveSpeeddials(speeddialsResponse: SpeedDialType[] | undefined) {
    console.log(speeddialsResponse)
    setSpeeddials(() => speeddialsResponse || [])
  }

  async function saveMissedCalls(historyResponse: HistoryCallData | undefined) {
    console.log(historyResponse)
    setMissedCalls(() => historyResponse?.rows || [])
  }

  async function handleSearch(searchText: string) {
    setSearch(() => searchText)
    //callUser(searchText)
  }

  async function handleTextChange(searchText: string) {
    setSearch(() => searchText)
  }

  async function handleReset() {
    setSearch(() => '')
  }

  function callUser(phoneNumber: string): void {
    console.log(phoneNumber)
    window.api.startCall(phoneNumber)
  }

  function logout(): void {
    window.api.logout()
  }

  function handleAddContactToPhonebook(state: boolean): void {
    setIsAddingToPhonebook(state)
  }

  function handleContactSavedStatus(state: boolean): void {
    setIsContactSaved(state)
  }

  function handleSidebarMenuSelection(menuElement: MENU_ELEMENT): void {
    setSelectedMenu(menuElement)
  }

  function handleOnSelectTheme(theme: AvailableThemes) {
    window.api.changeTheme(theme)
    setAccount((p) => ({
      ...p!,
      theme
    }))
  }

  /* Le seguenti funzioni sono da implementare */

  function viewAllMissedCalls(): void {
    alert('Deve reindirizzare alla pagina per vedere tutte le chiamate perse.')
  }

  return (
    <>
      {account && (
        <div
          className={
            account.theme === 'system'
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
              : account.theme
          }
        >
          <div className="absolute container w-full h-full overflow-hidden flex flex-col justify-end items-center font-poppins text-sm dark:text-gray-200 text-gray-900">
            <div className="flex flex-row dark:bg-gray-900 bg-gray-50 min-w-[400px] min-h-[362px] h-full z-10 rounded-md">
              <div className="flex flex-col gap-4 pt-2 pb-4 w-full">
                <Navbar
                  account={account}
                  onSelectTheme={handleOnSelectTheme}
                  logout={logout}
                  handleSearch={handleSearch}
                  handleReset={handleReset}
                  handleTextChange={handleTextChange}
                />
                <div className="relative w-full h-full">
                  <div className="px-4 w-full h-full">
                    {selectedMenu === MENU_ELEMENT.ZAP ? (
                      <SpeedDialsBox
                        speeddials={speeddials}
                        isContactSaved={isContactSaved}
                        callUser={callUser}
                        label="Create"
                      />
                    ) : (
                      <MissedCallsBox
                        missedCalls={missedCalls}
                        isContactSaved={isContactSaved}
                        title={`Missed Calls (${missedCalls.length})`}
                        label="View all"
                        viewAllMissedCalls={viewAllMissedCalls}
                      />
                    )}
                  </div>
                  {search !== '' ? (
                    <div className="absolute top-0 dark:bg-gray-900 bg-gray-50 h-full w-full">
                      <SearchNumberBox
                        searchText={search}
                        isAddingToPhonebook={isAddingToPhonebook}
                        handleAddContactToPhonebook={handleAddContactToPhonebook}
                        callUser={callUser}
                        handleReset={handleReset}
                        handleContactSavedStatus={handleContactSavedStatus}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <Sidebar
                selectedMenu={selectedMenu}
                handleSidebarMenuSelection={handleSidebarMenuSelection}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
