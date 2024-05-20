import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { userChatGroups } from "../../api/GroupRequests";

const Chat = () => {
  const dispatch = useDispatch();

  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);
  const chatdata = useSelector((state) => state.chatReducer.chatUsers);

  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState(null);
  // const [selectedUser, setSelectedUser] = useState(null);

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data: groupData } = await userChatGroups(user._id);
        const { data: individualData } = await userChats(user._id);

        setGroupChats(groupData);
        setChats(individualData);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id, chatdata]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
    socket.current.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
      console.log("Message Sent to socket: ", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
    });
    console.log("Message Received from socket to client 1");
  }, [socket]);

  useEffect(() => {
    socket.current.on("message-deleted", (data) => {
      setDeletedMessage(data);
      console.log("Message Received from socket to client 2");
    });
  }, [socket]);

  useEffect(() => {
    socket.current.on("group-deleted", (data) => {
      console.log("Group Deleted data from socket to client: ", data);
      const { groupId } = data;
      const updatedGroupChats = groupChats.filter(
        (group) => group._id !== groupId
      );
      setGroupChats(updatedGroupChats);
      setCurrentChat(null);
    });
  }, [socket, groupChats]);

  useEffect(() => {
    socket.current.on("group-created", (data) => {
      console.log("Group Created data from socket to client: ", data);
      const { groupChat } = data;
      setGroupChats([...groupChats, groupChat]);
    });
  }, [socket, groupChats]);

  const handleSelectUser = (userData) => {
    // Xử lý khi người dùng được chọn
    setCurrentChat(userData);
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const updateGroupChatList = async (groupId) => {
    try {
      const updatedGroupChats = groupChats.filter(
        (group) => group._id !== groupId
      );
      setGroupChats(updatedGroupChats);
      setCurrentChat(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  isGroup={false}
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}

            {groupChats.map((group) => (
              <div
                key={group._id}
                onClick={() => {
                  setCurrentChat(group);
                }}
              >
                <Conversation
                  isGroup={true}
                  data={group}
                  currentUser={user._id}
                  online={checkOnlineStatus(group)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons handleSelectUser={handleSelectUser} />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          groupChats={groupChats}
          updateGroupChatList={updateGroupChatList}
          deletedMessage={deletedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
