import {
  faMagnifyingGlass as SearchIcon,
  faXmark as DeleteSearchIcon
} from '@fortawesome/free-solid-svg-icons'
import { TextInput } from './Nethesis/TextInput'
import { t } from 'i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from './Nethesis'
import { validatePhoneNumber } from '@renderer/utils'
import { useAccount } from '@renderer/hooks/useAccount'

export interface SearchBoxProps {
  search: string
  callUser: (phoneNumber: string) => void
  handleSearch: (searchText: string) => Promise<void>
  handleReset: () => void
}

export function SearchBox({ search, callUser, handleSearch, handleReset }: SearchBoxProps): JSX.Element {

  const { isCallsEnabled } = useAccount()
  function reset(searchText: string): void {
    if (searchText === '') {
      handleReset()
    }
  }

  function submit(searchText: string): void {
    handleSearch(searchText)
  }

  return (
    <div className="flex flex-row items-center relative">
      <TextInput
        rounded="base"
        icon={SearchIcon}
        type="text"
        value={search}
        placeholder={t('Common.Call or compose') as string}
        onChange={(e) => {
          handleSearch(e.target.value)
          reset(e.target.value)
        }}
        onSubmit={() => submit(search)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (validatePhoneNumber(search) && isCallsEnabled) {
              callUser(search)
            } else {
              submit(search)
            }
          }
        }}
        className="min-w-[222px] dark:text-titleDark text-titleLight"
      />
      {search !== '' && (
        <Button
          variant="ghost"
          className="absolute right-1 z-[101] cursor-pointer mr-2 pt-[2px] pr-[2px] pb-[2px] pl-[2px]"
        >
          <FontAwesomeIcon
            icon={DeleteSearchIcon}
            className="dark:text-titleDark text-titleLight h-4 w-4"
            onClick={handleReset}
          />
        </Button>
      )}
    </div>
  )
}
