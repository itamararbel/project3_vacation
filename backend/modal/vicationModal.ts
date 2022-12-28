import { UploadedFile } from "express-fileupload";

export default class vacationModal { 
    vacation_id: number;
    description:string;
    destination: string;    
    picture: string;
    start_date:Date = new Date();
    end_date:Date = new Date();
    price :"string";
    follow_num: number; 
    image: UploadedFile;

}