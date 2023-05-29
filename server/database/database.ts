const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "TOBBYAs2@#&",
  database: "bitsend",
});

client.connect();

client.on("connect", ()=>{
    console.log("Database connected")
})

client.on("end",() =>{
    console.log("Connection ended")
})

export default client