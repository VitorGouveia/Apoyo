import { ReactNode, useCallback, useEffect, useState } from "react"
import { createContext } from "use-context-selector"

import { api } from "../services/api"

type User = {
  id: string
  email: string
  role: "client" | "support"
}

type CreateUserProps = {
  email: string
}

type Connection = {
  id: number
}

export type Message = {
  id: number
  text: string
  userId: string
  connectionId: number
  createdAt: string
  updatedAt: string
  user: { role: "client" | "support" }
}

type UserContextProps = {
  user: User | null
  connection: Connection | null

  createClient: (data: CreateUserProps) => Promise<User>
  createSupport: (data: CreateUserProps) => Promise<void>

  createConnection: (data: { clientId: string }) => Promise<Connection>

  sendMessage: (data: { text: string }) => Promise<Message>
  getMessages: (data: { connectionId: number }) => Promise<Message[]>
}

export const UserContext = createContext({} as UserContextProps)

type UserContextProviderProps = {
  children: ReactNode
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    // search for connection
    const userId = localStorage.getItem("@apoyo:id")
    const connectionId = localStorage.getItem("@apoyo:connectionId")

    if (!userId || !connectionId) {
      console.log("returning null")
      return
    }

    const searchForClient = async () => {
      const { data } = await api.get<User>(`/clients/${userId}`)

      if (!data) {
        console.log("user doesnot exist anymore")
        return
      }

      setUser(data)
    }

    const searchForConnection = async () => {
      const { data } = await api.get<Connection[]>(`/connections/${userId}`)

      const lastConnection = data.find(
        (connection) => connection.id === Number(connectionId)
      )
      if (!lastConnection) {
        console.log("last connection doesnt exist anymore")
      }

      lastConnection && setConnection(lastConnection)
    }

    searchForClient()
    searchForConnection()
  }, [])

  const createClient = useCallback(async ({ email }: CreateUserProps) => {
    const client = await api.post<User>("/clients", {
      email,
    })

    setUser(client.data)

    localStorage.setItem("@apoyo:id", client.data.id)

    return client.data
  }, [])

  const createSupport = useCallback(async () => {}, [])

  const getMessages = useCallback(
    async ({ connectionId }: { connectionId: number }) => {
      const messages = await api.get<Message[]>(`/messages/${connectionId}`)

      return messages.data
    },
    []
  )

  const createConnection = useCallback(
    async ({ clientId }: { clientId: string }) => {
      const connection = await api.post<Connection>("/connections", {
        clientId,
      })

      setConnection(connection.data)

      localStorage.setItem("@apoyo:connectionId", String(connection.data.id))

      return connection.data
    },
    []
  )

  const sendMessage = useCallback(
    async ({ text }: { text: string }) => {
      const message = await api.post<Message>("/messages", {
        connectionId: connection?.id,
        userId: user?.id,
        text,
      })

      return message.data
    },
    [connection]
  )

  return (
    <UserContext.Provider
      value={{
        user,
        sendMessage,
        getMessages,
        createClient,
        createSupport,
        createConnection,
        connection,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
