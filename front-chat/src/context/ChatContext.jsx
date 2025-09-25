import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
   
  return(
    <ChatContext.Provider value={{currentUser, setCurrentUser, roomId, setRoomId, connected, setConnected}}>
        {children}
    </ChatContext.Provider>
  )
}

const useChatContext = () => useContext(ChatContext);
export default useChatContext;