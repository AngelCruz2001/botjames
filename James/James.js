
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var mysql =require ('mysql')

// 
// import * as JsonEs from '';
// var base64= require('base-64');
// var utf8=require('utf8');
var btoa=require('btoa');
var base64img = require ('base64-img');
var app=express();
var Rara;
var NoRara=true;
var Busqueda,opciones,est;
var Si1,LeerMensajes=true;
var Mensajes,Idioma,Mensaje;
// Levantar Restify
var server = restify.createServer();
 const translate = require('google-translate-api');

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



//llenar la variable opciones
bot.use({
    
    botbuilder: (session, next)=>{
logMensajeEntrante(session,next);
    },
    send: (event,next)=>{
        logMensajeSaliente(event,next); 
    
}
})


bot.dialog('/', [
        function (session, results) {
            if(!session.conversationData.nuevo1){
            session.beginDialog('/obtenerIdioma');
            }
          
        
setTimeout(() => {
    
            if(!session.conversationData.nuevo1){
         session.send("Ayuda1");
         console.log("No manda")
         session.send("Opciones");
         //Respueta para buscar intencion
                console.log('se ejecutó2');
         session.beginDialog('/Canon');
         session.conversationData.nuevo1=true; 
            }else{
            //Hola
            console.log("Entro al aparato");
            session.send("Ayuda2");
        if (Idioma==='en') {Si1="Yes";}else {Si1="Si";}
            builder.Prompts.choice(session,"MostrarOpciones" ,Si1+"|"+"No",{ listStyle: builder.ListStyle.button });
            //Respueta para buscar intencion
            
        
        
            if(!session.conversationData.menu){
                console.log('se ejecutó');
                session.beginDialog('/Canon');
                session.conversationData.menu=true;
            }else{
                var op=results.response.entity;
                if(op==="Si"){
                    session.send(opciones);
                    
                }else{
                    session.send("QueBusco");
                }
                // session.beginDialog('/Canon');
            
            
            }
        }
    }, 1000);

    }
    
           ]);


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
                    
               Idioma=res.from.language.iso;
                session.preferredLocale(Idioma, err => {
                    if (!err) {
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
    


var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8838664-c1e4-41cd-b819-82fb018ba7df?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`
var Salon;
var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});


bot.dialog('/Canon',dialog);
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

            builder.Prompts.text(session,"PreguntarSalon");
           elsePregunt=true;
        }
    
            }, 
            (session,results,error)=>{
                    if (elsePregunt){
                        Salon = results.response.match(/b[0-1]{1}|c[0-6]{1}|d[0-8]{1}|e[0-6]{1}|h[0-4]{1}|m[0-3]{1}|B[0-1]{1}|C[0-6]{1}|D[0-8]{1}|E[0-6]{1}|H[0-4]{1}|M[0-3]{1}/g);
                        elsePregunt=false;
                    }
                    // 
                    
    connection.connect(function(err){
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }
         
          console.log('connected as id ' + connection.threadId);
    
    });

        var Json=require('./locale/'+Idioma+'/index.json')
   
                var consulta=`SELECT * FROM canones WHERE Salon='${Salon}'`;
                var query = connection.query(consulta, function(error, result){
                    console.log (result);
                    if(result){
                        let Extension=result.length;
                        if(Extension>0){
                            if(result[0].Estado==="Funcional"){
                                est = Json.SeEncuentra;
                            }else{
                                est=Json.Falla;
                        }
                          switch(Busqueda){
                            case "Color":
                            Rara=result[0].Color;
                                Mensaje=Json.EsDeColor;
                                session.send(Mensaje+" "+Rara);
                                 break;
                            case "Marca":
                                Rara=result[0].Marca;
                                Mensaje=Json.MarcaEs;
                                session.send(Mensaje+" "+Rara);
                                break;
                            case "Tipo_de_entrada":
                                Rara=result[0].Tipo_de_entrada;
                                Mensaje=Json.EntradaEs;
                                session.send(Mensaje+" "+Rara);
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
                                Rara=result[0].Estado;
                                Mensaje=est;
                                session.send(Mensaje+" "+Rara);
                                break;
                            case "*":
                            



                                 Rara=Json.EsDeColor+result[0].Color+"\n"+
                                Json.MarcaEs+result[0].Marca+"\n"+
                                Json.EntradaEs+result[0].Tipo_de_entrada+"\n"+
                                est+result[0].Estado;
                            
                                session.send(Rara);
                        
                        }
                        console.log("imagen :"+result[0].Imagen);
                        }else{
                           Rara="CañonNoEncontrado";
                        //    TenSalon=false;
                        }
                    }else{
                       throw error;
                     
                    }
                 }
                );
            setTimeout( function() {
               
        if(Rara==undefined){
            session.endDialog("BusquedaNoFunciona")
        }else {
            session.beginDialog('/Canon')
            connection.end();
        }
            }, 2000)
            }
            
       
        
    
   
]);
// bot.dialog('/TraerBD',[
//     functi'<on(session){}
// ])
// bot.dialog('/EstadoMostrar',[
//     (session)=>{
//     // var EstadoC=Rara.toLowerCase();
    
//      session.send(Rara);

//         session.beginDialog('/Canon');


// }
// ]);

dialog.matches('None',[
        (session,results)=>{
    session.send('CapacidadNull');
session.beginDialog('/Canon');
    }
]);

dialog.matches('TerminarConversacion',[
    (session,results)=>{
session.endDialog("UnPlacerAyudar")    
}
]);

dialog.matches('Saludo',[
    (session,results)=>{
        // console.log("Aqui entra 2")
        session.beginDialog('/');
    }
]);