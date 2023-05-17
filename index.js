const http = require('http');
const fs = require('fs');
const path = require("path");
const httpSuccessStatus = 200;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const portNumber = 4829;
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') }) 
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const m_name = process.env.MONGO_DB_NAME;
const collection_1 = process.env.MONGO_COLLECTION_1;
const collection_2 = process.env.MONGO_COLLECTION_2;

const databaseAndCollection1 = {db: m_name , collection: collection_1};
const databaseAndCollection2 = {db: m_name , collection: collection_2};

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${userName}:${password}@cluster0.gfsaqth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const ticket_dic = {
    "Blow Out": 7,
    "BoyHood": 6,
    "Enemy": 5,
    "Interstellar IMAX": 10,
    "Interstellar Regular": 7,
    "Mommy": 5,
    "Requiem For A Dream": 6
}



process.stdin.setEncoding("utf8");
process.stdout.write(`Web server is running at http://localhost:${portNumber} \n`);
process.stdout.write('Stop to shutdown the server: ');
process.stdin.on("readable", function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "stop") {
            process.stdout.write("Shutting Down the Server\n");
            process.exit(0);
        } else {
            process.stdout.write(`Invalid Command ${command}:\n`);
        }
        process.stdout.write('Stop to shutdown the server: ');
        process.stdin.resume();
    }
});
app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.get("/", (request, response) => {
    response.render("welcome");
});
app.get("/snacks", (request, response) => {
    response.render("snacks");
});
app.get("/tickets", (request, response) => {
    response.render("tickets");
});

app.get("/review", (request, response) => {
    response.render("review");
});

app.post("/reviewpost",async(request, response) =>{
    let {name} = request.body;
    let filter = {name : name};
    await client.connect();
    let table = "";
    let blank = await client.db(databaseAndCollection1.db).collection(databaseAndCollection1.collection).findOne(filter);
    if (blank != null){
        table += ("<table border = '2'>");
        table += ("<tr><th>Movie</th><th>Ticket</th></tr>");
        if(blank.movie1!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie1 + "</td>";
            table += "<td>" + blank.ticket1 + "</td>";
            table+="</tr>";
        }
        if(blank.movie2!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie2 + "</td>";
            table += "<td>" + blank.ticket2 + "</td>";
            table+="</tr>";
        }
        if(blank.movie3!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie3 + "</td>";
            table += "<td>" + blank.ticket3 + "</td>";
            table+="</tr>";
        }

        if(blank.movie4!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie4 + "</td>";
            table += "<td>" + blank.ticket4 + "</td>";
            table+="</tr>";
        }
        if(blank.movie5!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie5 + "</td>";
            table += "<td>" + blank.ticket5 + "</td>";
            table+="</tr>";
        }
        if(blank.movie6!=null){
            table+= "<tr>";
            table += "<td>" + blank.movie6 + "</td>";
            table += "<td>" + blank.ticket6 + "</td>";
            table+="</tr>";
        }
        blank += "</table>";
    } else {
        table += "There is no one named "+ name;
    }
    await client.close();

    const variables = {
        orderTable: table,
        name : name
    }


    response.render("reviewpost", variables);

});

app.post("/snacksbill", (request, response) => {
    let {itemsSelected} =  request.body;
    if (!Array.isArray(itemsSelected)){
        itemsSelected = [itemsSelected]
    }
    let blank = ("<table border = '2'>");
    blank += ("<tr><th>Item</th></tr>");
    itemsSelected.forEach(obj =>{
        blank+= "<tr>";
        blank += "<td>" + obj + "</td>";
        blank+="</tr>";
    });

    blank += "</table>";
    const variables ={
        orderTable: blank
    }
    response.render("snacksbill", variables);
});

app.post("/ticketsconfirm", async(request, response) => {
    let {name, movie1, movie2, movie3, movie4, movie5, movie6,ticket1, ticket2,ticket3,ticket4,ticket5,ticket6} =  request.body;
    let blank = {name: name};
    let sum = 0;
    let price_sum = 0;
    await client.connect();
    let orderTable = ("<table border = '2'>");
    orderTable += ("<tr><th>Movie</th><th>Number</th><th>Cost</th></tr>");
    if(movie1 != null){
        blank['movie1']= movie1;
        blank['ticket1']= ticket1;;
        sum += parseInt(ticket1);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie1 + "</td>";
        orderTable+= "<td>" + ticket1 + "</td>";
        orderTable+= "<td>" + parseInt(ticket1) * ticket_dic[movie1] + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket1) * ticket_dic[movie1]

    }

    if(movie2 != null){
        blank['movie2']= movie2;
        blank['ticket2']= ticket2;
        sum += parseInt(ticket2);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie2 + "</td>";
        orderTable+= "<td>" + ticket2 + "</td>";
        orderTable+= "<td>" + parseInt(ticket2) * ticket_dic[movie2] + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket2) * ticket_dic[movie2]
        
    }

    if(movie3!=null){
        blank['movie3']= movie3;
        blank['ticket3']= ticket3;
        sum += parseInt(ticket3);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie3 + "</td>";
        orderTable+= "<td>" + ticket3 + "</td>";
        orderTable+= "<td>" + parseInt(ticket3) * ticket_dic[movie3] + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket3) * ticket_dic[movie3]
    }

    if(movie4!=null){

        blank['movie4']= movie4;
        blank['ticket4']= ticket4;
        sum += parseInt(ticket4);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie4 + "</td>";
        orderTable+= "<td>" + ticket4 + "</td>";
        orderTable+= "<td>" + parseInt(ticket4) * ticket_dic[movie4] + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket4) * ticket_dic[movie4]
    }

    if(movie5!=null){
        blank['movie5']= movie5;
        blank['ticket5']= ticket5;
        sum += parseInt(ticket5);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie5 + "</td>";
        orderTable+= "<td>" + ticket5 + "</td>";
        orderTable+= "<td>" + parseInt(ticket5) * ticket_dic[movie5] + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket5) * ticket_dic[movie5]
    }

    if(movie6!=null){
        blank['movie6']= movie6;
        blank['ticket6']= ticket6;
        sum += parseInt(ticket6);
        orderTable+= "<tr>";
        orderTable+= "<td>" + movie6 + "</td>";
        orderTable+= "<td>" + ticket6 + "</td>";
        orderTable+= "<td>" + parseInt(ticket6) * ticket_dic[movie6]  + "</td>";
        orderTable+= "</tr>";
        price_sum += parseInt(ticket6) * ticket_dic[movie6]
    }
    orderTable+= "<tr>";
    orderTable+= "<td>" + "Total" + "</td>";
    orderTable+= "<td>" + sum + "</td>";
    orderTable+= "<td>" + price_sum + "</td>";
    orderTable+= "</tr>";
    orderTable += "</table>";
    try {
        await client.connect();
        await client.db(databaseAndCollection1.db).collection(databaseAndCollection1.collection).insertOne(blank);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    const variables ={
        name: name,
        orderTable: orderTable
    }
    response.render("ticketsconfirm", variables)
});

app.get("/Interstellar", (request, response) => {
    response.render("Interstellar");
});
app.get("/BoyHood", (request, response) => {
    response.render("BoyHood");
});
app.get("/Enemy", (request, response) => {
    response.render("Enemy");
});
app.get("/Mommy", (request, response) => {
    response.render("Mommy");
});
app.get("/Requiem", (request, response) => {
    response.render("Requiem");
});
app.get("/Blowout", (request, response) => {
    response.render("Blowout");
});
app.listen(portNumber);

