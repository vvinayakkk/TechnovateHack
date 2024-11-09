import {User} from '../../models/index.js';

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { fromUserID, toUserID } = req.body;

    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      User.findOne({ userID: fromUserID }),
      User.findOne({ userID: toUserID })
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Check if they're already friends
    if (fromUser.friends.includes(toUserID)) {
      return res.status(400).json({ message: 'Users are already friends' });
    }

    // Check if request already sent
    if (fromUser.friendRequestsSent.includes(toUserID)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add to respective arrays
    fromUser.friendRequestsSent.push(toUserID);
    toUser.friendRequestsReceived.push(fromUserID);

    await Promise.all([fromUser.save(), toUser.save()]);

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { acceptingUserID, requestingUserID } = req.body;

    // Check if users exist
    const [acceptingUser, requestingUser] = await Promise.all([
      User.findOne({ userID: acceptingUserID }),
      User.findOne({ userID: requestingUserID })
    ]);

    if (!acceptingUser || !requestingUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Verify request exists
    if (!acceptingUser.friendRequestsReceived.includes(requestingUserID)) {
      return res.status(400).json({ message: 'No friend request found' });
    }

    // Add to friends arrays
    acceptingUser.friends.push(requestingUserID);
    requestingUser.friends.push(acceptingUserID);

    // Remove from requests arrays
    acceptingUser.friendRequestsReceived = acceptingUser.friendRequestsReceived
      .filter(id => id !== requestingUserID);
    requestingUser.friendRequestsSent = requestingUser.friendRequestsSent
      .filter(id => id !== acceptingUserID);

    await Promise.all([acceptingUser.save(), requestingUser.save()]);

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error accepting friend request', error: error.message });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { rejectingUserID, requestingUserID } = req.body;

    // Check if users exist
    const [rejectingUser, requestingUser] = await Promise.all([
      User.findOne({ userID: rejectingUserID }),
      User.findOne({ userID: requestingUserID })
    ]);

    if (!rejectingUser || !requestingUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Remove from requests arrays
    rejectingUser.friendRequestsReceived = rejectingUser.friendRequestsReceived
      .filter(id => id !== requestingUserID);
    requestingUser.friendRequestsSent = requestingUser.friendRequestsSent
      .filter(id => id !== rejectingUserID);

    await Promise.all([rejectingUser.save(), requestingUser.save()]);

    res.status(200).json({ message: 'Friend request rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rejecting friend request', error: error.message });
  }
};

// Get friend list
const getFriendList = async (req, res) => {
  try {
    const { userID } = req.body;
    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      friends: user.friends,
      requestsSent: user.friendRequestsSent,
      requestsReceived: user.friendRequestsReceived
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting friend list', error: error.message });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendList
};