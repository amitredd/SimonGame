//declaring DOM
const startButton=document.getElementById('start');
const level=document.getElementById('level');
const score=document.getElementById('score');
const overlay = document.getElementById('overlay');
const overlayButton=document.getElementById('tryagain');


const arrayColor = ["red", "blue", "green", "yellow"]
const arrayActual = [];
const arrayClicked = [];
let highScore = 0;
let currScore = 0;
//At start of game we want start button enabled and rest all as disabled
function newGame(){
    arrayActual.length = arrayClicked.length =currScore =0;
    level.innerText="Level: "+ 1;
    startButton.innerText="Start";


    disableBoxButton(true,true);
    disableStartButton(false);
}
//Function for controlling UI and functions of start button
function disableStartButton(check){
   startButton.disabled=check;
   
   if(check){
     startButton.classList.add("disable");
   }
   else{
    startButton.classList.remove("disable");
   }

}
//Function for controlling UI and functions of box button elements
function disableBoxButton(check,UIcheck){
    const items = document.getElementsByClassName("box")
    for(const item of items){
           item.disabled=check;
          
        if(UIcheck){
            item.classList.add("disable");
        }
        else{
            item.classList.remove("disable");
        }

    }
}

function playsound(soundName){
   switch(soundName){
    case "coin":
           const audio = new Audio("./audio/coin_sound.wav");
           audio.play();
           break;
    
    case "lose":
           new Audio("./audio/lose.wav").play();  //shorthand
           break;
           
    case "start":
           new Audio("./audio/start.wav").play(); 
           break;
           
    case "try":
           new Audio("./audio/try.wav").play();
           break;  

    case "win":
           new Audio("./audio/win.wav").play();
           break;                

    default:
   }
}

//Function for blinking each time when its called from addColor(Called for whole arrayActual)
function activeBox(boxId){
   const boxid = document.getElementById(boxId);
   boxid.classList.add("boxpress");
   playsound("coin");

   setTimeout(()=>{
      boxid.classList.remove("boxpress");
   },400)
}

//Generating random color and pushing to arrayActual
function addColor(){

   arrayActual.push(arrayColor[Math.round(Math.random()*3)])
   console.log(arrayActual)
   
}

//Mainc function for the Game after clicking on Start
function generateRandomColor(){
   startButton.innerText="Wait";
   addColor(); 
   
    
   let index=0;
   const glowEach = setInterval(()=>{
       activeBox(arrayActual[index]);
       index++;
       
       if(index===arrayActual.length){
        startButton.innerText ="Guess";
        disableBoxButton(false,false)
        clearInterval(glowEach);
       }

   },600)

}

//After winning a level we need to update stuff on page
function winLevel(){
    arrayClicked.length = 0;
    level.innerText = `Current:${(arrayActual.length+1).toString()}`;
    startButton.innerText = "Start";
    //disabling so that cant press before again cliking on Start 
    disableBoxButton(true);
    playsound("win");
    

    setTimeout(()=>{
         disableBoxButton(true,true);
         disableStartButton(false);
    },1000);
    currScore++;
    if(currScore>highScore || highScore===0){
        score.innerText = `Highest: ${++highScore}`
    }
}

function loseLevel(){
    playsound("lose");
    //while lose sound is playing we should not access other functinality
    disableBoxButton(true,true);
    disableStartButton(true);
    startButton.innerText = "Start"
    //setting the timeout length accoding to above sound length
    setTimeout(()=>{
        overlayControl(true);
        newGame(); 
    },3000)
    
}

function overlayControl(check) {
	if (check) {
		overlay.classList.remove("hide");
	} else {
		overlay.classList.add("hide");
	}
}
//checking if both array are same
function check(first,second){
    const firstArray = [...first];
    const secondArray = [...second];

    for(let index =0;index < secondArray.length; index++){
        if(firstArray[index]!==secondArray[index]) return false;
    }
    return true;
}

function checkColorSet(){
    //lose
    if(!check(arrayActual,arrayClicked)) loseLevel();
    else if(arrayActual.length===arrayClicked.length && arrayClicked.length!==0) winLevel();//win 
}

startButton.addEventListener("click",()=>{
    disableStartButton(true);
    disableBoxButton(true,false);
    generateRandomColor();
    playsound("start");
})
//controlling overlay 
overlayButton.addEventListener("click",()=>{
    playsound("try");
    overlayControl(false);
})
newGame();

for(const item of document.getElementsByClassName("box")){
    item.addEventListener("click",()=>{
        
        playsound("coin");
        const id = item.getAttribute("id");
        arrayClicked.push(id);
        checkColorSet();
        
    })

}

