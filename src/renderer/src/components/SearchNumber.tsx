import { ReactNode } from 'react'
import { Avatar, Button } from './Nethesis'
import { NumberCaller } from './NumberCaller'
import { t } from 'i18next'
import { OperatorData, SearchData } from '@shared/types'
import { useSubscriber } from '@renderer/hooks/useSubscriber'
import { faCircleUser as DefaultAvatar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface SearchNumberProps {
  user: SearchData
  className?: string
  callUser: (phoneNumber: string) => void
  searchText: string
}

export function SearchNumber({ user, callUser, className, searchText }: SearchNumberProps) {
  const operators = useSubscriber<OperatorData>('operators')

  const getUsernameFromPhoneNumber = (number: string) => {
    return operators.extensions[number]?.username
  }

  function highlightMatch(number: string | undefined, searchText: string): ReactNode[] {
    const parts: ReactNode[] = []
    let lastIndex = 0
    if (number) {
      const lowerText = number.toLowerCase()
      const lowerSearchText = searchText.toLowerCase()
      let index = lowerText.indexOf(lowerSearchText)
      while (index !== -1) {
        parts.push(number.substring(lastIndex, index))
        parts.push(
          <span className="dark:text-blue-500 text-blue-700 font-bold text-[1.1rem]">
            {number.substring(index, index + searchText.length)}
          </span>
        )
        lastIndex = index + searchText.length
        index = lowerText.indexOf(lowerSearchText, lastIndex)
      }

      parts.push(number.substring(lastIndex))
    }
    return parts
  }

  let phoneNumber: string | null = null
  const keys = ['extension', 'cellphone', 'homephone', 'workphone']

  for (const key of keys) {
    if (!phoneNumber) {
      phoneNumber = (user[key] || '').includes(`${searchText}`) ? user[key] : null
    } else {
      break
    }
  }

  phoneNumber =
    phoneNumber ||
    keys.reduce((p, c) => {
      if (p === '') p = user[c] || ''
      return p
    }, '')

  const highlightedNumber = highlightMatch(phoneNumber, searchText)

  const username = getUsernameFromPhoneNumber(phoneNumber)
  const avatarSrc = operators?.avatars?.[username]

  return (
    <div
      className={`flex justify-between w-full min-h-14 py-2 px-5 dark:text-gray-50 text-gray-900 ${className}`}
    >
      <div className="flex gap-3 items-center">
        {avatarSrc ? (
          <Avatar
            size="small"
            src={avatarSrc}
            status={operators?.operators?.[username]?.mainPresence || undefined}
            bordered={true}
          />
        ) : (
          <div className="flex items-center justify-center relative shrink-0 h-8 w-8 text-sm rounded-full border-2 border-white dark:border-gray-700">
            <FontAwesomeIcon
              icon={DefaultAvatar}
              className="text-[28px] dark:text-gray-50 text-gray-600"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="font-normal text-[14px] leading-5">{user.name}</p>
          <NumberCaller
            number={phoneNumber}
            className="dark:text-blue-500 text-blue-700 text-[1rem] font-normal hover:underline mr-auto"
          >
            {highlightedNumber}
          </NumberCaller>
        </div>
      </div>
      <Button
        className="dark:hover:bg-gray-900 hover:bg-gray-50 dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
        variant="ghost"
        onClick={() => {
          callUser(phoneNumber)
        }}
      >
        <p className="dark:text-blue-500 text-blue-700 font-medium text-[14px] leading-5">
          {t('Operators.Call')}
        </p>
      </Button>
    </div>
  )
}
