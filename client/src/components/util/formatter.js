import moment from "moment"

export const formatAmount = (amount) =>{
    return parseFloat(amount.toFixed(2)).toLocaleString("en")
}

export const formatDate = (date) =>{
    return moment(date).format("LLL")
}