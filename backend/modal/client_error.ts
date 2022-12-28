export class client_error {
    status: number;
    massage: string

    public constructor(status: number, massage: string) {
        this.status = status;
        this.massage = massage;
    }
}

export class routeNotFound extends client_error {
    public constructor(route: string) {
        super(404, `the route of ${route} doesn't exist`)
    }
}

export class idNotFound extends client_error {
    public constructor (id:number) {
        super(404, `the id of ${id} doesn't exist`)
    }
}
export class incorrectUser extends client_error {
    public constructor (message:string) {
        super(401, message)
    }
}

export class validationErr extends client_error {
    public constructor (massage:string) {
        super(400, massage)
    }
}

