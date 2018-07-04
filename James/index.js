var natural = require('natural');
// var tokenizer = new natural.WordTokenizer();
// console.log(tokenizer.tokenize("Retana esta muy menso."));

// tokenizer = new natural.TreebankWordTokenizer();
// var Azul= tokenizer.tokenize("u si esta muy menso");

// console.log(natural.HammingDistance("Azul", "kathrin", true));
// console.log(natural.HammingDistance("karolin", "kerstin", true));
// console.log(natural.HammingDistance("short string", "longer string", true));

// console.log(natural.JaroWinklerDistance("dixon","dicksonx"));
// 
var a,b,c,d,f,g,h,i,j,kl,m,n,ñ,o,p,q,r,s,t,u,v,x,y,z;
var DatosBC=["Como esta el salon del ","Como se encuentra el salon del ","En que estado esta el salon del "]
var DatosEC=["Me gustaria eliminar un cañon", "Ya no quiero que este funcionando el salon","Ya no funciona el salon del"]
var DatosNull=["De que color es el cielo"];
var PalabrasBC=[];
var PalabrasEC=[];
var PalabrasNull=[]

var tokenizer = new natural.WordTokenizer();
var DatoU=tokenizer.tokenize("De que color es el cielo"); //Dato del Usuario
var Cont=0,Cont2=0,Cont3=0;
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
for (i=0; i<DatoU.length;i++){
    // console.log("Primero: "+i)

    for (j=0;j<DatosBC.length; j++){
        // console.log(DatosBC.length);
        // console.log("Segundo: "+j)
            var Arreglo=PalabrasBC[j];
            // console.log(PalabrasBC[j]);
            var Dato1=natural.LevenshteinDistance(DatoU,Arreglo, true);
            Cont=Cont+Dato1;
        //     for(t=0; t<Arreglo.length; t++){
        //         // console.log(i);
        //         var Porcentaje=natural.LevenshteinDistance(DatoU[i], Arreglo[t]);
        //        Cont=Cont+parseFloat(Porcentaje);

        // }
    }
}


for (i=0; i<DatoU.length;i++){
    // console.log("Primero: "+i)

    for (j=0;j<DatosEC.length; j++){
        // console.log(DatosBC.length);
        // console.log("Segundo: "+j)
            var Arreglo=PalabrasEC[j];
            
            // console.log(PalabrasBC[j]);
            var Dato1=natural.LevenshteinDistance(DatoU,Arreglo, true);
            Cont2=Cont2+Dato1;
        //     for(t=0; t<Arreglo.length; t++){
        //         // console.log(i);
        //         var Dato2=natural.LevenshteinDistance(DatoU,Arreglo);
        //         Cont2=Cont2+Dato2;

        // }
    }
}

for (i=0; i<DatoU.length;i++){
    // console.log("Primero: "+i)

    for (j=0;j<DatosNull.length; j++){
        // console.log(DatosBC.length);
        // console.log("Segundo: "+j)
            var Arreglo=PalabrasNull[j];
            
            // console.log(PalabrasBC[j]);
            var Dato1=natural.LevenshteinDistance(DatoU,Arreglo, true);
            Cont3=Cont3+Dato1;
        //     for(t=0; t<Arreglo.length; t++){
        //         // console.log(i);
        //         var Dato2=natural.LevenshteinDistance(DatoU,Arreglo);
        //         Cont2=Cont2+Dato2;

        // }
    }
}

console.log("Buscar Cañones: "+Cont);
console.log("Eliminar Cañones: "+Cont2);
console.log("None: "+Cont3);