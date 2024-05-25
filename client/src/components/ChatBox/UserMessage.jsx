import React, { useEffect, useState } from "react";
import { getUser } from "../../api/UserRequests";
import defaultProfile from "../../img/defaultProfile.png";

const UserMessage = ({ userId, currentUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUser(userId);
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  return user ? (
    <div
      className={user._id === currentUser ? "user-Message own" : "user-Message"}
    >
      <img
        src={user.profilePicture ? user.profilePicture : defaultProfile}
        alt="Profile"
        className="imgProfile"
        style={{ width: "40px", height: "40px" }}
      />
      {/* <span>{user.firstname} {user.lastname}</span> */}
    </div>
  ) : null;
};

export default UserMessage;
