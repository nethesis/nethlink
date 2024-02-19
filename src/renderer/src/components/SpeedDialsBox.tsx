import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { SpeedDialNumber } from './SpeedDialNumber'
import { Button } from '@nethesis/react-components/src/components/common'
import { useInitialize } from '@renderer/hooks/useInitialize'
import { useState } from 'react'
import { HistorySpeedDialType, SpeedDialType } from '@shared/types'

export interface SpeedDialsBoxProps {
  title: string
  label?: string
  onClick?: () => void
  callUser: (phoneNumber: string) => void
  showNumberDetails: (elem: any) => void
}

export function SpeedDialsBox({
  title,
  label,
  onClick,
  callUser,
  showNumberDetails
}: SpeedDialsBoxProps): JSX.Element {
  const [speeddials, setSpeeddials] = useState<SpeedDialType[]>()
  useInitialize(() => {
    window.api.onReceiveSpeeddials(saveSpeeddials)
    saveSpeeddials({
      count: 4,
      rows: [
        { name: 'Edoardo', speeddial_num: '3275757265' },
        { name: 'Pippo Bica', speeddial_num: '230' },
        { name: 'Giovanni', speeddial_num: '56789' },
        { name: 'Alexa', speeddial_num: '27589' }
      ]
    })
  })

  async function saveSpeeddials(speeddialsResponse: HistorySpeedDialType) {
    setSpeeddials(() => speeddialsResponse.rows)
  }

  return (
    <div className="flex flex-col gap-4 min-h-[284px]">
      <div className="flex justify-between items-center py-1 border border-t-0 border-r-0 border-l-0 border-gray-700 font-semibold max-h-[28px]">
        <h1>{title}</h1>
        <Button className="flex gap-3 items-center pt-0 pr-0 pb-0 pl-0" onClick={onClick}>
          <FontAwesomeIcon style={{ fontSize: '16px', color: '#3B82F6' }} icon={faCirclePlus} />
          <p className="text-blue-500">{label}</p>
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-2 min-h-[240px]">
        {/**Aggiungere props */}
        {speeddials?.map((e, idx) => {
          return (
            <div
              className={`${idx === speeddials.length - 1 ? `` : `border-b pb-2 border-gray-700`}`}
              key={idx}
            >
              <SpeedDialNumber
                name={e.name!}
                number={e.speeddial_num!}
                callUser={() => callUser(e.speeddial_num!)}
                showNumberDetails={() => showNumberDetails(e)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
