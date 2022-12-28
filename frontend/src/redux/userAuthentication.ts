
export enum UserRole {"admin","user", "guest"}

export class userState {
    user_id:number = 0; 
    user_name: string = "";
    user_role: UserRole = UserRole.guest;
    user_token : string|null = "";
}

export enum authenticActionType {"logInUser", "logOut", "updateToken"}

export interface authenticAction{
    type : authenticActionType,
    payload : any;
}

export function logInUser(user:userState):authenticAction {
    return {type: authenticActionType.logInUser, payload:user}
}

export function logOut():authenticAction {
    localStorage.removeItem("userToken")
    return {type: authenticActionType.logOut, payload: null}
}

export function updateToken(token:string):authenticAction {
    return {type: authenticActionType.updateToken, payload:token}
}

export function userReducer(currentState:userState=new userState(), action:authenticAction):userState {
    let newUserState = {...currentState}
    switch (action.type) {
        case authenticActionType.logInUser :{
            newUserState.user_name= action.payload.user_name;
            newUserState.user_role= action.payload.user_role;
            newUserState.user_id= action.payload.user_id;
            newUserState.user_token= action.payload.user_token;
            localStorage.setItem("userToken",action.payload.user_token);

            break;
        }
        case authenticActionType.logOut :{
            newUserState.user_name= "guest";
            newUserState.user_role= UserRole.guest;
            newUserState.user_id= 0;
            newUserState.user_token= null;
            localStorage.removeItem("user_token");
            break;
        }
        case authenticActionType.updateToken :{
            newUserState.user_token= action.payload.user_token;
            localStorage.set("userToken",action.payload.user_token);

        }
    }
    return newUserState
}
