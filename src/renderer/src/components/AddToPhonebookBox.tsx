import { useState, useEffect } from 'react'
import { Button, TextInput } from './Nethesis'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner as LoadingIcon } from '@fortawesome/free-solid-svg-icons'
import { ContactType } from '@shared/types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { t } from 'i18next'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export interface AddToPhonebookBoxProps {
  searchText?: string
  selectedNumber?: string
  selectedCompany?: string
  onCancel: () => void
  handleAddContactToPhonebook: (contact: ContactType) => Promise<void>
}

export function AddToPhonebookBox({
  searchText,
  selectedNumber,
  selectedCompany,
  onCancel,
  handleAddContactToPhonebook
}: AddToPhonebookBoxProps) {
  const baseSchema = z.object({
    privacy: z.string(),
    extension: z.string(),
    workphone: z.string(),
    cellphone: z.string(),
    workemail: z.string(),
    notes: z.string()
  })

  const resultSchema = z
    .discriminatedUnion('type', [
      z.object({
        type: z.literal('person'),
        name: z
          .string()
          .trim()
          .min(1, `${t('Common.This field is required')}`),
        company: z.string().trim()
      }),
      z.object({
        type: z.literal('company'),
        name: z.string().trim(),
        company: z
          .string()
          .trim()
          .min(1, `${t('Common.This field is required')}`)
      })
    ])
    .and(baseSchema)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors }
  } = useForm<ContactType>({
    defaultValues: {
      privacy: '',
      type: '',
      name: '',
      company: '',
      extension: '',
      workphone: '',
      cellphone: '',
      workemail: '',
      notes: ''
    },
    resolver: zodResolver(resultSchema)
  })

  const watchType = watch('type')

  useEffect(() => {
    !!errors.name && trigger('name')
    !!errors.company && trigger('company')
  }, [watchType])

  const onSubmitForm: SubmitHandler<ContactType> = (data) => {
    handleSave(data)
  }

  function containsOnlyNumber(text: string) {
    return /^\d+$/.test(text)
  }

  useEffect(() => {
    reset()
    setValue('privacy', 'public')
    setValue('type', 'person')

    if (searchText !== undefined) {
      if (containsOnlyNumber(searchText)) {
        setValue('extension', searchText)
      } else {
        setValue('name', searchText)
      }
    }
    //Caso in cui ho selezionato da create in MISSEDCALL
    if (selectedCompany) {
      setValue('company', selectedCompany)
    }
    if (selectedNumber) {
      setValue('extension', selectedNumber)
    }
  }, [])

  function handleSave(data: ContactType) {
    //NETHVOICE usa il valore '-' quando si inserisce una company che e' priva di nome
    //data.name === '' puo' essere vera solo nel caso in cui si inserisce una company
    if (watchType === 'company') {
      data.name = '-'
    }
    setIsLoading(true)
    handleAddContactToPhonebook(data)
      .catch((error) => {
        //TODO: gestione errore inserimento
        console.error(error)
      })
      .finally(() => {
        setIsLoading(false)
        reset()
      })
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center py-1 border border-t-0 border-r-0 border-l-0 dark:border-gray-500 border-gray-300 max-h-[28px] px-5">
        <h1 className="font-semibold">{t('Phonebook.Add to Phonebook')}</h1>
      </div>
      <form
        className="flex flex-col gap-4 p-2 h-full overflow-y-auto max-h-[248px] px-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmitForm)(e)
        }}
      >
        <label className="flex flex-col gap-2 dark:text-gray-50 text-gray-900">
          <p className="font-medium">{t('Phonebook.Visibility')}</p>
          <div className="flex flex-row gap-8 items-center">
            <div className="flex flex-row gap-2 items-center">
              <TextInput {...register('privacy')} type="radio" value="public" name="visibility" />
              <p className="whitespace-nowrap font-normal">{t('Phonebook.All')}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <TextInput {...register('privacy')} type="radio" value="private" name="visibility" />
              <p className="whitespace-nowrap font-normal">{t('Phonebook.Only me')}</p>
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-2 dark:text-gray-50 text-gray-900">
          <p className="font-medium">{t('Phonebook.Type')}</p>
          <div className="flex flex-row gap-8 items-center">
            <div className="flex flex-row gap-2 items-center">
              <TextInput {...register('type')} type="radio" value="person" name="type" />
              <p className="whitespace-nowrap font-normal">{t('Phonebook.Person')}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <TextInput {...register('type')} type="radio" value="company" name="type" />
              <p className="whitespace-nowrap font-normal">{t('Phonebook.Company')}</p>
            </div>
          </div>
        </label>

        {watchType === 'person' ? (
          <>
            <TextInput
              {...register('name')}
              type="text"
              className={`font-normal ${errors.name?.message ? `mb-2` : ``}`}
              label={t('Phonebook.Name') as string}
              helper={errors.name?.message || undefined}
              error={!!errors.name?.message}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(onSubmitForm)(e)
                }
              }}
            />
          </>
        ) : null}
        <TextInput
          {...register('company')}
          type="text"
          className={`font-normal ${errors.company?.message ? `mb-2` : ``}`}
          label={t('Phonebook.Company') as string}
          helper={errors.company?.message || undefined}
          error={!!errors.company?.message}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <TextInput
          {...register('extension')}
          type="tel"
          minLength={3}
          onChange={(e) => {
            setValue('extension', e.target.value.replace(/\D/g, ''))
          }}
          className="font-normal"
          label={t('Phonebook.Phone number') as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <TextInput
          {...register('workphone')}
          type="tel"
          minLength={3}
          onChange={(e) => {
            setValue('workphone', e.target.value.replace(/\D/g, ''))
          }}
          className="font-normal"
          label={t('Phonebook.Work phone') as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <TextInput
          {...register('cellphone')}
          type="tel"
          minLength={3}
          onChange={(e) => {
            setValue('cellphone', e.target.value.replace(/\D/g, ''))
          }}
          className="font-normal"
          label={t('Phonebook.Mobile phone') as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <TextInput
          {...register('workemail')}
          type="email"
          className="font-normal"
          label={t('Phonebook.Email') as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <TextInput
          {...register('notes')}
          type="text"
          className="font-normal"
          label={t('Phonebook.Notes') as string}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(onSubmitForm)(e)
            }
          }}
        />

        <div className="flex flex-row gap-4 justify-end">
          <Button variant="ghost" onClick={() => onCancel()}>
            <p className="dark:text-blue-500 text-blue-600 font-medium">{t('Common.Cancel')}</p>
          </Button>
          <Button type="submit" className="dark:bg-blue-500 bg-blue-600 gap-3">
            <p className="dark:text-gray-900 text-gray-50 font-medium">{t('Common.Save')}</p>
            {isLoading && (
              <FontAwesomeIcon
                icon={LoadingIcon}
                className="dark:text-gray-900 text-gray-50 animate-spin"
              />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
