import userModal, { UserAuthentic} from './../modal/userModal';
import jwt from "jsonwebtoken"

const secretKey = "youwillneverseeitcoming";

const createToken = (user: UserAuthentic): string => {
    const payload = { user };
    const token = jwt.sign(payload, secretKey, { expiresIn: "20m" });
    return token
}

const checkToken = async (auth_header: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!auth_header) {
            resolve(false);
            return;
        }
        console.log("Checking")
        const token = auth_header
        console.log("Checking")

        if (!token) {
            resolve(false);
            return;
        }
        jwt.verify(token, secretKey, (err, payload)=>{
           console.log("err")
            if (err) {
            resolve(false);
            return;
           }
           resolve(true);
        })
    })

}
const getUser= (auth_header:string):UserAuthentic => {
   console.log(auth_header);
    const token = auth_header;
    const payload = jwt.decode(token)
    console.log(payload);
    return payload as UserAuthentic;
}

// const verifyToken = (token:string):string|boolean => {
//     return (checkToken(token)?  token : false)
// }

export default {
    createToken,checkToken,getUser
}