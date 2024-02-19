import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Badge } from '@nethesis/react-components/src/components/common'
import { MissedCallIcon } from '@renderer/icons/MissedCallIcon'
import { PlaceholderIcon } from '@renderer/icons/PlaceholderIcon'

export interface MissedCallProps {
  name: string
  number: string
  time: number
  duration: number
  company?: string
}

export function MissedCall({
  name,
  number,
  time,
  duration,
  company
}: MissedCallProps): JSX.Element {
  function truncate(str: string) {
    return str.length > 15 ? str.substring(0, 14) + '...' : str
  }

  return (
    <div className="flex flex-grow gap-3 font-semibold max-h-[72px]">
      <div className="flex flex-col h-full min-w-6 pt-[6px]">
        <Avatar size="extra_small" placeholder={PlaceholderIcon} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-50">{truncate(name)}</p>
        <div className="flex flex-row gap-2">
          <MissedCallIcon />
          <p className="text-blue-500 font-normal">{number}</p>
        </div>
        <div className="flex flex-row gap-1">
          <p>{duration}m</p>
          <p>({time})</p>
        </div>
      </div>
      {company && (
        <Badge
          variant="offline"
          size="small"
          className="flex flex-row gap-2 py-1 px-[10px] rounded-[10px] max-h-[22px] font-semibold ml-auto text-gray-100"
        >
          <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
          {company}
        </Badge>
      )}
    </div>
  )
}
