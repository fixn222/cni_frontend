import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldValues,
  type Path,
} from "react-hook-form"

export const Form = FormProvider

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} {...props} />
}

export function FormControl({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext()

  const message = Object.values(errors)[0]?.message

  if (!message) return null

  return <p className="text-sm text-red-500">{String(message)}</p>
}
