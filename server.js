//require modules
var credentials = require('./cred')
var africastalking = require('africastalking')(credentials.AT)
var cors = require('cors')
var bodyParser = require('body-parser')

//configure modules
var express = require('express')
var app = express()
var PORT = 3000

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.post('/order', function(req, res){
    console.log(req.body);
    var message = 'Hello' 

    var welcomeMsg = `CON Welcome to TATUP Services. 
    Enter your bank name`

    var orderDetails = {
        bankName: "",
        accountName: "",
        accountNumber: "",
        token: "",
        open: true
    }
    var lastData = "";
    var sessionId = req.body.sessionId
    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var text = req.body.text
    var textValue = text.split('*').length

    if(text === ''){
        message = welcomeMsg
    }else if(textValue === 1){
        message = "CON Account Name?"
        orderDetails.bankName = text;
    }else if(textValue === 2){
        message = "CON Account Number?"
        orderDetails.accountName = text.split('*')[1];
    }else if(textValue === 3){
        message = "CON TOKEN"
        orderDetails.accountNumber = text.split('*')[2];  
    }else{
        message = `END Transaction Submited successfuly.`
        orderDetails.token = lastData  
    }
    
       
    res.contentType('text/plain');
    res.send(message, 200);

    console.log(orderDetails)
    if(orderDetails.bankName != "" && orderDetails.accountNumber != '' && orderDetails.accountName != '' && orderDetails.token != ''){
        pusher.trigger('orders', 'customerOrder', orderDetails)
    }
    if(orderDetails.token != ''){
        //reset data
    orderDetails.bankName= ""
    orderDetails.accountName= ""
    orderDetails.accountNumber= ""
    orderDetails.token= ""
    }
})

//listen on port 
app.listen(process.env.PORT || 3000, function(err, res){
    if(err) throw err
    console.log("Serving on port " + PORT)
})

