
var builder = require('botbuilder');
var restify =require ('restify');


// Levantar Restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('%s listering to $s', server.name, server.url);
})



var connector = new builder.ChatConnector({
    appId: '',
    appPassword:''
})
var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());
// var Espera=builder.Prompts.text;
// var Texto=session.send;
bot.dialog('/', [
    function (session,results,next){
        if (!session.userData.Nombre){
       builder.Prompts.text(session, '¿Cómo te llamas?');
        }else{
            next();
        }
},
function(session,results){
    if (results.response){
    session.userData.Nombre = results.response;
    }
     session.send(`Hola ${session.userData.Nombre} `);
    session.beginDialog('/Edad');
}
]);


bot.dialog('/Edad',[
    function(session){
    
        builder.Prompts.number(session, '¿Cuantos años tienes?');

    },
    function(session,results,next){
        let Edad= results.response;
        var EdadEntero=Edad;

        if (EdadEntero<18){
            session.send(`Eres menor de edad ${session.userData.Nombre}`);
        }else if (EdadEntero>=18) {
            session.send(`Eres mayor de edad ${session.userData.Nombre}, ¡Eres legal! `);
        }

        // session.endConversation();
next();
    },
    function(session){
        builder.Prompts.choice(session, "Elige una opcion","Randoms|Johan",{listStyle:builder.ListStyle.button});
    },
    function(session,results){
        let op=results.response.entity;
        session.send(`Elegiste: ${op}`)
    }
])


