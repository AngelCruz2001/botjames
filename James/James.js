//esto funciona
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

bot.dialog('/', [
(session,results)=>{
    console.log("antes"+session.conversationData.nuevo1);
    if(!session.conversationData.nuevo1){
 //Hola
 session.send('Hola, ¿en que puedo ayudarte?');
 //Respueta para buscar intencion
 session.beginDialog('/Cañon');
 session.conversationData.nuevo1=true;
    }else{
    //Hola
    session.send('Hola de nuevo, ¿en que puedo ayudarte?');
    //Respueta para buscar intencion
    session.beginDialog('/Cañon');


    }

}
]);



var model = `	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8838664-c1e4-41cd-b819-82fb018ba7df?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});


bot.dialog('/Cañon',dialog);
var TenSalon=false;
var elsePregunt=false;
dialog.matches ('BuscarCañones',[
    function (session,args,next){
        var ExtensionS,ExtensionC,ExtensionM,ExtensionI,ExtensionE;
        
        var Salon1=builder.EntityRecognizer.findAllEntities(args.entities, 'Salon');
        var Color1=builder.EntityRecognizer.findAllEntities(args.entities,'Color');
        var Marca1=builder.EntityRecognizer.findAllEntities(args.entities,'Marca');
        var Entrada1=builder.EntityRecognizer.findAllEntities(args.entities,'Entrada');
        var Imagen1=builder.EntityRecognizer.findAllEntities(args.entities,'Imagen');
        var Estado1=builder.EntityRecognizer.findAllEntities(args.entities,'Estado');
        
        ExtensionS=Salon1.length;
        ExtensionC=Color1.length;
        ExtensionM=Marca1.length;
        ExtensionE=Entrada1.length;
        ExtensionI=Imagen1.length;
        ExtensionEs=Estado1.length;

console.log(Salon1);

elsePregunt=false;

        if (ExtensionC>0){
            session.send('Color')
        }else if (ExtensionM>0){
            session.send('Marca')
        }else if(ExtensionE>0){
            session.send('Entrada')
        }else if (ExtensionI>0){
            session.send('Imagen')
        }else if (ExtensionEs>0){
            session.send('Estado')
        }else{
            session.send('Que te interesa')
        }

        // 
        // builder.Promts.text(session,'Hola, ¿En que puedo ayudarte?');



  
        if (ExtensionS > 0){
            Salon= Salon1[0].entity;
            next();
        }else {

            builder.Prompts.text(session,'Muy bien, ¿De que salon es el proyector que te interesa?');
           elsePregunt=true;
        }
    
            }, 
            function (session,results){
                    if (elsePregunt){
                        Salon = results.response.match(/b[0-1]{1}|c[0-6]{1}|d[0-8]{1}|e[0-6]{1}|h[0-4]{1}|m[0-3]{1}/g);
                        elsePregunt=false;
                    }
                    // var Busqueda=
                var consulta="SELECT * FROM canones where Salon='"+Salon+"'";
                var query = connection.query(consulta, function(error, result,session){
                    if(result){
                        let Extension=result.length;
                        if(Extension){
                           
                            Rara =result[0].Estado;
        
                       
                          
                        }else{
                           Rara='Ups, parece que no existe un salon con ese nombre.';
                           TenSalon=false;
                        }
                    }else{
                       throw error;
                     
                    }
                 }
                );
                
                
            setTimeout( function() {
               
        if(Rara==undefined){
            session.endDialog('Lo siento mi busqueda no funiciona gracias a que tu internet no parece ser muy bueno por lo cual mi memoria falla, Te recomiendo volver a intentarlo.')
        }else {
            session.beginDialog('/EstadoMostrar')
            connection.end();
        }
            }, 2000)
            }
            
       
        
    
   
]);
// bot.dialog('/TraerBD',[
//     function(session){}
// ])
bot.dialog('/EstadoMostrar',[function(session){
    var EstadoC=Rara.toLowerCase();
        if (EstadoC==='funcional'){
            session.send(`El cañon del salon ${Salon} esta funcionando perfectamente, ¿Algo mas en lo que te pueda ayudar? `)
        }else{
            if (TenSalon==false){
                session.send(Rara);
            }else{

                session.send(`Uy, el cañon no esta funcionando como deberia ya que ${EstadoC}, ¿Algo mas en lo que te pueda ayudar? `)
            }
            
        }
        session.beginDialog('/Cañon');


}
]);

dialog.matches('None',[
    function(session,results){
    session.send('No tengo capacidades para ejecutar esa accion, ¿te puedo ayudar con otra cosa?');
session.beginDialog('/Cañon');
    }
]);

dialog.matches('TerminarConversacion',[
    function(session,results){
session.endDialog('Muy bien, fue un placer ayudarte')    
}
]);



