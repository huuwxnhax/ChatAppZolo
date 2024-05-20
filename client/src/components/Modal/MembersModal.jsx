import React, { useEffect, useState } from "react";
import { memberInGroups, removeMemberFromGroup } from "../../api/GroupRequests";
import { useSelector } from "react-redux";

const MembersModal = ({ groupChats }) => {
  const [memberGroups, setMemberGroups] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await memberInGroups(groupChats._id);
        setMemberGroups(data);
      } catch (error) {
        console.error("Error fetching member groups:", error);
        // Handle error (e.g., show a message to the user)
      }
    };
    fetchMembers();
  }, [groupChats._id]);

  const handleDelete = async (memberId) => {
    try {
      if (user._id !== groupChats.creator) {
        // Nếu người dùng không phải là admin, hiển thị thông báo cho họ
        alert("You don't have permission to remove members from this group.");
        return;
      }

      // Call your API function to remove the member from the group
      await removeMemberFromGroup({
        groupId: groupChats._id,
        memberIdToRemove: memberId,
        requestingUserId: user._id,
      });

      // Reload member list after successfully removing the member
      const { data } = await memberInGroups(groupChats._id);
      setMemberGroups(data);
    } catch (error) {
      console.error("Error deleting member:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <div className="">
      <div className="">
        <h3>Members</h3>
      </div>
      <div className="">
        {memberGroups.map((member) => (
          <div className="follower" key={member._id}>
            <div className="follower-section">
              <img
                src={
                  member.profilePicture
                    ? member.profilePicture
                    : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                }
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="name">
                <span>
                  {member.firstname} {member.lastname}
                </span>
                <span>{member.username}</span>
              </div>
            </div>

            {member._id === groupChats.creator ? (
              <span>Admin</span>
            ) : user._id === groupChats.creator ? (
              <button
                className="button fc-button"
                onClick={() => handleDelete(member._id)}
              >
                Remove
              </button>
            ) : (
              <span>Member</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersModal;
