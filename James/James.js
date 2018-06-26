
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var mysql =require ('mysql')
var app=express();
var Rara;
var NoRara=true;
// Levantar Restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT||3000,function(){
    console.log('listering to', server.name, server.url);
})
var connector = new builder.ChatConnector({
    appId: '',
    appPassword:''
})

var bot = new builder.UniversalBot(connector);
server.post('/api/messages',connector.listen());




// Conexion a base de datos
var connection = mysql.createConnection({
    host:'212.18.232.34',
    user:'jpgproye_1',
    password:'AdministradoresJPG',
    database:'jpgproye_ctores'
    });
    connection.connect(function(err){
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }
         
          console.log('connected as id ' + connection.threadId);
    
    });





var model = `	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8838664-c1e4-41cd-b819-82fb018ba7df?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`
var Salon;

var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});


bot.dialog('/',dialog);

dialog.matches ('BuscarCañones',[
    function (session,args,next,){
        // builder.Promts.text(session,'Hola, ¿En que puedo ayudarte?');
        var Salon1=builder.EntityRecognizer.findAllEntities(args.entities, 'Salon');
    var Extension=Salon1.length;
        if (Extension > 0){
            var msj = 'El salon que elegiste es: ';
            Salon= Salon1[0].entity;
            msj+= `**${Salon}**`;
            session.send(msj);

        }else {
            session.send('¿De que salon es el proyector que te interesa?');
            // Salon=results.response;

        }
      
        var consulta="SELECT * FROM canones where Salon='"+Salon+"'";
        var query = connection.query(consulta, function(error, result,session){
            if(result){
                let Extension=result.length;
                if(Extension){
                    Rara =result[0].Estado;

                
                //  console.log('Sasdf')
                //    console.log (result);
                  
                }else{
                   Rara='Registro no encontrado';
                }
            }else{
               throw error;
             
            }
         }
        );
        
        
    setTimeout( function() {
        session.beginDialog('/EstadoMostrar')
        connection.end();
        console.log('corrido luego de 3s')
if(Rara==undefined){
session.send('Lo siento tu conexion a internet es deficiente, vuelve a intentarlo')
}
    }, 2000)
            }
            
       
        
    
   
]);
// bot.dialog('/TraerBD',[
//     function(session){}
// ])
bot.dialog('/EstadoMostrar',[function(session){
    session.send("El estado del cañon del "+Salon+" es: "+ Rara)
  session.endDialog('Gracias');
}
]);

dialog.matches('None',[
    function(session,results){
    session.send('No tengo capacidades para ejecutar esa accion');
    }
]);




