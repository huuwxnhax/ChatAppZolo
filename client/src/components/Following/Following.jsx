import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests";
import "./Following.css";
import { createChat, findChat } from "../../api/ChatRequests";
import Toaster from "./Toaster";
import { updateChatData } from "../../actions/ChatAction";

const Following = ({ handleSelectUser, closeModal }) => {
  const [userFollowing, setUserFollowing] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
  const [hasChat, setHasChat] = useState(false);
  const chatdata = useSelector((state) => state.chatReducer.chatUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFollowing = async () => {
      const { data } = await getUser(user._id);
      console.log(data);
      const following = data.following;
      // console.log(following);
      setUserFollowing(following);

      const followingInfoPromises = following.map(async (userId) => {
        const userInfo = await getUser(userId);
        // console.log("UserInfor:"  + userInfo);

        return userInfo;
      });
      try {
        const followingDetailsData = await Promise.all(followingInfoPromises);
        setFollowingDetails(followingDetailsData);
        console.log(followingDetailsData);
      } catch (error) {
        console.error("Error fetching following details:", error);
      }
    };
    fetchFollowing();
  }, [user._id]);

  const handleCreateChat = async (userId) => {
    try {
      // Check if a chat already exists between the current user and the selected user
      const existingChat = await findChat(user._id, userId);
      console.log(existingChat);
      if (existingChat.data !== null) {
        // If a chat exists, navigate to that chat
        // console.log(`Redirecting to existing chat with ID: ${existingChat.data._id}`);
        // setHasChat(true);
        handleSelectUser(existingChat.data);
      } else {
        // If a chat doesn't exist, create a new chat
        const { data } = await createChat({
          senderId: user._id,
          receiverId: userId,
        });

        // Check if the chat was successfully created
        if (data._id) {
          // Update the chats state with the new chat
          dispatch(updateChatData([...chatdata, data]));
          handleSelectUser(data);
          // console.log(`Redirecting to new chat with ID: ${data._id}`);
        } else {
          console.error("Failed to create or redirect to chat");
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error creating or redirecting to chat:", error);
    }
  };

  return (
    <div className="drawer-container">
      <div className="drawer-header">
        <h3>Following</h3>
      </div>
      <div className="drawer-body">
        {followingDetails.map((person) => (
          <div
            onClick={() => handleCreateChat(person.data._id)}
            className="drawer-item"
            key={person.data._id}
          >
            <img
              src={
                person.data.profilePicture
                  ? person.data.profilePicture
                  : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
              }
              alt="Profile"
              className="followerImage"
              style={{ width: "50px", height: "50px" }}
            />
            <div className="drawer-infor">
              <span className="drawer-name">
                {person.data.firstname} {person.data.lastname}
              </span>
              <span className="drawer-email">{person.data.username}</span>
            </div>
          </div>
        ))}
      </div>
      {hasChat && <Toaster msg="You already have a chat with this user." />}
    </div>
  );
};

export default Following;
