import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  icon?: LucideIcon
}

const baseClasses =
  'flex cursor-pointer items-center justify-center font-medium text-sm gap-2 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80'

const sizeClasses = {
  sm: 'px-4 py-2',
  md: 'px-4 py-3',
}

const variantClasses = {
  primary: 'bg-primary text-primary-foreground font-semibold rounded-xl',
  secondary: 'bg-secondary-button border border-border rounded-3xl',
  ghost: 'rounded-lg text-foreground',
  danger:
    'bg-red-500 text-primary-foreground border border-transparent rounded-3xl',
}

export function Button({
  variant,
  size = 'md',
  icon: Icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  )
}
