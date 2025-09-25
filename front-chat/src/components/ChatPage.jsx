import { MdSend } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { use, useEffect, useRef, useState } from "react";
import  useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import {Stomp} from "@stomp/stompjs"
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {

  const {roomId, currentUser, connected, setConnected, setRoomId, setcurrentUser} = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, roomId, currentUser]);

const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const inputRef = useRef(null);
const chatBoxRef = useRef(null);
const [stompClient, setStompClient] = useState(null);

//page init
//message ko load karna hai

useEffect(() => {
     async function loadMessages(){
      try{
        const response = await getMessages(roomId);
        setMessages(response);
      }catch(error){
        
      } 
    }

    if(connected)
    loadMessages();

  },[]);


  //scroll to bottom
  useEffect(() => {
    if(chatBoxRef.current)
    {
       chatBoxRef.current.scroll({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    })
    }
    
  },[messages]);

//stompClient ko init karna hai
//subscribe

    useEffect(() => {
  const connectWebSocket = () => {
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      setStompClient(client);

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        let body;

        if (message.isBinaryBody) {
          // decode Uint8Array to string
          body = new TextDecoder().decode(message._binaryBody);
        } else {
          body = message.body;
        }

        try {
          const newMessage = JSON.parse(body);
          setMessages((prev) => [...prev, newMessage]);
        } catch (e) {
          console.error("Failed to parse message:", body, e);
        }
      });
    });
  };

  connectWebSocket();
}, [roomId]);


//send message handle

  const sendMessage = () => {
    if(stompClient && connected && input.trim())
    {

      const message = {
      content: input,
      sender: currentUser,
      roomId: roomId,
    };

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
    setInput("");
    }
    
  };

  const leaveRoom = () => {
    if (stompClient) {
       toast.success("Disconnected");
      stompClient.disconnect();
      setConnected(false);
      setRoomId("");
      setcurrentUser("");
    }
    navigate("/");
  };

  const handleImageUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${baseURL}/upload`, {
      method: "POST",
      body: formData,
    });

    const url = await res.text(); // since backend returns plain URL string

    const message = {
      sender: currentUser,
      content: url,
      type: "image",
      roomId,
    };

    // send via websocket
    if (stompClient && connected) {
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
    }


  } catch (err) {
    console.error("Image upload failed", err);
  }
};



  return (
    <div className="min-h-screen bg-gray-900 text-white">
        {/* header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed w-full flex justify-around items-center px-6 py-4 shadow">
        {/* room name */}
        <div>
          <h1 className="text-xl font-medium">
            Room: <span>{roomId}</span>
          </h1>
        </div>

        {/* username */}
        <div>
          <h2 className="text-xl font-medium">
            User: <span>{currentUser}</span>
          </h2>
        </div>

        {/* leave button */}
        <div>
          <button onClick={leaveRoom} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            Leave Room
          </button>
        </div>
      </header>


       <main ref={chatBoxRef} className="py-20 w-2/3 bg-slate-600 mx-auto h-screen overflow-auto">
          {
            messages.map((message, index) => (
              <div key={index} className={`flex  ${message.sender === currentUser ? "justify-end" : "justify-start"} px-4 `}>
                      <div className={`my-2 ${message.sender === currentUser ? "bg-green-600" : "bg-blue-600"} p-2 max-w-xs rounded`}>
                <div className="flex flex-row gap-2">
                  <img className="h-10 w-10" src={"https://avatar.iran.liara.run/public"} alt=""/>
                <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">{message.sender}</p>
               {/* check if content is an image URL */}
      {message.content.startsWith("http") ? (
        <img src={message.content} alt="uploaded" className="rounded w-40 h-auto" />
      ) : (
        <p>{message.content}</p>
      )}
                <p className="text-xs text-gray-300">{timeAgo(message.timeStamp)}</p>
                </div>
                </div>
              </div>
              </div>
            ))
          }
       </main>
      


       {/* Chat input bar */}
<div className="fixed bottom-2 left-0 right-0 w-full flex justify-center items-center p-4">
  <div className="flex h-full gap-4 pr-10 rounded-full w-full max-w-2xl bg-gray-900 ">
    {/* Input field */}
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
       onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent newline in input
      sendMessage();       // call your send function
    }
  }}
      type="text"
      placeholder="Type your message..."
      className="flex-grow h-12 w-full px-4 bg-gray-700 border border-gray-600 rounded-full text-white outline-none"
    />

    {/* Buttons on the right */}
   <div className="flex items-center ml-2 space-x-2">
  {/* Attach / Image Upload Button */}
  <label className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition cursor-pointer">
    <MdAttachFile size={22} />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file); // your function to send image
      }}
      className="hidden" // hide the input
    />
  </label>

  {/* Send Text Button */}
  <button
    onClick={sendMessage}
    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
  >
    <MdSend size={22} />
  </button>
</div>

  </div>
</div>


    </div>
  );
};

export default ChatPage;
