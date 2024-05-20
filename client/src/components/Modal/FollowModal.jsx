import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests";
import { addMembersToGroup } from "../../api/GroupRequests";
import "./Modal.css";
import { Button } from "@mui/material";

const FollowModal = ({ groupChats, closeModal }) => {
  const [userFollowing, setUserFollowing] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [add, setAdd] = useState(false);
  const [addMembers, setAddMembers] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const { data } = await getUser(user._id);
        const following = data.following;
        setUserFollowing(following);

        const followingInfoPromises = following.map(async (userId) => {
          const userInfo = await getUser(userId);
          return userInfo;
        });

        const followingDetailsData = await Promise.all(followingInfoPromises);
        const filteredFollowingDetails = followingDetailsData.filter(
          (person) => {
            return !groupChats.members.includes(person.data._id);
          }
        );
        setFollowingDetails(filteredFollowingDetails);
      } catch (error) {
        console.error("Error fetching following details:", error);
      }
    };
    fetchFollowing();
  }, [user._id, groupChats.members]);

  const handleAdd = (memberIdToAdd) => {
    setAdd(!add);
    setAddMembers([...addMembers, memberIdToAdd]);
  };

  const handleSubmit = async () => {
    try {
      await addMembersToGroup({
        groupId: groupChats._id,
        memberIdToAdd: addMembers,
        requestingUserId: user._id,
      });
      // Close the modal after successfully adding members to the group
      const updatedFollowingDetails = followingDetails.filter(
        (person) => !addMembers.includes(person.data._id)
      );
      setFollowingDetails(updatedFollowingDetails);
      closeModal();
    } catch (error) {
      console.error("Error adding members to group:", error);
    }
  };

  return (
    <div className="">
      <div className="">
        <h3>Add New Members</h3>
      </div>
      <div className="">
        {followingDetails.map((person) => (
          <div className="follower" key={person.data._id}>
            <div className="follower-section">
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
              <div className="name">
                <span>
                  {person.data.firstname} {person.data.lastname}
                </span>
                <span>{person.data.username}</span>
              </div>
            </div>

            <button
              className={
                add ? "button fc-button UnfollowButton" : "button fc-button"
              }
              onClick={() => handleAdd(person.data._id)}
              disabled={addMembers.includes(person.data._id)}
            >
              {addMembers.includes(person.data._id) ? "Added" : "Add"}
            </button>
          </div>
        ))}
      </div>
      <div className="btn-submit">
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Members
        </Button>
      </div>
    </div>
  );
};

export default FollowModal;
