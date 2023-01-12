import crypto from "crypto";

 const spice = "curryAndPepperAreTheBest"

const hash =(text:string)=>{
    if(!text) return null;
    return crypto.createHmac('sha1',spice).update(text).digest("hex");
    // crypto.createHash("sha512").update(text).digest("hex");

}

export default hash;