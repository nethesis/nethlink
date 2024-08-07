import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhone as CallIcon,
  faEllipsisVertical as MenuIcon,
  faPenToSquare as ModifyIcon,
  faTrash as DeleteIcon,
  faCircleUser as UserIcon
} from '@fortawesome/free-solid-svg-icons'
import { Menu } from '@headlessui/react'
import { ContactType, OperatorData } from '@shared/types'
import { t } from 'i18next'
import { useAccount } from '@renderer/hooks/useAccount'
import { useStoreState } from '@renderer/store'
import { Avatar, Button } from '@renderer/components/Nethesis'
import { truncate } from '@renderer/utils'
import { NumberCaller } from '@renderer/components/NumberCaller'
import { isDev } from '@shared/utils/utils'
import classNames from 'classnames'
import { useTheme } from '@renderer/theme/Context'

export interface SpeedDialNumberProps {
  speedDial: ContactType
  className?: string
  callUser: () => void
  handleEditSpeedDial: (editSpeedDial: ContactType) => void
  handleDeleteSpeedDial: (deleteSpeedDial: ContactType) => void
  isLastItem: boolean
}

export function SpeedDialNumber({
  speedDial,
  className,
  callUser,
  handleEditSpeedDial,
  handleDeleteSpeedDial,
  isLastItem
}: SpeedDialNumberProps): JSX.Element {
  const { theme: nethTheme } = useTheme()
  const [operators] = useStoreState<OperatorData>('operators')
  const { isCallsEnabled } = useAccount()

  const avatarSrc =
    operators?.avatars?.[operators?.extensions[speedDial.speeddial_num || '']?.username]

  return (
    <div
      className={`relative flex flex-row justify-between items-center min-h-[44px] p-2 ${className}`}
    >
      <div className="flex gap-6 items-center">
        <Avatar
          size="base"
          src={avatarSrc}
          status={
            operators?.operators?.[operators?.extensions[speedDial.speeddial_num || '']?.username]
              ?.mainPresence || undefined
          }
          className="z-0"
          placeholderType={
            operators?.extensions[speedDial.speeddial_num || ''] ? 'operator' : 'person'
          }
        />
        <div className="flex flex-col gap-1">
          <p className="dark:text-titleDark text-titleLight font-medium text-[14px] leading-5">
            {isDev() && <span className='absolute top-0 right-[-16px] text-[8px]'>[{speedDial.id}]</span>}{truncate(speedDial.name || speedDial.company || `${t('Common.Unknown')}`, 20)}
          </p>
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon
              className="dark:text-gray-400 text-gray-600 text-base"
              icon={CallIcon}
              onClick={callUser}
            />
            <NumberCaller
              number={speedDial.speeddial_num!}
              disabled={!isCallsEnabled}
              className="dark:text-textBlueDark text-textBlueLight font-normal hover:underline"
              isNumberHiglighted={false}
            >
              {truncate(speedDial.speeddial_num!, 19)}
            </NumberCaller>
          </div>
        </div>
      </div>
      <div className="flex justify-center min-w-4 min-h-4">
        <div>
          <Menu>
            <div>
              <Menu.Button className={classNames('flex items-center justify-center min-w-8 min-h-8  dark:hover:bg-transparent hover:bg-transparent', nethTheme.button.ghost, nethTheme.button.base, nethTheme.button.rounded.base)}>
                <FontAwesomeIcon
                  className="dark:text-titleDark text-titleLight text-base"
                  icon={MenuIcon}
                />
              </Menu.Button>
            </div>
            <Menu.Items
              className={`absolute ${isLastItem ? 'top-[-48px]' : 'top-0'} border dark:border-borderDark border-borderLight rounded-lg min-w-[180px] min-h-[84px] dark:bg-bgDark bg-bgLight translate-x-[calc(-100%+36px)] z-[110]`}
            >
              <Menu.Item as={'div'} className="cursor-pointer">
                <div
                  className="flex flex-row items-center py-[10px] px-6 dark:hover:bg-hoverDark hover:bg-hoverLight mt-2"
                  onClick={() => {
                    handleEditSpeedDial(speedDial)
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <FontAwesomeIcon
                      className="text-base dark:text-titleDark text-titleLight"
                      icon={ModifyIcon}
                    />
                    <p className="font-normal text-[14px] leading-5 dark:text-titleDark text-titleLight">
                      {t('Common.Edit')}
                    </p>
                  </div>
                </div>
              </Menu.Item>

              <Menu.Item as={'div'} className="cursor-pointer">
                <div
                  className="flex flex-row items-center py-[10px] px-6 dark:text-rose-500 text-rose-700 dark:hover:bg-rose-800 dark:hover:text-gray-50 hover:bg-rose-700 hover:text-gray-50 mb-2"
                  onClick={() => handleDeleteSpeedDial(speedDial)}
                >
                  <div className="flex gap-3 items-center">
                    <FontAwesomeIcon className="text-base" icon={DeleteIcon} />
                    <p className="font-normal text-[14px] leading-5">{t('Common.Delete')}</p>
                  </div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Menu >
        </div >
      </div >
    </div >
  )
}
