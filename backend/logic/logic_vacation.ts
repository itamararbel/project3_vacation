import { OkPacket } from "mysql"
import dal from "../dal/dal"
import vacationModal from "../modal/vicationModal"
import { v4 as uuid } from "uuid"
import { validationErr } from "../modal/client_error"
import { appendFileSync, unlink } from "fs"



const getAllVacations = async (id: number): Promise<vacationModal[]> => {
    const sql = `SELECT vacation_table.*, user_vacations.user_id
                from(SELECT * from follow_table where user_id =${id}) as user_vacations
                right join vacation_table on vacation_table.vacation_id = user_vacations.vacation_id`
    return await dal.execute(sql)
}

const getById = async (id: number): Promise<vacationModal[]> => {
    console.log("getById")
    const sql = "select * from vacation_Table WHERE vacation_id =" + id;
    return await dal.execute(sql)
}

const addNewVacation = async (newVacation: vacationModal): Promise<vacationModal> => {
    //give it a new name
    const extension = newVacation.image?.name.split(".")[1]
    const imageName = uuid() + "." + extension;
    newVacation.image.name = imageName;
    // save to disk
    newVacation.image.mv("./src/assets/images/" + imageName)
    //save the name to the newVacation
    const sql = `INSERT INTO vacation_table VALUES(default, '${newVacation.destination}', '${newVacation.description}', '${imageName}', '${newVacation.start_date}', '${newVacation.end_date}', ${newVacation.price},0 ) `
    let result: OkPacket
    try {
        result = await dal.execute(sql);
    } catch (err) {
        appendFileSync("errorsLog.txt", err.message,"utf-8");   
        throw new validationErr("sql is not good enough" + sql)
    }
    newVacation.vacation_id = result.insertId;
    return newVacation;
}

const deleteVacation = async (id: number): Promise<void> => {
    let sql = "select picture from vacation_table where vacation_id =" + id;
    const fileName = await (dal.execute(sql));
    unlink("./src/assets/images/" + fileName[0].picture, () => console.log(fileName + "deleted"));
    sql = "delete from vacation_Table where vacation_id=" + id;
    dal.execute("delete from follow_table where vacation_id=" + id + " and user_id > 0");
    return await dal.execute(sql);
}

const editVacation = async (newVacation: vacationModal): Promise<vacationModal> => {
    if (newVacation.image) {
        console.log(newVacation.image)
        const oldPic = await dal.execute("SELECT picture FROM vacation_table where vacation_id=" + newVacation.vacation_id)
        console.log(oldPic[0].picture);
        await newVacation.image.mv("./src/assets/images/" + oldPic[0].picture)
    }
    const sql = `update vacation_table set destination ='${newVacation.destination}', description='${newVacation.description}', price = ${newVacation.price},start_date='${newVacation.start_date}',end_date='${newVacation.end_date}' where vacation_id=${newVacation.vacation_id} `
    return await dal.execute(sql)
}

const getFollowStatistics = async (): Promise<JSON[]> => {
    const sql = `SELECT COUNT(user_id) as numberOfFollowers, follow_table.vacation_id , vacation_table.destination as name
                FROM follow_table
                join vacation_table
                on vacation_table.vacation_id = follow_table.vacation_id
                GROUP BY vacation_id`
    return dal.execute(sql)
}

export default {
    getAllVacations,
    getById,
    addNewVacation,
    deleteVacation,
    editVacation,
    getFollowStatistics
}