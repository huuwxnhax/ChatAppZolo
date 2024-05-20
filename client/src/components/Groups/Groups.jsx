import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser, getUser } from "../../api/UserRequests";
import "./Groups.css";
import { UilSearch } from "@iconscout/react-unicons";
import { createChatGroup } from "../../api/GroupRequests";
import { updateChatData } from "../../actions/ChatAction";
import { io } from "socket.io-client";

const Groups = ({ closeModal }) => {
  const [userFollowing, setUserFollowing] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
  const chatdata = useSelector((state) => state.chatReducer.chatUsers);

  const [persons, setPersons] = useState([]);

  const [nameGroup, setNameGroup] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);

  const dispatch = useDispatch();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8800");
  }, [user]);

  const handleChangeNameGroup = (e) => {
    setNameGroup(e.target.value);
  };

  const handleAddMember = (userId) => {
    if (addedUsers.includes(userId)) {
      // User already in the list, remove and set added to false
      setAddedUsers(addedUsers.filter((id) => id !== userId));
    } else {
      // User not in the list, add and set added to true
      setAddedUsers([...addedUsers, userId]);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    if (nameGroup.trim() === "") {
      alert("Please enter a group name");
      return false;
    }

    if (addedUsers.length < 2) {
      alert("Please add at least 2 members to create a group");
      return false;
    }
    return true;
  };

  // Create group
  const handleCreateGroup = async () => {
    if (!isFormValid()) {
      return;
    }

    const membersGroup = [...addedUsers, user._id];

    const { data } = await createChatGroup({
      name: nameGroup,
      creator: user._id,
      members: membersGroup,
    });
    dispatch(updateChatData([...chatdata, data]));

    socket.current.emit("create-group", {
      receiverIds: membersGroup.filter((member) => member !== user._id),
      groupChat: data,
    });

    closeModal();
  };

  // get user following
  useEffect(() => {
    const fetchFollowing = async () => {
      const { data } = await getUser(user._id);
      const following = data.following;
      setUserFollowing(following);

      const followingInfoPromises = following.map(async (userId) => {
        const userInfo = await getUser(userId);
        // console.log("UserInfor:"  + userInfo);
        return userInfo;
      });
      try {
        const followingDetailsData = await Promise.all(followingInfoPromises);
        setFollowingDetails(followingDetailsData);
      } catch (error) {
        console.error("Error fetching following details:", error);
      }
    };
    fetchFollowing();
  }, [user._id]);

  // get all users
  // useEffect(() => {
  //   const fetchPersons = async () => {
  //     const { data } = await getAllUser();
  //     setPersons(data);
  //   };
  //   fetchPersons();
  // }, []);

  return (
    <div className="groups-container">
      {/* header modal */}
      <header className="header-modal">
        <h2 id="modal-modal-title">Create Groups</h2>
        <TextField
          className="textfield"
          fullWidth
          required
          id="outlined-required"
          label="Name Group"
          variant="outlined"
          value={nameGroup}
          onChange={handleChangeNameGroup}
        />
        <div className="Search">
          <input type="text" placeholder="#search user" />
          <div className="s-icon">
            <UilSearch />
          </div>
        </div>
      </header>

      {/* form modal */}
      <div className="form-modal">
        {/* following section*/}
        <div className="following-section">
          <h3>Following</h3>
          {followingDetails.map((user) => (
            <div className="following-user" key={user.data._id}>
              <div>
                <img
                  src={
                    user.data.profilePicture
                      ? user.data.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER +
                        "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name">
                  <span>
                    {user.data.firstname} {user.data.lastname}
                  </span>
                  <span>{user.data.username}</span>
                </div>
              </div>
              <button
                className="button fc-button"
                onClick={() => handleAddMember(user.data._id)}
              >
                {addedUsers.includes(user.data._id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>

        {/* Other user */}
        {/* <div className='following-section'>
          <h3>Other people</h3>
          {persons.map((person) => {
            if (person._id !== user._id && !userFollowing.includes(person._id)) {
              
              return (
                <div className='following-user' key={person._id}>
                  <div>
                      <img
                        src={person.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + person.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
                        alt="Profile"
                        className="followerImage"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <div className='name'>
                        <span>{person.firstname} {person.lastname}</span>
                        <span>{person.username}</span>
                      </div>
                  </div>
                    <button 
                      className='button fc-button' 
                      onClick={() => handleAddMember(person._id)}
                    >
                      {addedUsers.includes(person._id) ? "Added" : "Add"}
                    </button>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div> */}
      </div>

      {/* button section */}
      <div className="button-section">
        <Button variant="contained" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default Groups;
