
var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');
var express =require ('express');
var mysql =require ('mysql')
var btoa=require('btoa');
var base64img = require ('base64-img');
var app=express();
var Nombre="";
var Rara,Raraimg;
var NoRara=true;
var Busqueda,opciones,est;
var Si1,LeerMensajes=true;
var Mensajes,Idioma,Mensaje;
var Json;
var error_log=false;
var seleccionarIdioma=true;
var error_contra=false;
var Busqueda,opciones,est,direccionI='C:\\imgsBot',nombrebd,correobd,contrasenabd,tipobd;

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
                connection.end();
            });
        }else{
            builder.Prompts.text(session,"Login_contrasena");
            next();
        }
                }else{
                    session.conversationData.nuevo1=false;
                    next();
                }
                
        },
        (session,result,next)=>{
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
        },
        (session,results,next)=>{

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
          },
          (session,results)=>{

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
bot.dialog('/aaa',[
    (session,next)=>{
            setTimeout(() => {
    
                if(!session.conversationData.nuevo1){
             session.send("Saludo1");
             session.send("Ayuda")
    
    
    //          var msg = new builder.Message(session)
    //     .speak('puedes cambiar el idioma mandando a palabra idioma en cualquier punto de la conversacion')
    //     .inputHint(builder.InputHint.acceptingInput);
    // session.send(msg).endDialog();
    
    
    
             console.log("No manda")
             session.send("Opciones");
             //Respueta para buscar intencion
                    console.log('se ejecutó2');
             session.beginDialog('/Canon');
             session.conversationData.nuevo1=true; 
                }else{
                //Hola
                session.conversationData.menu=true;
                console.log("Entro al aparato");
                session.send("Saludo2");
                session.send("Ayuda");
            if (Idioma==='en') {Si1="Yes";} else {Si1="Si";};
                builder.Prompts.choice(session,"MostrarOpciones" ,Si1+"|"+"No",{ listStyle: builder.ListStyle.button });
                //Respueta para buscar intencion
                
            next();
                }
            
            }, 1000);
        },
        (session,results)=>{
    
    
       
    
                if(!session.conversationData.menu){
                    console.log('se ejecutó');
                    session.beginDialog('/Canon');
                    session.conversationData.menu=true;
                }else{
                    var op=results.response.entity;
                    console.log(op);
                    if(op==Si1){
                        session.send("Opciones");
                        console.log("Estas menso no es por el internet1")
                    }else{
                        console.log("Estas menso no es por el internet2")
                        session.send("QueBusco");
                    }
                    session.beginDialog('/Canon');
                }
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


        var Json=require('./locale/'+Idioma+'/index.json')
   
                var consulta=`SELECT * FROM canones WHERE Salon='${Salon}'`;
                var query = connection.query(consulta, function(error, result){
                    console.log (result);
                    if(result){
                    var MensajeColor=String(result[0].Color)
                    var MensajeEstado=String(result[0].Estado)
                    var EstadoC,ColorC;
                        translate(MensajeEstado, {to: Idioma}).then(res => {
                             EstadoC=res.text;
                             console.log(EstadoC)
                            //=> I speak English
                            console.log(res.from.language.iso);
                            //=> nl
                        }).catch(err => {
                            console.error(err);
                        });
                        
                        translate(MensajeColor, {to: Idioma}).then(res => {
                           ColorC=res.text;
                           console.log(ColorC)
                            //=> I speak English
                            console.log(res.from.language.iso);
                            //=> nl
                        }).catch(err => {
                            console.error(err);
                        });
                    }else{
                        throw error;
                      
                     }
                setTimeout(() => {
    
                      if(result) {    
                        let Extension=result.length;
                        if(Extension>0){
                            if(result[0].Estado===("Funcional")){
                                est = Json.SeEncuentra;
                            }else{
                                est=Json.Falla;
                        }
                          switch(Busqueda){
                            case "Color":
                            Rara=ColorC;
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
                            console.log( 'imagen:  '+Rara);
                            base64img.img(Rara,"C:\\Users\\Angel E. Retana\\Desktop","imagen",function(err,filepath){
                                if(err){
                                    console.log('Hubo un error!!!!!!');
                                }
                            });
                                break;
                            case "Estado":

                                Rara=EstadoC;
                                Mensaje=est;
                                session.send(Mensaje);
                                break;
                            case "*":
                            



                                 Rara=Json.EsDeColor+" "+ColorC+"\n"+
                                Json.MarcaEs+" "+result[0].Marca+"\n"+
                                Json.EntradaEs+" "+result[0].Tipo_de_entrada+"\n"+
                                est+" "+EstadoC;
                            
                                session.send(Rara);
                        
                        }
                        console.log("imagen :"+result[0].Imagen);
                        }else{
                           Rara="CañonNoEncontrado";
                        //    TenSalon=false;
                        }
                    }else {
                         throw error
                        }
                    }, 1000);
                  
                 }
                );
            setTimeout( function() {
               
        if(Rara===undefined){
            session.endDialog("BusquedaNoFunciona")
        }else {
            connection.end();
            session.beginDialog('/Canon')
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