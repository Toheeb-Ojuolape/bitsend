const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "TOBBYAs2@#&",
  database: "bitsend",
});


client.on("connect", ()=>{
    console.log("Database connect")
})

client.on("end",() =>{
    console.log("Connection ended")
})

export default client