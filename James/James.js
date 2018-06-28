
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var mysql =require ('mysql')
// var base64= require('base-64');
// var utf8=require('utf8');
var btoa=require('btoa');
var base64img = require ('base64-img');
var app=express();
var Rara;
var NoRara=true;
var Busqueda,opciones,est;
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
//llenar la variable opciones
opciones="Estas son las cosas que puedo hacer por ti"+"\n"+
"-Buscar el color del cañon"+"\n"+
"-Buscar la marca del cañon"+"\n"+
"-Buscar el tipo de entrada del cañon"+"\n"+
"-Ver la imagen del cañon"+"\n"+
"-Buscar el estado del cañon"+"\n"+
"-Buscar toda la informacion de un cañon"
bot.dialog('/', [
(session,results,next)=>{
    
    if(!session.conversationData.nuevo1){
        
 //Hola
 session.send('Hola, ¿en que puedo ayudarte?');
 session.send(opciones);
 //Respueta para buscar intencion
 session.beginDialog('/Cañon');
 session.conversationData.nuevo1=true;
    }else{
    //Hola
    session.send('Hola de nuevo, ¿en que puedo ayudarte?');
    builder.Prompts.choice(session,"¿Quiere ver las cosas que puedo hacer?" ,"Si|No",{ listStyle: builder.ListStyle.button });
    //Respueta para buscar intencion
    
    }
},(session,results)=>{

    if(!session.conversationData.menu){
        session.beginDialog('/Cañon');
        session.conversationData.menu=true;
    }else{
        var op=results.response.entity;
        if(op==="Si"){
            session.send(opciones);
            
        }else{
            session.send("Dime que busco");
        }
        session.beginDialog('/Cañon');
    }
    
}
]);



var model = `	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8838664-c1e4-41cd-b819-82fb018ba7df?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});


bot.dialog('/Cañon',dialog);
// var TenSalon=false;
var elsePregunt=false;
dialog.matches ('BuscarCañones',[
     (session,args,next)=>{
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



elsePregunt=false;

        if (ExtensionC>0){
            
            Busqueda="Color";
        }else if (ExtensionM>0){
            Busqueda="Marca";
        }else if(ExtensionE>0){
            Busqueda="Tipo_de_entrada";
        }else if (ExtensionI>0){
            Busqueda="Imagen";
        }else if (ExtensionEs>0){
            Busqueda="Estado";
        }else{
            Busqueda="*";
        }

        console.log("entidad: "+Busqueda);
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
            (session,results,error)=>{
                    if (elsePregunt){
                        Salon = results.response.match(/b[0-1]{1}|c[0-6]{1}|d[0-8]{1}|e[0-6]{1}|h[0-4]{1}|m[0-3]{1}|B[0-1]{1}|C[0-6]{1}|D[0-8]{1}|E[0-6]{1}|H[0-4]{1}|M[0-3]{1}/g);
                        elsePregunt=false;
                    }
                    // 
                var consulta=`SELECT * FROM canones WHERE Salon='${Salon}'`;
                var query = connection.query(consulta, function(error, result,session){
                    console.log (result);
                    if(result){
                        let Extension=result.length;
                        if(Extension>0){
                            if(result[0].Estado==="Funcional"){
                                est = "Se encuentra ";
                            }else{
                                est="Ups el cañon presenta una falla, la cual es que ";
                        }
                          switch(Busqueda){
                            case "Color":
                            session.send("Mmmm... Dejame recordar");
                                Rara ='si muy bien es de color'+result[0].Color;
                                 break;
                            case "Marca":
                            session.send('Esa es facil');
                                Rara =result[0].Marca;
                                break;
                            case "Tipo_de_entrada":

                                Rara =result[0].Tipo_de_entrada;
                                break;

                            case "Imagen":
                            
                            // var bytes=utf8.encode(result[0].Imagen);
                            Rara=btoa(result[0].Imagen);
                            console.log( 'imagen:  '+Rara);
                            base64img.img(Rara,"C:\\Users\\Angel E. Retana\\Desktop","imagen",function(err,filepath){
                                if(err){
                                    console.log('Hubo un error!!!!!!');
                                }
                            });
                            // var im agen64=base64.encode(bytes);
                                 
                            throw error;
                                // Rara =result[0].Imagen;
                                break;
                            case "Estado":
                                Rara =est+result[0].Estado;
                                
                                break;
                            case "*":
                                 Rara="El color es "+result[0].Color+"\n"+
                                "Su marca es "+result[0].Marca+"\n"+
                                "Tiene un tipo de entrda "+result[0].Tipo_de_entrada+"\n"+
                                est+result[0].Estado;
                            

                        
                        }
                        console.log("imagen :"+result[0].Imagen);
                        }else{
                           Rara='Ups, parece que no existe un salon con ese nombre.';
                        //    TenSalon=false;
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
            // connection.end();
        }
            }, 2000)
            }
            
       
        
    
   
]);
// bot.dialog('/TraerBD',[
//     functi'<on(session){}
// ])
bot.dialog('/EstadoMostrar',[
    (session)=>{
    // var EstadoC=Rara.toLowerCase();
    
     session.send(Rara);

        session.beginDialog('/Cañon');


}
]);

dialog.matches('None',[
        (session,results)=>{
    session.send('No tengo capacidades para ejecutar esa accion, ¿te puedo ayudar con otra cosa?');
session.beginDialog('/Cañon');
    }
]);

dialog.matches('TerminarConversacion',[
    (session,results)=>{
session.endDialog('Muy bien, fue un placer ayudarte')    
}
]);

dialog.matches('Saludo',[
    (session,results)=>{
        session.beginDialog('/');
    }
]);