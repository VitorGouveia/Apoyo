import React, {
  FormEvent,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { FiMessageSquare, FiSend } from "react-icons/fi"
import { motion } from "framer-motion"
import { useContext } from "use-context-selector"
import { FiArrowLeft } from "react-icons/fi"

import { UserContext, Message } from "../../context/user"
import HelpModal, { HelpModalHandles } from "../../components/help-modal"
import { Button } from "../../components/button"
import { useOnClickOutside } from "../../hooks/use-on-click-outside"
import { api } from "../../services/api"

import styles from "./styles.module.scss"
import { useInView } from "react-intersection-observer"
import { CSSTransition } from "react-transition-group"

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

const timeout = 500

const Home: React.FC = () => {
  const helpModalRef = useRef<HelpModalHandles>(null)
  const helpModalContainer = useRef<HTMLDivElement>(null)
  const helpModalContent = useRef<HTMLDivElement>(null)

  const {
    connection,
    createClient,
    user,
    createConnection,
    getMessages,
    sendMessage,
  } = useContext(UserContext)

  const [activeMenu, setActiveMenu] = useState("main")
  const [menuHeight, setMenuHeight] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [hasEnteredInformation, setHasEnteredInformation] =
    useState<boolean>(false)

  useEffect(() => {
    if (connection) {
      setHasEnteredInformation(true)

      getMessages({
        // fetch messages about that account
        connectionId: connection.id,
      }).then((messages) => setMessages(messages))
    }
  }, [connection])

  useEffect(() => {
    setMenuHeight(
      (helpModalRef.current?.element?.current!.firstChild! as HTMLElement)
        .offsetHeight > 600
        ? 600
        : (helpModalRef.current?.element?.current!.firstChild! as HTMLElement)
            .offsetHeight
    )
  }, [])

  useOnClickOutside(helpModalContainer, () => {
    helpModalRef.current?.closeModal()
    setTimeout(() => {
      setActiveMenu("main")
    }, 300)
  })

  function calcHeight(element: HTMLElement) {
    const height = element.offsetHeight

    height > 600 ? setMenuHeight(600) : setMenuHeight(height)
  }

  const handleSubmitInformationForm = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()

      // if account doesn't exist, create a new one
      const localAccountID = localStorage.getItem("@apoyo:id")

      if (!localAccountID) {
        // create account and store id - check for existing user
        const { id: clientId } = await createClient({
          email: emailInput,
        })

        // create connection
        const conn = await createConnection({
          clientId,
        })

        const messages = await getMessages({
          connectionId: conn.id,
        })

        // fetch messages about that account
        setMessages(messages)
      }

      setHasEnteredInformation(true)
      setMenuHeight(600)
    },
    [emailInput, connection]
  )

  useEffect(() => {
    const callback = () => {
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
    <main>
      <div ref={helpModalContainer} className="help-modal-container">
        <HelpModal
          style={{
            height: `calc(${menuHeight || 600}px)`,
          }}
          className="dropdown"
          ref={helpModalRef}
        >
          {({ open }) => {
            return (
              <>
                <CSSTransition
                  in={activeMenu === "main"}
                  timeout={timeout}
                  classNames="menu-primary"
                  unmountOnExit
                  onEnter={calcHeight}
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      ref={helpModalContent}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      <motion.div className={styles.headingContainer}>
                        <div>
                          <img src="/rocketseat.svg" alt="Rocketseat Logo" />
                        </div>
                        <motion.h1 variants={itemAnimation}>
                          Olá, tudo bem?
                        </motion.h1>
                        <motion.p variants={itemAnimation}>
                          Conta pra gente sua dúvida. Como podemos te ajudar?
                          Lembrando que para dar continuidade ao seu
                          atendimento, poderemos solicitar alguns dados
                          pessoais.
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
                        <Button
                          onClick={() => {
                            setActiveMenu("registration")
                            setMenuHeight(600)
                          }}
                        >
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
                          O que é o Explorer?
                        </motion.strong>
                        <motion.div variants={itemAnimation}>
                          <motion.p>
                            O Explorer é o programa que vai te ensinar a se
                            posicionar como um profissional de programação e
                            acessar a sua primeira oportunidade no mercado.
                          </motion.p>
                        </motion.div>
                      </motion.div>
                      <motion.div className={styles.card}>
                        <motion.h5 variants={itemAnimation}>FAQ</motion.h5>
                        <motion.div
                          className={styles.linkGroup}
                          variants={itemAnimation}
                        >
                          <a
                            onClick={() =>
                              setActiveMenu("discover-ignore-experts")
                            }
                          >
                            Qual é a diferença entre Discover, Ignite e Experts
                            Club?
                          </a>
                          <a onClick={() => setActiveMenu("suggest-content")}>
                            Como posso sugerir um conteúdo?
                          </a>
                          <a onClick={() => setActiveMenu("discover-content")}>
                            O Discover receberá novos conteúdos?
                          </a>
                          <a onClick={() => setActiveMenu("cancel-course")}>
                            Como faço para cancelar o curso "x"?
                          </a>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === "registration"}
                  timeout={timeout}
                  classNames="menu-secondary"
                  unmountOnExit
                  onEnter={
                    !hasEnteredInformation
                      ? calcHeight
                      : () => setMenuHeight(600)
                  }
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      {!hasEnteredInformation && (
                        <>
                          <h5 style={{ fontSize: "1.4rem" }}>
                            Insira o seu e-mail para receber atualizações na sua
                            resposta
                          </h5>

                          <form onSubmit={handleSubmitInformationForm}>
                            <input
                              onChange={(event) => {
                                setEmailInput(event.target.value)
                              }}
                              type="email"
                              placeholder="Your e-mail"
                              required
                            />

                            <Button
                              type="reset"
                              onClick={() => setActiveMenu("main")}
                            >
                              back
                            </Button>

                            <Button type="submit">submit</Button>
                          </form>
                        </>
                      )}

                      {hasEnteredInformation && (
                        <>
                          <header className={styles.header}>
                            <Button onClick={() => setActiveMenu("main")}>
                              <FiArrowLeft size={16} />
                            </Button>

                            <strong>Help Center</strong>
                          </header>

                          <div
                            style={{
                              height: "345px",
                              overflowY: "auto",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            {messages.map(({ id, user, text }) => {
                              return (
                                <div
                                  key={id}
                                  data-user={
                                    user.role === "client"
                                      ? "sender"
                                      : "receiver"
                                  }
                                  className={styles.message}
                                >
                                  <p>{text}</p>
                                </div>
                              )
                            })}
                          </div>

                          <footer className={styles.footer}>
                            <input
                              onChange={(event) =>
                                setMessageInput(event.target.value)
                              }
                              type="text"
                              placeholder="send my message"
                            />
                            <Button
                              onClick={async () => {
                                const message = await sendMessage({
                                  text: messageInput,
                                })
                                console.log(message)
                                setMessages((messages) => [
                                  ...messages,
                                  { ...message, user: { role: "client" } },
                                ])
                              }}
                            >
                              send msg
                            </Button>
                            <Button onClick={() => setActiveMenu("main")}>
                              back
                            </Button>
                          </footer>
                        </>
                      )}
                    </motion.div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === "discover-ignore-experts"}
                  timeout={timeout}
                  classNames="menu-secondary"
                  unmountOnExit
                  onEnter={calcHeight}
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      <p>discover-ignore-experts</p>
                      <Button onClick={() => setActiveMenu("main")}>
                        go back
                      </Button>
                    </motion.div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === "suggest-content"}
                  timeout={timeout}
                  classNames="menu-secondary"
                  unmountOnExit
                  onEnter={calcHeight}
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      <p>suggest</p>
                      <Button onClick={() => setActiveMenu("main")}>
                        go back
                      </Button>
                    </motion.div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === "discover-content"}
                  timeout={timeout}
                  classNames="menu-secondary"
                  unmountOnExit
                  onEnter={calcHeight}
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      <p>discover content</p>
                      <Button onClick={() => setActiveMenu("main")}>
                        go back
                      </Button>
                    </motion.div>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={activeMenu === "cancel-course"}
                  timeout={timeout}
                  classNames="menu-secondary"
                  unmountOnExit
                  onEnter={calcHeight}
                >
                  <div>
                    <motion.div
                      className={styles.container}
                      initial={"hidden"}
                      animate={open ? "visible" : "hide"}
                      variants={parentAnimation}
                    >
                      <p>cancel course</p>
                      <Button onClick={() => setActiveMenu("main")}>
                        go back
                      </Button>
                    </motion.div>
                  </div>
                </CSSTransition>
              </>
            )
          }}
        </HelpModal>

        <Button
          onClick={() => {
            helpModalRef.current?.toggleModal()
          }}
          floating
        >
          <FiMessageSquare size={32} />
        </Button>
      </div>
    </main>
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
