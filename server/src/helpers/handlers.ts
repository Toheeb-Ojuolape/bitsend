import { errorMessage,successMessage } from "../interface/responses"
import { Response } from "express"

export const handleErrors = (res:Response,error:errorMessage) =>{
    return res.status(400).json(error)
}


export const handleSuccess = (res:Response,success:successMessage) =>{
    return res.status(200).json(success)
}