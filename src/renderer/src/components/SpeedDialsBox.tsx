import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircleNotch, faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { SpeedDialNumber } from './SpeedDialNumber'
import { SpeedDialType } from '@shared/types'
import { Button } from './Nethesis/Button'
import { useRef, useState } from 'react'
import { TextInput } from './Nethesis'
import { CreateSpeedDialBox } from './CreateSpeedDialBox'

export interface SpeedDialsBoxProps {
  speeddials: SpeedDialType[] | undefined
  label?: string
  callUser: (phoneNumber: string) => void
}

export function SpeedDialsBox({ speeddials, label, callUser }: SpeedDialsBoxProps): JSX.Element {
  const [isCreatingSpeedDial, setIsCreatingSpeedDial] = useState<boolean>(false)
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4 min-h-[284px]">
      {isAddedSuccessfully && (
        <div className="flex flex-row items-center gap-2 py-1 px-3 rounded-[4px] max-h-6 max-w-[170px] text-gray-100 bg-green-700">
          <FontAwesomeIcon icon={faCheck} className="text-[16px]" />
          <p className="font-semibold text-sm">Speed dial created</p>
        </div>
      )}
      {isCreatingSpeedDial ? (
        <CreateSpeedDialBox
          setIsCreatingSpeedDial={setIsCreatingSpeedDial}
          setIsAddedSuccessfully={setIsAddedSuccessfully}
        />
      ) : (
        <>
          <div className="flex justify-between items-center py-1 border border-t-0 border-r-0 border-l-0 border-gray-700 font-semibold max-h-[28px]">
            <h1>Speed Dials</h1>
            <Button
              className="flex gap-3 items-center pt-0 pr-0 pb-0 pl-0"
              onClick={() => {
                setIsAddedSuccessfully(false)
                setIsCreatingSpeedDial(true)
              }}
            >
              <FontAwesomeIcon style={{ fontSize: '16px', color: '#3B82F6' }} icon={faCirclePlus} />
              <p className="text-blue-500">{label}</p>
            </Button>
          </div>
          <div className="flex flex-col gap-2 p-2 min-h-[240px]">
            {speeddials?.length || 0 > 0 ? (
              speeddials?.map((e, idx) => {
                console.log(e)
                return (
                  <div
                    className={`${idx === speeddials.length - 1 ? `` : `border-b pb-2 border-gray-700`}`}
                    key={idx}
                  >
                    <SpeedDialNumber
                      name={e.name!}
                      number={e.speeddial_num!}
                      callUser={() => callUser(e.speeddial_num!)}
                    />
                  </div>
                )
              })
            ) : (
              <div>No speed dial</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
