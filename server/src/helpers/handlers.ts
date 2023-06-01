import { errorMessage,successMessage } from "../interface/responses"

export const handleErrors = (res:any,error:errorMessage) =>{
    return res.status(400).json(error)
}


export const handleSuccess = (res:any,success:successMessage) =>{
    return res.status(200).json(success)
}