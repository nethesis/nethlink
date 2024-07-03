// Copyright (C) 2023 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 *
 * The Modal component shows elements in foreground
 *
 * @param show - The parameter to show the modal.
 * @param size - The size of the modal.
 * @param focus - The size of the modal.
 * @param onClose - The size of the modal.
 * @param afterLeave - The callback for the after leave event.
 *
 */

import { FC, ComponentProps, PropsWithChildren, RefObject } from 'react'
import { Fragment, createRef } from 'react'
import { ModalContent } from './ModalContent'
import { ModalActions } from './ModalActions'
import { Transition, Dialog } from '@headlessui/react'
import classNames from 'classnames'
import { useTheme } from '@renderer/theme/Context'
import { cleanClassName } from '@renderer/utils'

export interface ModalProps extends PropsWithChildren<ComponentProps<'div'>> {
  show?: boolean
  size?: 'base' | 'large'
  focus?: RefObject<HTMLElement>
  onClose: () => void
  afterLeave?: () => void
  themeMode: string
}

const ModalComponent: FC<ModalProps> = ({
  children,
  show,
  size = 'base',
  focus = createRef(),
  onClose,
  className,
  afterLeave,
  themeMode,
  ...props
}) => {
  const { modal: theme } = useTheme().theme
  const cleanProps = cleanClassName(props)

  return (
    <Transition.Root show={show} as={Fragment} afterLeave={() => afterLeave && afterLeave()}>
      <Dialog
        as="div"
        className={classNames(themeMode, 'relative', 'z-50', className)}
        onClose={() => onClose()}
        initialFocus={focus && focus}
        {...cleanProps}
      >
        <Transition.Child as={Fragment} {...theme.panel.transition}>
          <div className={classNames(theme.background.base, 'rounded-b-lg top-[40px] h-[calc(100vh-40px)] w-[calc100vw]')} />
        </Transition.Child>
        <div className="
        fixed inset-0 z-50
        overflow-y-auto
        top-[40px]
        scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-thumb-opacity-50 scrollbar-track-gray-200 dark:scrollbar-track-gray-900 scrollbar-track-rounded-full scrollbar-track-opacity-25
        ">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} {...theme.background.transition}>
              <Dialog.Panel className={theme.panel.base}>{children}</Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

ModalComponent.displayName = 'Modal'
ModalContent.displayName = 'Modal.Content'
ModalActions.displayName = 'Modal.Actions'

export const Modal = Object.assign(ModalComponent, {
  Content: ModalContent,
  Actions: ModalActions
})
