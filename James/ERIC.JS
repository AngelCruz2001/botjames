Eric=(Mensaje)=>{
var natural = require('natural');
var a,b,c,d,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,x,y,z;
var ClaveEC=["eliminar","quitar","Borrar","desaparecer","deshacerme"];
var ClaveBC=["ver","funcionando","encuentra","funciona","estado","trabajando","salon","buscar"];
var DatosBC=["como esta el salon del ","como se encuentra el salon del ","en que estado esta el salon del ","como esta funcionando el cañon del ","se encuentra en funcionamiento el cañon de ","quiero ver el cañon del ","me dejas ver el cañon del ","necesito saber como esta el cañon del ","sera posible que me muestres el cañon del ","quiero ver el cañon del C4"]
var DatosEC=["me gustaria eliminar un cañon", "ya no quiero que este funcionando el salon","ya no funciona el salon del","quiero borrar el cañon del ","dejo de funcionar el cañon del ","quiero quitar el cañon del "]
var DatosNull=["De que color es el cielo","Como te llamas","Que has hecho ultimamente en tu vida","hola"];
var PalabrasBC=[];
var PalabrasEC=[];
var PalabrasNull=[]
var ExtencionBC=DatosBC.length;
var ExtencionEC=DatosEC.length;
var ExtensionNull=DatosNull.length;
var contA=0;
var tokenizer = new natural.WordTokenizer();
var DatoU=Mensaje.toLocaleLowerCase(); //Dato del Usuario
var Cont=0,Cont2=0,Cont3=0;
var Entidad;
var Expresion = /b[0-1]{1}|c[0-6]{1}|d[0-8]{1}|e[0-6]{1}|h[0-4]{1}|m[0-3]{1}|biblioteca|audiovisual/;
Entidad = DatoU.match(Expresion);
var DatoUPalabras=tokenizer.tokenize(DatoU);
var Band=false;
var BandB=false,BandE=false,BandN=false;
var Tipo;


for(a=0; a<DatosBC.length; a++){             

    var tokenizer = new natural.WordTokenizer();
        PalabrasBC[a]=tokenizer.tokenize(DatosBC[a]);
   }
   for(a=0; a<DatosEC.length; a++){

       var tokenizer = new natural.WordTokenizer();
           PalabrasEC[a]=tokenizer.tokenize(DatosEC[a]);
      }
      for(a=0; a<DatosNull.length; a++){

       var tokenizer = new natural.WordTokenizer();
           PalabrasNull[a]=tokenizer.tokenize(DatosNull[a]);
      }


for (l=0;l<DatoUPalabras.length;l++){


    for(s=0;s<ClaveBC.length;s++){

        if (DatoUPalabras[l]===ClaveBC[s]){
            Tipo="BC";
            s=ClaveBC.length;
            l=DatoUPalabras.length;
            break;
    }
        if (DatoUPalabras[l]==ClaveEC[s]){
            Tipo="EC";
            s=ClaveBC.length;
            l=DatoUPalabras.length;
            break;
        }
}

}
console.log(Tipo)
if (Tipo==null){Tipo="*"}

switch (Tipo) {
    case "BC":
            Cont=1.0
            console.log(DatosBC[j])
             Band=true;
             BandB=true;

        break;
    case "EC":
   
                Cont2=1.0
                console.log(DatosEC[j])
                 Band=true;
                 BandE=true;
                break;
        break;

    case "*":
    
    for (j=0;j<DatosNull.length; j++){
        // console.log(DatosBC.length);
        // console.log("Segundo: "+j)
            var Arreglo=PalabrasNull[j];
            
            // console.log(PalabrasBC[j]);
            var Dato1=natural.JaroWinklerDistance(DatoU,DatosNull[j] );
            if (Dato1>=.86){
                Cont3=1.0
                 Band=true;
                 BandN=true;
                break;
            }
            Cont3=Cont3+Dato1;
        //     for(t=0; t<Arreglo.length; t++){
        //         // console.log(i);
        //         var Dato2=na{tural.JaroWinklerDistance(DatoU,Arreglo);
        //         Cont2=Cont2+Dato2;

        // }
    }
        break;
}

 
var PromedioBC=0;
var PromedioEC=0;
var PromedioNull=0;

if(Band==false){
PromedioBC=Cont/ExtencionBC;
PromedioEC=Cont2/ExtencionEC
PromedioNull=Cont3/ExtensionNull
}else{
    if(BandB==true){
        PromedioBC=Cont;
        PromedioEC=Cont2/ExtencionEC;
        PromedioNull=Cont3/ExtensionNull;
    }else if (BandE==true){
        PromedioBC=Cont/ExtencionBC;
        PromedioEC=Cont2;
        PromedioNull=Cont3/ExtensionNull;
    }else if(BandN==true){
        PromedioBC=Cont/ExtencionBC;
        PromedioEC=Cont2/ExtencionEC;
        PromedioNull=Cont3;
    }

}

var Resultado=Math.max(PromedioBC,PromedioEC,PromedioNull );
if(Resultado===PromedioBC){
console.log("Buscar Cañones: "+PromedioBC);
}else if(Resultado===PromedioEC){
console.log("Eliminar Cañones: "+PromedioEC);
}else if(Resultado===PromedioNull){
console.log("None: "+PromedioNull);
}
if (Entidad!==null){
    console.log("Entidad: "+Entidad[0]);

}else{
    console.log("Entidad no localizada");
}

// return
}

exports.Eric=Eric;