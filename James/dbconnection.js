var express =require ('express');
var mysql =require ('mysql')
var app=express();


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

// app.get('/',function(req,resp){
 
// connection.query("SELECT * FROM canones where Salon='E4'",function(error,rows,fields){
//     if (error){
//         console.log('Eror en la consulta');
 
//     }else{
//      console.log(rows)
//      console.log(rows[0].Estado)
//     }
// });
// });

// app.listen(3000);




var query = connection.query("SELECT * FROM canones where Salon='E4'", function(error, result){
    if(error){
       throw error;
    }else{
       var resultado = result;
       if(resultado.length > 0){
          console.log(resultado[0].Estado);
       }else{
          console.log('Registro no encontrado');
       }
    }
 }
);
connection.end();