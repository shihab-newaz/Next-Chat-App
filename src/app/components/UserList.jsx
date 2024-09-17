import React, { useState, useEffect } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { InviteIcon } from "@/assets";

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

/**
 * A single item in the user list that can be clicked to invite.
 * Handles the state of whether the user is selected or not.
 * When clicked, toggles the selected state and calls the `setSelectedUsers` function
 * with the user id to add or remove the user from the list of selected users.
 * @param {{user: object, setSelectedUsers: function}} props
 * @prop {object} user - The user object to be rendered in the item.
 * @prop {function} setSelectedUsers - The function to call with the user id to add or remove the user from the list of selected users.
 * @returns A JSX element representing the user item.
 */
const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected((prevSelected) => !prevSelected);
  };
  return (
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name">{user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

/**
 * Component that renders a list of users in the app.
 * This list is used to invite users to channels.
 * The list is paginated and loads 8 users at a time.
 * If the list is empty, a message is displayed.
 * If there is an error, the error is logged to the console.
 * The component uses the `useChatContext` hook to get the chat client.
 * The component uses the `useState` and `useEffect` hooks to manage the state of the component.
 * The component renders a `ListContainer` component, which renders a list of `UserItem` components.
 * Each `UserItem` component renders the name and avatar of the user.
 * The user can select a user by clicking on the user.
 * When a user is selected, the `setSelectedUsers` function is called with the user's id.
 * The component also renders a message if the list is loading or if there is an error.
 */
const UserList = ({ setSelectedUsers }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (client) getUsers();
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No users found</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__wrapper">Loading users....</div>
      ) : (
        users?.map((user, i) => (
          <UserItem key={i} user={user} setSelectedUsers={setSelectedUsers} />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
