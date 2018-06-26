var builder = require('botbuilder');
var restify =require ('restify');
var dotenv = require ('dotenv');


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

dotenv.config();

let luisApp =process.env.LUIS_APP;
let luisKey =process.env.LUIS_KEY;

var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/459e8c96-63c6-414c-a02e-2b4b2c7e5dc1?subscription-key=dfdc1c531aea42298eb62105fdb6d52a&verbose=true&timezoneOffset=0&q=`

var recognizer = new builder.LuisRecognizer(model);
var dialog= new builder.IntentDialog({recognizers:[recognizer]});
bot.dialog('/',dialog);

dialog.matches ('BuscarCañones',[
    function (session,args,next){
        // builder.Promts.text(session,'Hola, ¿En que puedo ayudarte?');
        var Salon1=builder.EntityRecognizer.findAllEntities(args.entities, 'Salon');
    //   Encontrar Args
        if (Salon1.length > 0){
            let msj = 'El salon que elegiste es: ';
            msj+= `**${Salon1[0].entity}**`;
            
        }else {
            session.send(''+Salon1);
        }
        
        // session.send(Salon1);

    }
]);

dialog.matches('None',[
    function(session,results){
    session.send('No tengo capacidades para ejecutar esa accion');
    }
]);

// bot.dialog('/', [
    
// ]);
