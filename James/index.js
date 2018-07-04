
var Mensaje;
// var tokenizer = new natural.WordTokenizer();
// console.log(tokenizer.tokenize("Retana esta muy menso."));

// tokenizer = new natural.TreebankWordTokenizer();
// var Azul= tokenizer.tokenize("u si esta muy menso");

// console.log(natural.HammingDistance("Azul", "kathrin", true));
// console.log(natural.HammingDistance("karolin", "kerstin", true));
// console.log(natural.HammingDistance("short string", "longer string", true));

// console.log(natural.JaroWinklerDistance("dixon","dicksonx"));
// 

console.log("Escribe tu nombre");
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
     Mensaje=d.toString().trim();
  });



  return Mensaje;
