import toast from 'react-hot-toast';
import chatIcon from '../assets/chatlogo.png';
import { useState } from 'react';
import { createRoom as createRoomApi } from '../services/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { joinChatApi } from '../services/RoomService';

const JoinCreateChat = () => {

  const [detail, setDetail] = useState({
    roomId: "",
    userName: "Praveen",
  });

  const { currentUser, roomId, connected, setCurrentUser, setRoomId, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
      setDetail({
        ...detail,
        [event.target.name]: event.target.value,
      })
  }

  function validateForm(){
    if(detail.roomId === "" || detail.userName === ""){
        toast.error("Invalid Input !!");
        return false;
    }
    return true;
  }

   async function joinChat(){
    if(validateForm()){
        //navigate to chat page
        try{
          const room=await joinChatApi(detail.roomId);
          toast.success("Joined room successfully !!");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate('/chat');
        }
        catch(error){
        if(error.status === 404){
        toast.error(error.response.data);
        }
        else{
          toast.error("Please enter correct Room ID !!");
        }
        }
    }
   }

   async function createRoom(){
    if(validateForm()){
        //navigate to create room page
        try{
             const response = await createRoomApi(detail.roomId);
             console.log(response);
              toast.success("Room created successfully !!");
              setCurrentUser(detail.userName);
              setRoomId(detail.roomId);
              setConnected(true);
              navigate('/chat');
        }
        catch(error){
            if(error.status === 400){
                toast.error("Room ID already exists. Please choose a different ID.");
            }    
            else{
                toast.error("Error creating room. Please try again.");
            }
  }
}
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 transition-colors">
      <div className="bg-gray-800 border border-gray-700 flex flex-col gap-6 p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <div>
            <img src={chatIcon} alt="Chat Icon" className="w-16 h-16 mx-auto mb-4" />
        </div>

        <h1 className="text-2xl font-semibold text-center text-white">
          Join or Create a Chat Room
        </h1>
        {/*name div*/}
        <div>
          <label 
            htmlFor="name" 
            className="block font-medium mb-2 text-gray-300"
          >
            Your Name
          </label>
          
          <input
            type="text"
            id="name"
            name="userName"
            value={detail.userName}
            onChange={handleFormInputChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg 
                       bg-gray-700 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/*room id div*/}
        <div>
          <label 
            htmlFor="roomId" 
            className="block font-medium mb-2 text-gray-300"
          >
            Room ID / New Room ID
          </label>
          
          <input
            type="text"
            id="roomId"
            name="roomId"
            value={detail.roomId}
            onChange={handleFormInputChange}
            placeholder="Enter room ID or create a new one"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg 
                       bg-gray-700 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/*buttons div*/}
        <div className="flex justify-center gap-4 mt-4">
            <button onClick={joinChat} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Join Room
            </button>
            <button onClick={createRoom} className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">
                Create Room
            </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;


