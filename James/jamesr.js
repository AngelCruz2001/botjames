
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var mysql =require ('mysql')
var Json;
// var base64= require('base-64');
// var utf8=require('utf8');
var base64img = require ('base64-img');
var btoa=require('btoa');
var error_log=false;
var seleccionarIdioma=true;
var error_contra=false;
var Nombre="";
var app=express();
var Rara,Raraimg;
var NoRara=true;
var Idioma;
var Busqueda,opciones,est,direccionI='C:\\imgsBot',nombrebd,correobd,contrasenabd,tipobd;
// Levantar Restify
var server = restify.createServer();
//API de google traductor
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




// Conexion a base de datos 1
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
// dialogo raiz
bot.dialog('/', [
    
        (session,results,next)=>{
            console.log("Error de contraseña"+error_contra);
            if(seleccionarIdioma){
                session.beginDialog('/obtenerIdioma');
            }
            
                
              setTimeout(() => {
console.log("entro al setTimeout");
Json=require('./locale/'+Idioma+'/index.json')
                if(!session.conversationData.nuevo1){
                    if(error_log){
                            session.send(Json.Login_error);
                            builder.Prompts.text(session,Json.Login_correo2);
                    }else{
                        session.send(Json.Saludo1);
                        //  console.log("No manda")
                        builder.Prompts.text(session,Json.Login_correo);
                        // session.conversationData.nuevo1=true;
                                console.log('se ejecutó2');
                    }
                      
                       
          
                    }else{
                        session.conversationData.nuevo1=false;
                        next();
                    }
                    
        }, 1000);
            
            
               },
               (session,results,next)=>{
                    if(!session.conversationData.nuevo1){
                        if(Nombre===""){
                        Nombre=results.response;
                    
                       
                console.log(Nombre);
                var consultaLogin=`SELECT Nombre,Contrasena,Tipo FROM usuarios WHERE Nombre='${Nombre}'`;
                var queryLogin=connection.query(consultaLogin,(error,result)=>{
                    if(result){
                        let longitud=result.length;
                        console.log(longitud);
                        if(longitud>0){
                            contrasenabd=result[0].Contrasena;
                            tipobd=result[0].Tipo;
                            nombrebd=result[0].Nombre
                            console.log("contra :"+contrasenabd);
                            console.log("tipo :"+tipobd);
                            builder.Prompts.text(session,"Login_contrasena");

                        }else{
                           error_log=true;
                                session.conversationData.nuevo1=false;
                                seleccionarIdioma=false;
                                 session.beginDialog('/'); 
                        }
                    }else{
                        throw error;
                    }
                });
            }else{
                builder.Prompts.text(session,"Login_contrasena");
                next();
            }
                    }else{
                        session.conversationData.nuevo1=false;
                        next();
                    }
                    
            },(session,result,next)=>{
                var contra=result.response;
                console.log("contrabd: "+contrasenabd+" contra: "+contra )
                if(contra===contrasenabd){
                    console.log("logeado!!!");
                    session.conversationData.nuevo1=true;
                    session.conversationData.menu=true;
                    error_contra=false;
                    next();
                    
                }else{
                    console.log("entro en error de contraseña");
                    seleccionarIdioma=false;
                    // error_contra=true;
                    session.conversationData.nuevo1=true;
                    session.beginDialog('/');
                }
            }
                ,(session,result,next)=>{

              if(!session.conversationData.nuevo1){
                console.log("Entro al aparato");
                session.conversationData.menu=false;
                session.send(Json.Saludo2+", "+Json.Ayuda);
            if (Idioma==='en') {Si1="Yes";}else {Si1="Si";}
                builder.Prompts.choice(session,"MostrarOpciones" ,Si1+"|"+"No",{ listStyle: builder.ListStyle.button });
                //Respueta para buscar intencion
              }else{
                  next();
              }
            },(session,results)=>{

                if(session.conversationData.menu){
               
                    console.log('se ejecutó');
                    session.send(Json.AntesDeBuscar+" "+nombrebd+", "+Json.Ayuda);
                    session.beginDialog('/Canon');
                    session.conversationData.menu=false;
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
  ]);
// bot.dialog('/contrasena',[
//     (session)=>{
//         builder.Prompts.text(session,"Login_contrasena");
//     },(session,result,next)=>{
//         var contrasena=result.response;
        
//         if(contrasena===contrasenabd){
//             console.log("Logeado");
//             error_contra=false;
//         }else{
//             error_contra=true;
//         }

//         next();
       
//     }
// ]);
  logMensajeEntrante=(session,next)=>{
   console.log("Mensaje de entrada: "+session.message.text);
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
                console.log("No hay error");

            } else {
               console.log("error: "+err);
            }
        });
    // }, 1000);
    }).catch(err => {
        console.log("error: "+err);
    });
        }
    ]);

var model = `	https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8838664-c1e4-41cd-b819-82fb018ba7df?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`
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

            builder.Prompts.text(session,'Muy bien, ¿De que salon es el proyector que te interesa?');
           elsePregunt=true;
        }

            },
            (session,results,error)=>{
                    if (elsePregunt){
                      Salon = results.response.match(/b[0-1]{1}|c[0-6]{1}|d[0-8]{1}|e[0-6]{1}|h[0-4]{1}|m[0-3]{1}|B[0-1]{1}|C[0-6]{1}|D[0-8]{1}|E[0-6]{1}|H[0-4]{1}|M[0-3]{1}/g);
                        elsePregunt=false;
                    }
                    // Conexion a la base de datos 

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
                                Rara=btoa(result[0].Imagen);
                               Raraimg=Rara
                            session.beginDialog('/Imagen');
                            throw error;
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
                                Raraimg=btoa(result[0].Imagen);
                                session.send(Rara);
                                session.beginDialog('/Imagen');

                        }
                       console.log('busqueda:  '+Busqueda);
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

            // if(Busqueda==='Imagen'){
            //     session.beginDialog('/Imagen');
            // }
            // }else if(Busqueda==='*'){
            //     session.beginDialog('/EstadoMostrar')
            //     session.beginDialog('/Imagen');
            // }else{
            //     session.beginDialog('/EstadoMostrar')
            // }
            // // connection.end();
            if(Busqueda!=='Imagen' && Busqueda!=='*'){
                session.beginDialog('/Canon');
            }
           
        }
            }, 2000)
            }

]);
bot.dialog('/Imagen',[

    (session)=>{
        base64img.img(`data:image/png;base64,${Raraimg}`,"C:\\imgsBot",`${Salon}`,function(err,filepath){

        });
        direccion=direccionI+"\\"+Salon+".png"
        var heroCard= new builder.HeroCard(session,direccion)
            .title('Imagen del cañon')
            .subtitle('')
            .text('Encontre esto :)')
            .images([
                builder.CardImage.create(session,direccion)
            ])
            .buttons([

            ]);
            var msj=new builder.Message(session).addAttachment(heroCard);
            session.send(msj);
            session.beginDialog('/Canon');
    }
]);
// bot.dialog('/EstadoMostrar',[
//     (session)=>{
//     // var EstadoC=Rara.toLowerCase();
//      session.send(Rara);
//
//
//
//
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
session.endDialog("UnPlacerAyudar");

}
]);

dialog.matches('Saludo',[
    (session,results)=>{
        // console.log("Aqui entra 2")
        // session.beginDialog('/');
    }
]);
