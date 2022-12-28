export enum UserRole { "admin", "user", "guest" }

export class UserAuthentic {
    user_name: string;
    user_id: number;
    user_token: string;
    user_role: UserRole;

    constructor(user_name: string, user_id: number, user_token: string, user_role: UserRole) {
        this.user_name = user_name;
        this.user_id = user_id;
        this.user_token = user_token;
        this.user_role = user_role;
    }
}

export default class userModal {
    user_id: number;
    first_name: string;
    family_name: string;
    user_name: string;
    password: string;

    constructor(user_id: number, first_name: string, family_name: string, user_name: string, password: string) {
        this.user_name = user_name;
        this.user_id = user_id;
        this.first_name = first_name;
        this.family_name = family_name;
        this.password = password;
    }
}

export class credsModal {
    user_name: string;
    password: string

    constructor(user_name: string, password: string) {
        this.user_name = user_name;
        this.password = password;
    }
}

export class followModal {
    vacation_id: number;
    user_id: number;
    user_role: UserRole
    user_name: string;
}

