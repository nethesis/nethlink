import { MissedCallsBox } from '@renderer/components/MissedCallsBox'
import { Navbar } from '../components/Navbar'
import { MENU_ELEMENT, Sidebar } from '../components/Sidebar'
import { SpeedDialsBox } from '../components/SpeedDialsBox'
import { useInitialize } from '../hooks/useInitialize'
import { Account } from '@shared/types'
import { useState } from 'react'

export function NethConnectorPage() {
  const [search, setSearch] = useState('')
  const [account, setAccount] = useState<Account>()
  const [selectedMenu, setSelectedMenu] = useState<MENU_ELEMENT>(MENU_ELEMENT.PHONE)

  useInitialize(() => {
    initialize()
  })

  function initialize() {
    console.log('initialize')
    window.api.onAccountChange(updateAccount)
    window.api.sendInitializationCompleted('nethconnectorpage')
  }

  function updateAccount(e, account: Account | undefined) {
    console.log(account)
    setAccount(() => account)
  }

  async function handleSearch(searchText: string) {
    console.log(searchText)
    setSearch(() => searchText)
    window.api.startCall(searchText)
    console.log()
  }
  async function handleReset() {
    setSearch(() => '')
  }

  function openSettings() {
    alert('aprire modale')
    //window.electron.ipcRenderer.send('openWindow', 'settings')
  }

  function createSpeedDials(): void {
    alert('Deve reindirizzare alla pagina per creare un nuovo speed dial')
  }

  function callUser(phoneNumber: string): void {
    //window.api.startCall(phoneNumber)
    alert(`Deve chiamare l'utente selezionato. ${phoneNumber}`)
  }

  function showNumberDetails(e: any): void {
    alert(`La funzione dovrebbe mostrare i dettagli dell' utente selezionato. ${e}`)
  }

  function showSignOutModal(): void {
    //window.api.logout()
    alert('La funzione deve mostrare il modal di Signout.')
  }

  function viewAllMissedCalls(): void {
    alert('Deve reindirizzare alla pagina per vedere tutte le chiamate perse.')
  }

  return (
    <div>
      {account && (
        <div
          className="absolute pt-[9px] container w-full h-full overflow-hidden flex flex-col justify-end items-center font-poppins text-sm text-gray-200"
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          <div className="absolute rotate-45 origin-center w-[14px] h-[14px] bg-gray-900 top-[4px] rounded-[1px]"></div>
          <div className="flex flex-row bg-gray-900 min-w-[400px] min-h-[362px] h-full z-10 rounded-md">
            <div className="flex flex-col gap-4 pt-2 pr-4 pb-4 pl-4 min-w-[350px]">
              <Navbar
                openSettings={openSettings}
                handleSearch={handleSearch}
                handleReset={handleReset}
                showSignOutModal={showSignOutModal}
              />
              {selectedMenu === MENU_ELEMENT.ZAP ? (
                <SpeedDialsBox
                  title="Speed Dials"
                  onClick={createSpeedDials}
                  callUser={callUser}
                  showNumberDetails={showNumberDetails}
                  label="Create"
                />
              ) : (
                <MissedCallsBox
                  title="Missed Calls (3)"
                  label="View all"
                  onClick={viewAllMissedCalls}
                />
              )}

              <button onClick={async () => window.api.logout()}>Logout</button>
              {/* <button onClick={() => window.api.getSpeeddials()}></button> */}
              <div className="">{search}</div>
            </div>
            <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
          </div>
        </div>
      )}
    </div>
  )
}