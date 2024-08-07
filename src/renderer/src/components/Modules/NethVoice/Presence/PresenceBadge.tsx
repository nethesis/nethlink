import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faMobile, faVoicemail } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@renderer/components/Nethesis/Badge'
import { useStoreState } from '@renderer/store'
import { Account, OperatorData, StatusTypes } from '@shared/types'
import { t } from 'i18next'
import { useTheme } from '@renderer/theme/Context'
import classNames from 'classnames'
import { log } from '@shared/utils/logger'

export interface PresenceBadgeProps {
  mainPresence: StatusTypes | undefined
  className?: string
}
export const PresenceBadge = ({ mainPresence, className }: PresenceBadgeProps) => {
  const [account] = useStoreState<Account>('account')
  const [operators] = useStoreState<OperatorData>('operators')
  const { badge: theme, status: statuses } = useTheme().theme

  if (['callforward', 'voicemail', 'cellphone'].includes(mainPresence as string)) {
    const isCallforward = ['callforward', 'voicemail'].includes(mainPresence as string)
    if (!(account?.data?.mainextension && operators?.extensions[account.data.mainextension])) {
      return (
        <div
          className={classNames(
            'animate-pulse h-[25px] w-[106px] bg-gray-300 dark:bg-gray-600 z-[100]',
            !navigator.userAgent.includes('Windows') ? `absolute right-4` : 'absolute left-4',
            theme.base,
            theme.rounded['full'],
            statuses[isCallforward ? 'callforward' : 'voicemail']?.badge.base,
            theme.sizes['small']
          )}
        ></div>
      )
    } else {
      return (
        <div className={classNames('absolute top-[5px] z-[100]', className)}>
          <Badge
            variant={isCallforward ? 'callforward' : 'voicemail'}
            rounded="full"
            size="small"
            className="p-0 h-[22px] max-w-[300px]"
          >
            <FontAwesomeIcon
              icon={
                mainPresence === 'callforward'
                  ? faArrowRight
                  : mainPresence === 'cellphone'
                    ? faMobile
                    : faVoicemail
              }
              className="h-4 w-4  mr-2 text-topBarText dark:text-topBarTextDark"
              aria-hidden="true"
            />
            <span className="font-medium text-xs leading-[18px]">
              {mainPresence === 'callforward'
                ? t('TopBar.Call forward')
                : mainPresence === 'cellphone'
                  ? t('TopBar.Cellphone')
                  : t('TopBar.Voicemail')}
            </span>
            <p className="font-medium text-xs leading-[18px]">
              {account?.data?.endpoints?.cellphone[0]?.id &&
                mainPresence === 'cellphone' &&
                `${': ' + account?.data?.endpoints?.cellphone[0]?.id}`}
              {operators?.extensions[account.data.mainextension]?.cf !== '' &&
                mainPresence === 'callforward' &&
                `${': ' + operators?.extensions[account.data.mainextension]?.cf}`}
            </p>
          </Badge>
        </div>
      )
    }
  }
  return <></>
}
