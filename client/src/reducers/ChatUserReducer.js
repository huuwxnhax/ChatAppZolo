const chatReducer = (state = { chatUsers: [], loading: false, error: false }, action) => {
    switch (action.type) {
            case "SAVE_USER":
                return ({...state, chatUsers: [...state.chatUsers, action.data]});
            case "UPDATE_CHAT_DATA":
                return ({...state, chatUsers: action.data});
             default:
                return state
    }} 
export default chatReducer