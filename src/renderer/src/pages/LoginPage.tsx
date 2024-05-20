import { Account } from '@shared/types'
import classNames from 'classnames'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import spinner from '../assets/loginPageSpinner.svg'
import darkHeader from '../assets/nethlinkDarkHeader.svg'
import lightHeader from '../assets/nethlinkLightHeader.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft as ArrowIcon,
  faEye as EyeIcon,
  faEyeSlash as EyeSlashIcon,
  faXmark as CrossIcon,
  faXmarkCircle as ErrorIcon
} from '@fortawesome/free-solid-svg-icons'
import { TextInput } from '@renderer/components/Nethesis/TextInput'
import { DisplayedAccountLogin } from '@renderer/components/DisplayedAccountLogin'
import { useInitialize } from '@renderer/hooks/useInitialize'
import { log } from '@shared/utils/logger'
import { t } from 'i18next'
import { Button } from '@renderer/components/Nethesis'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import './LoginPage.css'

export interface LoginPageProps {
  themeMode: string
}

type LoginData = {
  host: string
  username: string
  password: string
}

const NEW_ACCOUNT = 'New Account'

export function LoginPage({ themeMode }: LoginPageProps) {
  const [availableAccounts, setAvailableAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | typeof NEW_ACCOUNT>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<Error | undefined>(undefined)
  const [pwdVisible, setPwdVisible] = useState<boolean>(false)
  const windowHeight = useRef<number>(0)
  const loginWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const schema: z.ZodType<LoginData> = z.object({
    host: z
      .string()
      .trim()
      .min(1, `${t('Common.This field is required')}`),
    username: z
      .string()
      .trim()
      .min(1, `${t('Common.This field is required')}`),
    password: z
      .string()
      .trim()
      .min(1, `${t('Common.This field is required')}`)
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    formState: { errors }
  } = useForm<LoginData>({
    defaultValues: {
      host: '',
      username: '',
      password: ''
    },
    resolver: zodResolver(schema)
  })

  const isFirstLogin = availableAccounts.length === 0

  useInitialize(() => {
    window.api.onLoadAccounts((accounts: Account[]) => {
      setAvailableAccounts(accounts)
      log(windowHeight.current)
      setTimeout(() => {
        log(loginWindowRef.current?.clientHeight)
        windowHeight.current = loginWindowRef.current?.clientHeight || 0
      }, 250)
    })
  }, true)

  function resizeThisWindow(h: number) {
    windowHeight.current = h
    const finalH = h + (loginError ? 100 : 0)
    window.api.resizeLoginWindow(finalH)
  }

  function hideLoginWindow() {
    setLoginError(() => undefined)
    window.api.hideLoginWindow()
  }

  function setFormValues(data: LoginData) {
    setValue('host', data.host)
    setValue('username', data.username)
    setValue('password', data.password)
  }

  async function handleLogin(data: LoginData) {
    setLoginError(undefined)
    if (selectedAccount === NEW_ACCOUNT) {
      window.api.resizeLoginWindow(620)
    } else {
      if (!isFirstLogin) {
        window.api.resizeLoginWindow(515)
      } else {
        //Aggiunto per via del possibile banner di errore
        window.api.resizeLoginWindow(570)
      }
    }

    const hostReg =
      /^(?:(https?:\/\/)?([^:/$]{1,})(?::(\d{1,}))?(?:($|\/(?:[^?#]{0,}))?((?:\?(?:[^#]{1,}))?)?(?:(#(?:.*)?)?|$)))$/g
    const res = hostReg.exec(data.host)
    if (res) {
      setIsLoading(true)
      const host = `${'https://'}${res[2]}`
      window.api
        .login(host, data.username, data.password)
        .catch((error) => {
          setFormValues(data)
          if (error.message === 'Unauthorized')
            setLoginError(new Error(t('Login.Wrong host or username or password')!))
          else setLoginError(error)
        })
        .finally(() => setIsLoading(false))
    } else {
      setLoginError(new Error(t('Login.Wrong host or username or password')!))
      setFormValues(data)
    }
  }

  const onSubmitForm: SubmitHandler<LoginData> = (data) => {
    handleLogin(data)
  }

  const focus = (selector: keyof LoginData) => {
    setTimeout(() => {
      setFocus(selector)
    }, 100)
  }

  const goBack = () => {
    setLoginError(undefined)
    setSelectedAccount(undefined)
  }

  useEffect(() => {
    if (selectedAccount) {
      if (selectedAccount === NEW_ACCOUNT) {
        resizeThisWindow(620)
        reset()
        focus('host')
      } else {
        resizeThisWindow(515)
        reset()
        setValue('host', selectedAccount.host)
        setValue('username', selectedAccount.username)
        focus('password')
      }
    } else {
      setLoginError(undefined)
      if (availableAccounts.length === 1) {
        resizeThisWindow(375)
      } else if (availableAccounts.length === 2) {
        resizeThisWindow(455)
      } else if (availableAccounts.length >= 3) {
        resizeThisWindow(535)
      }
      focus('host')
    }
  }, [availableAccounts, selectedAccount])

  const RenderError = () => {
    loginError && resizeThisWindow(windowHeight.current)
    return (
      !!loginError && (
        <div className="relative flex flex-col p-4 border-l-[3px] border-rose-500 bg-rose-100 rounded-md mb-8">
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={ErrorIcon} className="text-red-700" />
            <p className="font-medium text-[14px] leading-5 text-red-800">
              {t('Login.Login failed')}
            </p>
          </div>
          <p className="pl-6 font-normal text-[14px] leading-5 text-rose-700">
            {loginError?.message}
          </p>
        </div>
      )
    )
  }

  const DisplayAvailableAccount = () => {
    return (
      <div className="w-full mt-7">
        <p className="text-gray-900 dark:text-gray-100 text-[20px] leading-[30px] font-medium mb-2">
          {t('Login.Account List title')}
        </p>
        <p className="text-gray-900 dark:text-gray-100 text-[14px] leading-5 mb-7">
          {t('Login.Account List description')}
        </p>
        <div className="max-h-60 overflow-y-auto">
          {availableAccounts.map((account, idx) => {
            return (
              <DisplayedAccountLogin
                key={idx}
                account={account}
                imageSrc={account.data?.settings.avatar}
                handleClick={() => setSelectedAccount(account)}
              />
            )
          })}
        </div>
        <DisplayedAccountLogin handleClick={() => setSelectedAccount(NEW_ACCOUNT)} />
      </div>
    )
  }

  /* TODO rendere tutti questi componenti dei veri componenti */
  const LoginForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(onSubmitForm)(e)
      }}
    >
      <div className="mt-7">
        <p className="text-gray-900  dark:text-gray-100 text-[20px] leading-[30px] font-medium mb-2">
          {selectedAccount ? t('Login.Account List title') : t('Login.New Account title')}
        </p>
        <p className="text-gray-900 dark:text-gray-100 text-[14px] leading-5 mb-7">
          {selectedAccount
            ? t('Login.Account List description')
            : t('Login.New Account description')}
        </p>
        <RenderError />
        <div className="flex flex-col gap-7">
          {selectedAccount && selectedAccount !== NEW_ACCOUNT ? (
            <DisplayedAccountLogin
              account={selectedAccount}
              imageSrc={selectedAccount.data?.settings.avatar}
            />
          ) : (
            <>
              <TextInput
                {...register('host')}
                type="text"
                label={t('Login.Host') as string}
                helper={errors.host?.message || undefined}
                error={!!errors.host?.message}
                className="dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    submitButtonRef.current?.focus()
                    handleSubmit(onSubmitForm)(e)
                  }
                }}
              />
              <TextInput
                {...register('username')}
                type="text"
                label={t('Login.Username') as string}
                helper={errors.username?.message || undefined}
                error={!!errors.username?.message}
                className="dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    submitButtonRef.current?.focus()
                    handleSubmit(onSubmitForm)(e)
                  }
                }}
              />
            </>
          )}
          <TextInput
            {...register('password')}
            label={t('Login.Password') as string}
            type={pwdVisible ? 'text' : 'password'}
            icon={pwdVisible ? EyeIcon : EyeSlashIcon}
            onIconClick={() => setPwdVisible(!pwdVisible)}
            trailingIcon={true}
            helper={errors.password?.message || undefined}
            error={!!errors.password?.message}
            className="dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submitButtonRef.current?.focus()
                handleSubmit(onSubmitForm)(e)
              }
            }}
          />
          <button
            ref={submitButtonRef}
            type="submit"
            className={`w-full dark:bg-blue-500 bg-blue-700 dark:hover:bg-blue-300 hover:bg-blue-800 text-gray-50 dark:text-gray-950 rounded h-9 font-medium text-[14px] leading-5 cursor-pointer dark:focus:ring-2 dark:focus:ring-offset-2 dark:focus:ring-blue-200 dark:focus:ring-offset-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white`}
          >
            {t('Login.Sign in')}
          </button>
        </div>
      </div>
    </form>
  )

  return (
    <div
      className="h-[100vh] w-[100vw] bg-gray-50 dark:bg-gray-900 relative p-8 rounded-[10px] text-sm hide-scrollbar"
      ref={loginWindowRef}
    >
      <div className={classNames('h-full w-full')}>
        <div className="flex flex-row justify-between items-center">
          <img src={themeMode === 'dark' ? darkHeader : lightHeader} className="h-10"></img>
          <Button
            variant="ghost"
            className="pt-2 pr-1 pb-2 pl-1 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-200 dark:focus:ring-2 focus:ring-2 dark:focus:ring-blue-200 focus:ring-blue-500"
          >
            <FontAwesomeIcon
              icon={CrossIcon}
              className="h-5 w-5 dark:text-gray-50 text-gray-900"
              onClick={() => hideLoginWindow()}
            />
          </Button>
        </div>
        {availableAccounts.length > 0 && selectedAccount && (
          <Button
            variant="ghost"
            className="flex gap-3 items-center pt-2 pr-1 pb-2 pl-1 mt-6 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-200 dark:focus:ring-2 focus:ring-2 dark:focus:ring-blue-200 focus:ring-blue-500"
            onClick={goBack}
          >
            <FontAwesomeIcon
              icon={ArrowIcon}
              className="h-5 w-5 dark:text-blue-500 text-blue-700"
            />
            <p className="dark:text-blue-500 text-blue-700 font-medium">{t('Login.Back')}</p>
          </Button>
        )}
        {isFirstLogin || selectedAccount ? LoginForm : <DisplayAvailableAccount />}
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 bg-gray-50 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-75 h-full w-full select-none flex items-center justify-center rounded-[10px] z-[1000]">
          <img src={spinner} className="animate-spin"></img>
        </div>
      )}
    </div>
  )
}
