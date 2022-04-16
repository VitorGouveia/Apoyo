import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react"

import styles from "./styles.module.scss"

export type HelpModalHandles = {
  toggleModal: () => void
  closeModal: () => void
  open: boolean
}

type HelpModalProps = {
  children: (props: { open: boolean }) => ReactNode
}

const HelpModal: React.ForwardRefRenderFunction<
  HelpModalHandles,
  HelpModalProps
> = ({ children }, ref) => {
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
    }
  })

  return (
    <div aria-hidden={!open} className={styles.container}>
      {children({ open })}
    </div>
  )
}

export default forwardRef(HelpModal)
