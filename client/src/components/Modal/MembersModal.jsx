import React, { useEffect, useState, useRef } from "react";
import { memberInGroups, removeMemberFromGroup } from "../../api/GroupRequests";
import { useSelector } from "react-redux";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import { io } from "socket.io-client";

const MembersModal = ({ groupChats }) => {
  const [memberGroups, setMemberGroups] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
  const [openDeleteMemberModal, setOpenDeleteMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL, {
      path: "/websocket",
      auth: {
        token: `Bearer ${user.token}`,
      },
      transports: ["websocket"],
    });
  }, [user]);

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

  const handleOpenDeleteMemberModal = (memberId) => {
    setSelectedMemberId(memberId);
    setOpenDeleteMemberModal(true);
  };

  const handleCloseDeleteMemberModal = () => {
    setSelectedMemberId(null);
    setOpenDeleteMemberModal(false);
  };

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

      // send message remove member to socket
      socket.current.emit("remove-member", {
        groupId: groupChats._id,
        memberIdToRemove: memberId,
      });
      console.log("Send Remove member message to socket: ", memberId);
    } catch (error) {
      console.error("Error deleting member:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
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
                onClick={() => handleOpenDeleteMemberModal(member._id)}
              >
                Remove
              </button>
            ) : (
              <span>Member</span>
            )}
          </div>
        ))}
      </div>
      {/* Confirmation Modal */}
      <Modal
        open={openDeleteMemberModal}
        onClose={handleCloseDeleteMemberModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteMemberModal}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Delete Member
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this member?
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseDeleteMemberModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDelete(selectedMemberId);
                  handleCloseDeleteMemberModal();
                }}
                color="primary"
                variant="contained"
                sx={{ ml: 2 }}
              >
                Yes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default MembersModal;
