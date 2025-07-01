

let wordsMap = new Map();

function RetrieveMap(){
       fetch('https://reiniskr1.pythonanywhere.com/static/JaunieVardi.json')
        .then(response => response.json())
        .then(data => {
            let max = -1;
            let arr = data.words
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
        // console.log(wordsMap);
        });
}





function SubmitClicked(){
    let lettersArr = [];
    let letters = document.getElementsByClassName("grid__element");
    for(let  i =0; i < letters.length; i++){
        lettersArr[i] ={xCor:letters[i].getBoundingClientRect().x, Letter: letters[i].innerHTML};
    }
    lettersArr.sort( compare );
    let word = ConvertArrToWord(lettersArr);
   if (CheckIfWordExists(word)){
       document.getElementById("BlockGrid").remove();


           renderRandomWord();
       UpdateScore();
        // document.getElementById("ScorePar").innerHTML = score.toString();
        // console.log(score);
   }


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
    function ScrambleWord(word){
         let arr = word.split('');           // Convert String to array
         arr.sort(function() {
            return 0.5 - Math.random();
         });
         word = arr.join('');                // Convert Array to string
         return word;                        // Return shuffled string
    }

let blockGrid = document.createElement("DIV");
blockGrid.setAttribute("id", "BlockGrid")
blockGrid.setAttribute("class", "grid");
     function renderRandomWord() {
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
function compare( a, b ) {
  if ( a.xCor < b.xCor ){
    return -1;
  }
  if ( a.xCor > b.xCor ){
    return 1;
  }
  return 0;
}

function ConvertArrToWord(arr){
    let res = "";
    for (let i = 0; i < arr.length; i++){
        res += arr[i].Letter;
    }
    // console.log(res);
    return res;
}


function CheckIfWordExists(word){
    let arr = wordsMap.get(word.length);
    console.log(word)
    for(let i =0 ; i < arr.length; i++) {
        let a = arr[i].toLowerCase();
        if (a === word.toLowerCase()) return true;
    }
    return false;

}

function UpdateScore(){
    let paragraph = document.getElementById("ScorePar");
    let scoreText = paragraph.textContent;
    let score  = parseInt(scoreText.split(':')[1]);
    console.log(score);
    console.log(typeof score);
    score++;
    paragraph.textContent = "Score:"+score;

}



RetrieveMap();


//TODO: sakartot leaderboard un pataisit, kad ievada vardu pareizi tiek generets jauns



