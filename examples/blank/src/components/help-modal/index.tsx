import React, {
  CSSProperties,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import styles from "./styles.module.scss"

export type HelpModalHandles = {
  toggleModal: () => void
  closeModal: () => void
  open: boolean
  element: RefObject<HTMLDivElement>
}

type HelpModalProps = {
  children: (props: { open: boolean }) => ReactNode
  className: string
  style: CSSProperties
}

const HelpModal: React.ForwardRefRenderFunction<
  HelpModalHandles,
  HelpModalProps
> = ({ children, className, style }, ref) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  const toggleModal = useCallback(() => {
    setOpen((open) => !open)
  }, [setOpen])

  const closeModal = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useImperativeHandle(ref, () => {
    return {
      toggleModal,
      closeModal,
      open,
      element: modalRef,
    }
  })

  return (
    <div
      ref={modalRef}
      aria-hidden={!open}
      style={style}
      className={`${styles.container} ${className}`}
    >
      {children({ open })}
    </div>
  )
}

export default forwardRef(HelpModal)
