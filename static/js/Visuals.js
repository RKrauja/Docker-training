    function makeContainersInvisible() {
        let containers = document.getElementById("contentDiv").getElementsByClassName("container");
        for (let i = 0; i < containers.length; i++) {
            containers[i].style.display = "none";
        }
    }
    function setNavActive(){
        const links = document.querySelectorAll('.nav-link');
        if (links.length) {
            links.forEach((link) => {
                link.addEventListener('click', (e) => {
                    links.forEach((link) => {
                        link.classList.remove('active');
                    });
                    e.preventDefault();
                    link.classList.add('active');
                });
            });
        }
    }
    function GameClicked(){
        makeContainersInvisible();
        if(!first)location.reload();
        document.getElementById("containerGame").style.display = "block"

    }
    function ResultsClicked(){
        makeContainersInvisible()
        document.getElementById("containerResults").style.display = "block"
        updateLeaderboard();
        CheckIfTwoButtonsExist()
    }
    function RulesCLicked(){
        makeContainersInvisible()
        document.getElementById("containerRules").style.display = "block"
        CheckIfTwoButtonsExist()
}
    function InfoCLicked(){
        makeContainersInvisible()
        document.getElementById("containerInfo").style.display = "block"
        CheckIfTwoButtonsExist()
}
    function ButtonClikced(){
        document.getElementById("linkGame").classList.add("active");
        document.getElementById("linkResults").classList.remove("active")
        CheckIfTwoButtonsExist()

    }
    function CheckIfTwoButtonsExist(){
        let b = document.getElementById("formContainer");
        let a = document.getElementById("TwoButtons")
        if(document.body.contains(a)){
            document.body.removeChild(a);
        }
        if(document.body.contains(b)){
            document.body.removeChild(b)
        }
}


    // Izveido taimeri
    let timer = document.getElementById("gameTimer")
    let allowedTime = 30
    let interval
    function startTimer(){
        interval && clearInterval(interval)
        interval = setInterval(() => {
            timer.innerText = "Atlikušais laiks: " + `${Math.floor(allowedTime)}s ${Math.floor((allowedTime % 1) * 100)}`
            allowedTime = allowedTime - 0.01

            if(allowedTime <= 0) {
                clearInterval(interval);
                createParagraph();


                // TODO spēles beigas
            }
        }, 10)
    }
    document.getElementById("containerGame").addEventListener("mousedown", (e) => {
        if(!e.target.classList.contains("grid__element")) return;
        startTimer();
    });


function createParagraph() {
    makeContainersInvisible();
    var container = document.createElement("div");
    container.id = "formContainer";
    var form = document.createElement("form");
    let par = document.createElement("h2");
    par.textContent = "Jūsu punktu skaits: "+getScore();
    form.innerHTML = '<label for="name">Ievadiet savu vārdu:</label><br><input type="text" id="name" name="name"><br><br><input type="submit" value="Ievadīt">';
    container.appendChild(par);
    container.appendChild(form);
    document.body.appendChild(container);
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = form.elements.name.value;
        if (name.trim() != "") {
          sendScore(name,getScore()) ;
          container.remove();
        }
        let mydiv = document.createElement("div");
        mydiv.id = "TwoButtons";
        let PlayAgainButton = document.createElement("button");
        let ViewLeaderBoardButton = document.createElement("button");
        PlayAgainButton.classList.add("btn");
        PlayAgainButton.classList.add("btn-light");
        PlayAgainButton.addEventListener("click", function (event){
            event.preventDefault();
            location.reload();
            GameClicked();
            mydiv.remove();
        });
        PlayAgainButton.innerText = "Play again";
        ViewLeaderBoardButton.innerText = "View Leaderboard";
        ViewLeaderBoardButton.classList.add("btn");
        ViewLeaderBoardButton.classList.add("btn-light");
        ViewLeaderBoardButton.addEventListener("click", function (event){
            event.preventDefault();
            let link = document.getElementById("linkResults");
            link.classList.add('active');
            link = document.getElementById("linkGame");
            link.classList.remove('active');
            ResultsClicked();
            mydiv.remove();

        })
        mydiv.appendChild(PlayAgainButton);
        mydiv.appendChild(ViewLeaderBoardButton);
        document.body.appendChild(mydiv);

    });
}

function getScore(){
    let paragraph = document.getElementById("ScorePar");
    let scoreText = paragraph.textContent;
    return parseInt(scoreText.split(':')[1]);

}

function SendResultToServer(player, score){
        fetch("https://reiniskr1.pythonanywhere.com/static/results.json", {
        method: "POST", headers:{"Content-type": "application/json"}, body: JSON.stringify(player)
    })
    .then(res=>res.json())
    .then(data=>{
    data.forEach((value) => document.getElementById("top").innerHTML+= "Name: " + value.name+" Score: " + value.points+"<br>");
})


}
function sendScore(name, points) {
    console.log(name + points);
  fetch('https://reiniskr1.pythonanywhere.com/VarduSpele', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, points})
  }).then(response => response.json())
    .then(result => {
      updateLeaderboard();
    });
}
function updateLeaderboard(){
     let a = document.getElementById("containerResults");
     let b = document.getElementById("rezultatuContainer")
    if(a.contains(b)) {
        a.removeChild(b);
        //document.getElementById("containerResults").removeChild(a);
    }
    fetch("https://reiniskr1.pythonanywhere.com/static/results.json")
        .then(response => response.json())
        .then(data => displayScore(data));
}
function displayScore(data) {

  const container = document.createElement('div');
  container.id = "rezultatuContainer"
 // container.style.display = 'flex';
  container.style.fontSize = '24px';
  container.style.fontWeight = 'bold';
 // container.style.color = '#333';

      data.forEach((value) =>{
          let entry = document.createElement("DIV");
          const lineBreak = document.createElement('br');
          const nameElement = document.createElement('p');
          nameElement.innerHTML = "Vārds: " + value.name;
          nameElement.style.marginRight = '16px';
          const scoreElement = document.createElement('p');
          scoreElement.innerHTML = "Punkti: " + value.points;
          entry.appendChild(nameElement);
          entry.appendChild(scoreElement);
          container.appendChild(entry);
          container.appendChild(lineBreak);

    });

  document.getElementById("containerResults").appendChild(container);
}





    let first = true;
    makeContainersInvisible()
    setNavActive()
    GameClicked();
            link = document.getElementById("linkGame");
            link.classList.add('active');
            first = false;