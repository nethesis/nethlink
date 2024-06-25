import { useEffect, useState } from 'react'
import { SidebarButton } from './SidebarButton'
import {
  faBolt as SpeedDialMenuIcon,
  faPhone as MissedCallMenuIcon
} from '@fortawesome/free-solid-svg-icons'
import { useStoreState } from '@renderer/store'
import { NethLinkPageData } from '@shared/types'
import { MENU_ELEMENT } from '@shared/constants'

export interface SidebarProps {
  onChangeMenu: (menuElement: MENU_ELEMENT) => void
}

export function Sidebar({ onChangeMenu }: SidebarProps): JSX.Element {

  const [nethLinkPageData, setNethLinkPageData] = useStoreState<NethLinkPageData>('nethLinkPageData')
  function handleSidebarMenuSelection(menuElement: MENU_ELEMENT): void {
    setNethLinkPageData((p) => ({
      ...p,
      selectedSidebarMenu: menuElement,
      phonebookSearchModule: {
        searchText: undefined
      }
    }))
  }

  useEffect(() => {
    if (nethLinkPageData && nethLinkPageData.selectedSidebarMenu)
      onChangeMenu(nethLinkPageData.selectedSidebarMenu)
  }, [nethLinkPageData?.selectedSidebarMenu])

  return (
    <div className="flex flex-col h-full max-w-[50px] items-center gap-6 px-2 py-3 border border-t-0 border-r-0 border-b-0 dark:border-borderDark border-borderLight">
      <SidebarButton
        icon={SpeedDialMenuIcon}
        focus={nethLinkPageData?.selectedSidebarMenu === MENU_ELEMENT.SPEEDDIALS}
        hasNotification={false}
        onClick={() => handleSidebarMenuSelection(MENU_ELEMENT.SPEEDDIALS)}
        className={`${nethLinkPageData?.selectedSidebarMenu === MENU_ELEMENT.SPEEDDIALS ? '' : 'dark:hover:bg-hoverDark hover:bg-hoverLight'}`}
      />
      <SidebarButton
        icon={MissedCallMenuIcon}
        focus={nethLinkPageData?.selectedSidebarMenu === MENU_ELEMENT.LAST_CALLS}
        hasNotification={false}
        onClick={() => handleSidebarMenuSelection(MENU_ELEMENT.LAST_CALLS)}
        className={`${nethLinkPageData?.selectedSidebarMenu === MENU_ELEMENT.LAST_CALLS ? '' : 'dark:hover:bg-hoverDark hover:bg-hoverLight'}`}
      />
    </div>
  )
}
