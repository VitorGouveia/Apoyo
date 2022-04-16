import React, { memo, useEffect, useRef } from "react"
import { FiMessageSquare, FiSend } from "react-icons/fi"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import HelpModal, { HelpModalHandles } from "../../components/help-modal"
import { Button } from "../../components/button"
import { useOnClickOutside } from "../../hooks/use-on-click-outside"

import styles from "./styles.module.scss"
import { useInView } from "react-intersection-observer"

const scale = (
  inputY: number,
  yRange: [number, number],
  xRange: [number, number]
) => {
  const [xMin, xMax] = xRange
  const [yMin, yMax] = yRange

  const percent = (inputY - yMin) / (yMax - yMin)
  const outputX = percent * (xMax - xMin) + xMin

  return outputX
}

const Home: React.FC = () => {
  const helpModalRef = useRef<HelpModalHandles>(null)
  const helpModalContainer = useRef<HTMLDivElement>(null)
  const helpModalContent = useRef<HTMLDivElement>(null)

  const parentAnimation = {
    hidden: { opacity: 1, scale: 0 },
    hide: {
      opacity: 0,
      scale: 1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { y: 5, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  useOnClickOutside(helpModalContainer, () =>
    helpModalRef.current?.closeModal()
  )

  useEffect(() => {
    const callback = (event: Event) => {
      // console.log(helpModalContent.current?.scrollTop)
      // console.log(98)
      const headingElement = helpModalContent.current!
        .children[0] as HTMLElement

      // scale down the value fo the current scroll position to use in opacity
      // scale with range 100% - 0%
      headingElement.style!.opacity = `${scale(
        helpModalContent.current?.scrollTop!,
        [0, 98 * 1],
        [100, 0]
      )}%`

      // scale down the value of the current scroll position to use in translate
      // scale with range 0px - 30px
      headingElement.style.transform = `translateY(${scale(
        helpModalContent.current?.scrollTop!,
        [0, 38],
        [0, 30]
      )}px)`
    }

    helpModalContent.current?.addEventListener("scroll", callback)

    return () => {
      helpModalContent.current?.removeEventListener("scroll", callback)
    }
  }, [])

  return (
    <div>
      <p>home</p>

      <div ref={helpModalContainer} className="help-modal-container">
        <HelpModal ref={helpModalRef}>
          {({ open }) => {
            return (
              <motion.div
                ref={helpModalContent}
                initial="hidden"
                animate={open ? "visible" : "hide"}
                variants={parentAnimation}
                className={styles.container}
              >
                <motion.div className={styles.headingContainer}>
                  <div>
                    <img src="/rocketseat.svg" alt="Rocketseat Logo" />
                  </div>
                  <motion.h1 variants={itemAnimation}>Olá, tudo bem?</motion.h1>
                  <motion.p variants={itemAnimation}>
                    Conta pra gente sua dúvida. Como podemos te ajudar?
                    Lembrando que para dar continuidade ao seu atendimento,
                    poderemos solicitar alguns dados pessoais.
                  </motion.p>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.strong variants={itemAnimation}>
                    Iniciar uma conversa
                  </motion.strong>

                  <motion.div variants={itemAnimation}>
                    <motion.p>
                      tempo de resposta:{" "}
                      <motion.strong>alguns minutos</motion.strong>
                    </motion.p>
                  </motion.div>

                  <Button>
                    <FiSend /> Envie uma mensagem
                  </Button>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.strong variants={itemAnimation}>
                    Como saber tudo sobre o show do justin bieber?
                  </motion.strong>

                  <motion.div variants={itemAnimation}>
                    <motion.p>
                      não se preocupe! todas as informações estão aq
                    </motion.p>
                  </motion.div>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.strong variants={itemAnimation}>
                    Como saber tudo sobre o show do justin bieber?
                  </motion.strong>

                  <motion.div variants={itemAnimation}>
                    <motion.p>
                      não se preocupe! todas as informações estão aq
                    </motion.p>
                  </motion.div>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.strong variants={itemAnimation}>
                    Como saber tudo sobre o show do justin bieber?
                  </motion.strong>

                  <motion.div variants={itemAnimation}>
                    <motion.p>
                      não se preocupe! todas as informações estão aq
                    </motion.p>
                  </motion.div>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.strong variants={itemAnimation}>
                    Como saber tudo sobre o show do justin bieber?
                  </motion.strong>

                  <motion.div variants={itemAnimation}>
                    <motion.p>
                      não se preocupe! todas as informações estão aq
                    </motion.p>
                  </motion.div>
                </motion.div>

                <motion.div className={styles.card}>
                  <motion.h5 variants={itemAnimation}>FAQ</motion.h5>

                  <motion.div
                    className={styles.linkGroup}
                    variants={itemAnimation}
                  >
                    <Link to="/inter">
                      O app Inter é compativel com quais versões do android?
                    </Link>
                    <Link to="/">
                      Qual é o código do Inter e o número para desbloquear o
                      aplicativo?
                    </Link>
                    <Link to="/">
                      Como solicito o encerramento da minha conta?
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          }}
        </HelpModal>

        <Button onClick={() => helpModalRef.current?.toggleModal()} floating>
          <FiMessageSquare size={32} />
        </Button>
      </div>
    </div>
  )
}

export const SkeletonHome: React.FC = () => {
  return (
    <div>
      <p>LOADING HOMEPAGE.......</p>
    </div>
  )
}

export default memo(Home)
