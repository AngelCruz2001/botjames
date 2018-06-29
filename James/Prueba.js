
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var btoa=require('btoa');
var server = restify.createServer();
const translate = require('google-translate-api');
var Mensajes;


server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
var connector = new builder.ChatConnector({
    appId: '',
    appPassword:''
})

var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());

bot.use({
    
    botbuilder: (session, next)=>{
logMensajeEntrante(session,next);
    },
    send: (event,next)=>{
        logMensajeSaliente(event,next); 
    
}
})


bot.dialog('/', [
    function (session, results,next) {
        session.beginDialog('/obtenerIdioma');
        next();
    },
(session)=>{
    setTimeout(() => {
        
        session.send('Falla');
        session.beginDialog('/Cañon')
    }, 1000);

}]);


bot.dialog('/Cañon',[
    (session)=>{
        session.send("Opciones");
    }
])
logMensajeEntrante=(session,next)=>{
    console.log(session.message.text);
    Mensajes=session.message.text;
    next();
    }
    logMensajeSaliente=(event,next)=>{
    
    console.log(event.next);
   
   
    next()
    }
    
bot.dialog('/obtenerIdioma',[
    (session)=>{
   translate(Mensajes, {to: 'en'}).then(res => {
        // console.log(res.text);
        //=> I speak English
        console.log(res.from.language.iso);
        // setTimeout(() => {
            
      var Idioma=res.from.language.iso;
        session.preferredLocale(Idioma, err => {
            if (!err) {
                session.send('Bienvenido');
            } else {
                session.error(err);
            }
        });  
    // }, 1000);
    }).catch(err => {
        console.error(err);
    });
        }
    ]);
 


