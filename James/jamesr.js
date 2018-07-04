
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
var logeado=true;
var app=express();
var Rara,Raraimg;
var NoRara=true;
var Idioma;
var Busqueda,CRUD,est,direccionI='C:\\imgsBot',nombrebd,Nombre,contrasenabd,Contrasena,tipobd,propiedades;
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
    //saber lo que me escribe el usuario al inico de la conversacion
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
            
            if(seleccionarIdioma){
                session.beginDialog('/obtenerIdioma');
            }
              setTimeout(() => {
                console.log("entro al setTimeout");
                Json=require('./locale/'+Idioma+'/index.json')
                if(!session.conversationData.Nonuevo){
                    session.send(Json.Saludo1+", "+Json.Ayuda);
                    session.send(Json.Opciones);
                    session.conversationData.menu=false;
                    next();
                    
                }else{
                    session.send(Json.Saludo2+", "+Ayuda)
                    console.log("Entro al aparato");
                session.conversationData.menu=true;
                session.send(Json.Saludo2+", "+Json.Ayuda);
            if (Idioma==='en') {Si1="Yes";}else {Si1="Si";}
                builder.Prompts.choice(session,"MostrarOpciones" ,Si1+"|"+"No",{ listStyle: builder.ListStyle.button });
                }   
        }, 1000);
               }
                ,(session,results)=>{

                if(!session.conversationData.menu){
               
                    console.log('se ejecutó');
                    session.conversationData.menu=false;
                    session.conversationData.Nonuevo=true;
                    session.beginDialog('/Canon');
                    
                }else{
                    var op=results.response.entity;
                    if(op==="Si"){
                        session.send("Opciones");

                    }else{
                        session.send("QueBusco");
                    }
                    // session.beginDialog('/Canon');


                }
            }
  ]);
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
        var ExtensionS,ExtensionC,ExtensionM,ExtensionI,ExtensionE,ExtensionA,ExtensionB,ExtensionCr;

        var Salon1=builder.EntityRecognizer.findAllEntities(args.entities, 'Salon');
        var Color1=builder.EntityRecognizer.findAllEntities(args.entities,'Color');
        var Marca1=builder.EntityRecognizer.findAllEntities(args.entities,'Marca');
        var Entrada1=builder.EntityRecognizer.findAllEntities(args.entities,'Entrada');
        var Imagen1=builder.EntityRecognizer.findAllEntities(args.entities,'Imagen');
        var Estado1=builder.EntityRecognizer.findAllEntities(args.entities,'Estado');
        var Actualizar1=builder.EntityRecognizer.findAllEntities(args.entities,'Actualizar');
        var Borrar1=builder.EntityRecognizer.findAllEntities(args.entities,'Borrar');
        var Crear1=builder.EntityRecognizer.findAllEntities(args.entities,'Crear');

        ExtensionS=Salon1.length;
        ExtensionC=Color1.length;
        ExtensionM=Marca1.length;
        ExtensionE=Entrada1.length;
        ExtensionI=Imagen1.length;
        ExtensionEs=Estado1.length;
        ExtensionA=Actualizar1.length;
        ExtensionB=Borrar1.length;
        ExtensionCr=Crear1.length;




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

        if(ExtensionA>0){
            CRUD="Actualizar";
        }else if(ExtensionB>0){
            CRUD="Borrar";
        }else if(ExtensionCr>0){
            CRUD="Crear"
        }else{
            CRUD="Leer";
        }
        console.log("CRUD: "+CRUD);
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
                    //Aqui va mi hermoso codigo
                    if(CRUD==="Crear" || CRUD==="Borrar" || CRUD==="Actualizar"){
                        var consultaBA=`SELECT * FROM canones WHERE Salon='${Salon}'`;
                        var queryBA=connection.query(consultaBA,(error,result)=>{
                            if(result){
                                let long=result.length;
                                if(long>0){
                                    propiedades={
                                        "Color":result[0].Color,
                                        "Marca":result[0].Marca,
                                        "Tipo_de_entrada":result[0].Tipo_de_entrada,
                                        "Imagen":result[0].Imagen,
                                        "Estado":result[0].Estado
                                };


                                }
                            }
                        });
                        session.beginDialog('/login');
                        switch(CRUD){
                            case "Crear":
                                session.beginDialog('/Crear');
                            break;
                            case "Borrar":
                                session.beginDialog('/Borrar');
                                break;
                            case "Actualizar":
                                session.beginDialog('/Actualizar');
                                break;
                        }
                    }else{
                        session.beginDialog('/Leer');
                    }
                   


                   


                


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
       
        session.beginDialog('/');
    }
]);
bot.dialog('/Crear',[

]);
bot.dialog('/Leer',[
    (session)=>{
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
    }
]);

bot.dialog('/Actualizar',[
    (session)=>{
        //saber primero que datos hay antes de actualizar

       builder.Prompts.text(session,Json.AntesDeBuscar+" "+Busqueda);
    },(session,result)=>{
        var nuevoDato=result.response;
        var consultaUpdate=`UPDATE  canones SET ${Busqueda} = '${nuevoDato}' WHERE '${Busqueda}'= ${propiedades+"."+Busqueda} `;
    }
]);
bot.dialog('/Borrar',[
    

]);
bot.dialog('/login',[
    (session)=>{
        if(logeado){
            builder.Prompts.text(session,Json.Login_correo);
        }
        
    },(session,result,next)=>{
        if(logeado){
        Nombre=result.response;
        var consultaLogin=`SELECT Nombre,Contrasena,Tipo FROM usuarios WHERE Nombre='${Nombre}'`;
        var queryLogin=connection.query(consultaLogin,(error,result)=>{
            if(result){
                var long=result.length;
                if(long>0){
                    nombrebd=result[0].Nombre
                    contrasenabd=result[0].Contrasena;
                }
            }
        });
    }else{
        next();
    }
    },(session,result,next)=>{
        if(Nombre===nombrebd){
            builder.Prompts.text(session,Json.Login_contrasena);
        }else{
            session.beginDialog('/login');
            logeado=true;
        }
    },(session,result)=>{
        Contrasena=result.response;
        if(Contrasena===contrasenabd){
            logeado=true;
            session.send(Json.Logeado);
        }else{
            logeado=false;
            session.send(Json.Login_contrasena_error);
            session.beginDialog('/login');
        }
    }
]);

