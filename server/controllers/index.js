
import {createUser,getUser ,leadearboard} from "./userControllers/manageUser.js"
import {acceptFriendRequest,rejectFriendRequest,sendFriendRequest,getFriendList} from "./friendsController/frineds.js"
import { createEvent,registerForEvent,getEvents} from "./eventController/event.js"

export{
    createUser,
    getUser,
    leadearboard,
    acceptFriendRequest,
    rejectFriendRequest,
    sendFriendRequest,
    getFriendList,
    createEvent,
    registerForEvent,
    getEvents,
}