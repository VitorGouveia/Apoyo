import { ButtonHTMLAttributes, memo, ReactNode } from "react"

import styles from "./styles.module.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  floating?: boolean
  active?: boolean
}

export const Button: React.FC<ButtonProps> = memo(
  ({ floating = false, children, active = false, ...props }) => {
    return (
      <button
        className={`
          ${styles.container}
          ${floating && styles.floating}
          ${active && styles.active}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)
