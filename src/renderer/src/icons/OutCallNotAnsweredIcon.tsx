import { useStoreState } from '@renderer/store'
import { parseThemeToClassName } from '@renderer/utils/utils'
import { AvailableThemes } from '@shared/types'

export function OutCallNotAnsweredIcon() {
  const [theme, _] = useStoreState<AvailableThemes>('theme')
  return (
    <svg
      viewBox="0 0 384 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-4 max-h-4"
    >
      <path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        fill={`${parseThemeToClassName(theme) === 'dark' ? '#EF4444' : '#B91C1C'}`}
      />
    </svg>
  )
}
