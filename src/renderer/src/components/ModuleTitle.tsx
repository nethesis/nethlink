import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./Nethesis"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { DefaultTFuncReturn } from "i18next"

export interface ModuleTitleProps {
  title: string | DefaultTFuncReturn,
  action?: () => void,
  actionText?: string | DefaultTFuncReturn,
  actionIcon?: IconProp

}
export const ModuleTitle = ({
  title,
  action,
  actionText,
  actionIcon
}: ModuleTitleProps) => {

  return (
    <div className="px-5">
      <div className="flex justify-between items-center pb-4 border border-t-0 border-r-0 border-l-0 dark:border-borderDark border-borderLight max-h-[28px]">
        <h1 className="font-medium text-[14px] leading-5 dark:text-titleDark text-titleLight">
          {title}
        </h1>
        {action && (
          <Button
            variant="ghost"
            className="flex gap-3 items-center pt-2 pr-1 pb-2 pl-1"
            onClick={action}
          >
            {actionIcon && <FontAwesomeIcon
              className="text-base dark:text-textBlueDark text-textBlueLight"
              icon={actionIcon}
            />}
            {actionText && <p className="dark:text-textBlueDark text-textBlueLight font-medium text-[14px] leading-5">
              {actionText}
            </p>
            }
          </Button>
        )}
      </div>
    </div>
  )
}
