    //speles izveide

    function ScrambleWord(word){
         let arr = word.split('');           // Convert String to array
         arr.sort(function() {
            return 0.5 - Math.random();
         });
         word = arr.join('');                // Convert Array to string
         return word;                        // Return shuffled string
    }
    function chooseRandomNum(max, min){
        // find diff
        let difference = max - min;
        // generate random number
        let rand = Math.random();
        // multiply with difference
        rand = Math.floor( rand * difference);
        // add with min value
        rand = rand + min;
        return rand;
    }
    function chooseRandomWord(){
        let max = 20;
            //  let max =18;
        let word;
        let num = chooseRandomNum(max, 4);
        let arr = wordsMap.get(chooseRandomNum(max, 4));
        word = arr[chooseRandomNum(Object.keys(arr).length, 0)];
       // if(!CheckIfSimilarExists(word))chooseRandomWord();
        return word;

    }
    function Compare(str1, str2){
    let a;
     if (str1.length < str2.length) {
        a = str1.length;
     }else{
         a = str2.length
     }
     for (let i = 0;i < a;i++){
         let x = str1.indexOf(str2[i]);
         if (x === -1) return false
         str1 = str1.replace(str1[x],'');
     }
     return true;
}

     // console.log(chooseRandomWord(3, max));
   // console.log(max)

function fetchJson(){
    fetch('https://reiniskr1.pythonanywhere.com/static/JaunieVardi.json')
        .then(response => response.json())
        // .then(data => console.log(data.words));
        .then(data => ConvertToMap(data.words));

}
function ConvertToMap(arr){
    for (let i =0; i < arr.length;i++) {
        let word = arr[i]
        let a = []
        if(word.length < 3)continue;
        if (word.length > max)max = word.length;
        if(word.includes(' ')||word.includes('-') || word.includes('x') || word.includes('y')|| word.includes('w') || word.includes('w') )continue;
        if(wordsMap.has(word.length)){
          a = wordsMap.get(word.length)
          a.push(word)
        }else{
          a.push(word)
        }
        wordsMap.set(word.length, a)
       //console.log(word)
  }
    console.log(wordsMap);

     function renderRandomWord() {
         let a = document.getElementById("BlockGrid");
         if (document.body.contains(a)) {
                 a.innerHTML = "";
         }
        let word  = chooseRandomWord();
        console.log(word);
        let ScrambledWord = ScrambleWord(word);
        if (ScrambledWord === word){
            while (ScrambledWord===word){
                ScrambledWord = ScrambleWord(word);
            }
        }
        CreateBlocks(ScrambledWord);
    }

let blockGrid = document.createElement("DIV");
blockGrid.setAttribute("id", "BlockGrid")
blockGrid.setAttribute("class", "grid");

    renderRandomWord()
    document.querySelector("#newWord").addEventListener("click", ()=>{
        renderRandomWord();
    })



}


function CheckIfExists(wordOrg, wordNew){ // wordorg = generetais vards; wordNew = ievaditais vards
    if (Compare(wordOrg, wordNew)){
        let arr = wordsMap.get(wordNew.length);
        if (arr.includes(wordNew)){
            console.log("That is a valid word");
        }
        else{
            console.log("That word doesnt exist")
        }
    }else{
        console.log("the words do not contain the same letters")
    }
}

function CheckIfSimilarExists(word){
    let len = word.length
    let arr;
    for (let e = len; e > 3; e--) {
        arr = wordsMap.get(e);
        for (let i = 0; i < arr.length; i++) {
            if (Compare(word, arr[i]) && (word !== arr[i])) {
                console.log(arr[i]);
                return true;
            }

        }
    }
    return false;
}

function CreateBlocks(word){
    let container = document.getElementById("containerGame");
    blockGrid.innerHTML = "";
    container.appendChild(blockGrid);

    for (let i=0; i < word.length;i++){
        let block = document.createElement("DIV");
        let GridContainer = document.createElement("DIV");
        GridContainer.setAttribute("class", "grid__container");
        block.setAttribute("class", "grid__element");
        GridContainer.appendChild(block);
        block.innerHTML = word.charAt(i).toUpperCase();
        dragElement(block);
        blockGrid.appendChild(GridContainer);
    }


        new Swappable.default(document.querySelectorAll('.grid__container'), {
        draggable: '.grid__element'
});


}


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}




// syncReadFile('../static/JaunieVardi.txt');
// console.log(wordsMap.entries());
// //     console.log(wordsMap.entries())

    let wordsMap = new Map();
    let max = -1;
    fetchJson();



   // let word = chooseRandomWord();
   // console.log(word);
   // CheckIfExists(word);
    // let word = chooseRandomWord();
    //console.log(word);
    //console.log(ScrambleWord(ScrambleWord(word)));
  //  let word1 = "decembris";
   // let word2 = "cimds";
    //CheckIfExists(word1, word2);

   //


    //TODO: tiek izveidoti kustienami blokiq ar kuru palidzibu var salkt vardus seciba, atpazist x koordinati un nosaka secibu vardam, idela gadijuma snappo burtus vieta lai user interface butu krutaks

