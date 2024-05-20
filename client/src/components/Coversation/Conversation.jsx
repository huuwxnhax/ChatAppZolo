import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";
import avatarGroupDefault from "../../img/avatar-group.png";

const Conversation = ({ isGroup, data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log(data);
        dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);
  return (
    <>
      <div className="follower conversation">
        <div>
          {!isGroup ? (
            <>
              {online && <div className="online-dot"></div>}
              <img
                src={
                  userData?.profilePicture
                    ? userData.profilePicture
                    : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                }
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="name" style={{ fontSize: "0.8rem" }}>
                <span>
                  {userData?.firstname} {userData?.lastname}
                </span>
                <span style={{ color: online ? "#51e200" : "" }}>
                  {online ? "Online" : "Offline"}
                </span>
              </div>
            </>
          ) : (
            <>
              <img
                src={avatarGroupDefault}
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="name" style={{ fontSize: "0.8rem" }}>
                <span>{data.name}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
