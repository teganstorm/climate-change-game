// By Tegan Friedenthal

// canvas stuff
var canvas;
var context;

canvas = document.getElementById("canvas");
context = canvas.getContext("2d");

//add event listeners to the canvas so we can use the mouse interaction
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mouseup", onMouseUp, false);

var canvaswidth = 860;
var canvasheight = 575;
canvas.width = canvaswidth;
canvas.height = canvasheight;

// dragging the bottles into the bin
function onMouseDown(e) {
    mouseX = e.pageX -200;
    mouseY = e.pageY -140;

    var i;
    for (i=0; i<bottlecount; i++) {
        // if the bottle is falling
        if (bottles[i].falling) {
            //alert("mouseX="+mouseX+" mouseY="+mouseY+" bX="+bottles[i].x +" bY="+bottles[i].y);

            if ((mouseX >= (bottles[i].x))&& 
                (mouseX <= (bottles[i].x + bottleFallWidth)) &&
                (mouseY >= (bottles[i].y)) && 
                (mouseY <= (bottles[i].y + bottleFallHeight))) {
                    //alert("found the bottle");
                    bottles[i].drag = true;

            }
        }
        // if the bottle is floating
        else {
            if ((mouseX >= (bottles[i].x)) && 
                (mouseX<= (bottles[i].x + bottleFloatWidth)) &&
                (mouseY >= (bottles[i].y)) && 
                (mouseY <= (bottles[i].y + bottleFloatHeight))) {
                    bottles[i].drag = true;
            }
        }
    } 
}
function onMouseMove(e) {
    mouseX = e.pageX -200;
    mouseY = e.pageY -140;
    var i;
    for (i=0; i<bottlecount; i++) {
        if (bottles[i].drag && bottles[i].falling) {
            bottles[i].x = mouseX - bottleFallWidth/2;
            bottles[i].y = mouseY - bottleFallHeight/2;
        } 
        else if (bottles[i].drag && bottles[i].floating) {
            bottles[i].x = mouseX - bottleFloatWidth/2;
            bottles[i].y = mouseY - bottleFloatWidth/2;
        }
    }
}
function onMouseUp(e) {
    var i;
    for (i=0; i<bottlecount; i++) {
        if (bottles[i].drag) {
            bottles[i].drag = false;
        }
    }
}

// score? 
var bottlessaved = 0;

// fish stuff
fishleft = new Image();
fishleft.src = 'fishleft.png';

fishright = new Image();
fishright.src = 'fishright.png';

fishdead = new Image();
fishdead.src = 'fishdead.png';

var fishWidth = 90;
var fishHeight = 66;

var fish1 = {
    alive : true,
    x : 25,
    y : 375,
    top : true,
    create : function(fishimage) {
        context.drawImage(fishimage, fish1.x, fish1.y, fishWidth, fishHeight);
    }
}
var fish2 = {
    alive : true,
    x : 385,
    y : 375,
    top : true,
    create : function(fishimage) {
        context.drawImage(fishimage, fish2.x, fish2.y, fishWidth, fishHeight);
    }
}
var fish3 = {
    alive : true,
    x : 745,
    y : 375,
    top : true,
    create : function(fishimage) {
        context.drawImage(fishimage, fish3.x, fish3.y, fishWidth, fishHeight);
    }
}
var fish4 = {
    alive : true,
    x : 226,
    y : bottom,
    top : false,
    create : function(fishimage) {
        context.drawImage(fishimage, fish4.x, fish4.y, fishWidth, fishHeight);
    }
}
var fish5 = {
    alive : true,
    x : 542,
    y : bottom,
    top : false,
    create : function(fishimage) {
        context.drawImage(fishimage, fish5.x, fish5.y, fishWidth, fishHeight);
    }
}
var fish = new Array(fish1, fish2, fish3, fish4, fish5);


// these values are for the top and bottom layers of the canvas 
// where the fish swim and the bottles float
var top = 375;  
var bottom = 475;

// bin
var binwidth = 174.9;
var binheight = 244;
var binX = 25;
var binY = 25;
var bin = {
    create : function() {
        binimage = new Image();
        binimage.src = 'bin.png';
        context.drawImage(binimage, binX, binY, binwidth, binheight);
    }
}

// make the bottles
var bottlefalling = new Image();
bottlefalling.onload = function() {
    drag();
};
bottlefalling.src = 'bottle.png';

var bottlefloating = new Image();
bottlefloating.onload = function() {
    drag();
};
bottlefloating.src = 'bottlefloat.png';

var bottleFallHeight = 172.5;
var bottleFallWidth = 127.5;
var bottleFloatHeight = 127.5;
var bottleFloatWidth = 172.5;

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function Bottle(bottlecount, x) {
    this.index = bottlecount;
    this.x = x;
    this.y = 0;
    this.falling = true;
    this.floating = false;
    this.drag = false;
}
function createBottle(image, x, y, width, height) {
    context.drawImage(image, x, y, width, height);
}
var bottlecount = 0;
var bottles = [];
// create a new bottle object and add it to the bottle array
function addbottle() {
    var x = randomIntFromInterval(200, 750);
    bottlecount++;
    var newbottle = new Bottle(bottlecount, x);
    bottles.push(newbottle);
}

// clear canvas
function clear() {
    context.clearRect(0, 0, canvaswidth, canvasheight);
}

// set up the canvas
function setupcanvas() {
    bin.create();
    var i;
    for (i=0; i<5; i++) {
        if ((fish[i].top) && (fish[i].alive)) {
            fish[i].create(fishleft);
        } else if ((!fish[i].top) && (fish[i].alive)) {
            fish[i].create(fishright);
        } else if (!fish[i].alive) {
            fish[i].create(fishdead);
        }
    }
    for (i=0; i<bottlecount; i++) {
        if (bottles[i].falling) {
            createBottle(bottlefalling, bottles[i].x, bottles[i].y, bottleFallWidth, bottleFallHeight);
        } else { // bottle is floating
            createBottle(bottlefloating, bottles[i].x, bottles[i].y, bottleFloatWidth, bottleFloatHeight);
        }
    } 
}
// make the fish swim
function fishSwim() {
    var i;
    for (i=0; i<5; i++) {
        if ((fish[i].top) && (fish[i].alive)) { // if the fish are on the top row they need to move to the left
            fish[i].x = fish[i].x - 3;
        } else if ((!fish[i].top) && (fish[i].alive)){ // if the fish are not on the top row (they are on the bottom row) they need to move to the right
            fish[i].x = fish[i].x + 3;
        }
    }
}
// keep the fish in the frame
function fishinframe() {
    var i;
    for (i=0; i<5; i++) {
        if ((fish[i].top) && (fish[i].x <= fishWidth) && (fish[i].alive)) {
            fish[i].top = 0;
            fish[i].y = 475;
        } else if ((!fish[i].top) && (fish[i].x >= (canvaswidth - fishWidth)) && (fish[i].alive)) {
            fish[i].top = 1;
            fish[i].y = 375;
        }
    }
}
// make the bottle fall
var fallspeed = 2;
function bottlefall() {
    var i;
    for (i=0; i<bottlecount; i++) {
        if ((bottles[i].falling) && (bottles[i].y <= (canvasheight-bottleFallHeight))&& (bottles[i].drag != true)) {
            bottles[i].y = bottles[i].y + fallspeed;
        }
    }
}
// make the bottle float if it hits the ground
function makebottlefloat() {
    var i;
    var temp;
    for (i=0; i<bottlecount; i++) {
        if ((bottles[i].y >= (canvasheight-bottleFallHeight) && (bottles[i].falling))) { //make the bottle float when it hits the ground
            bottles[i].falling = false;
            bottles[i].floating = true;
            
            temp = (bottles[i].bottlenumber)%3;
            if (temp == 0) {
                bottles[i].y = 250; // third layer which is the water level which is 250
            } else if (temp == 2) {
                bottles[i].y = 375;
            } else { // temp == 1
                bottles[i].y = 475;
            }
        }
    }
}
// make the bottle move if its floating
var floatspeed = -1;
function bottlefloat() {
    var i;
    for (i=0; i<bottlecount; i++) {
        if (bottles[i].floating && (bottles[i].drag != true)) { // the bottle needs to move left if its floating
            bottles[i].x = bottles[i].x + floatspeed;
        }
    }
}
// keep the bottle in the frame
function bottleinframe() {
    var i;
    for (i=0; i<bottlecount; i++) {
        if ((bottles[i].floating) && (bottles[i].x <= bottleFloatWidth)) {
            bottles[i].x = (canvaswidth - bottleFloatWidth);
        }
    }
}
// check if the fish have been killed by the bottle
function bottlekill() {
    var i;
    var j;
    for (i=0; i<5; i++) {
        for (j=0; j<bottlecount; j++) {
            if (((fish[i].x <= bottles[j].x) && (bottles[j].x <= (fish[i].x+fishWidth))) && ((fish[i].y <= bottles[j].y) && (bottles[j].y <= (fish[i].y+fishHeight)))) {
                    fish[i].alive = false;
            }
        }
    }
}
// check if any fish are alive, if they all dead then set time to 0
function fishalive() {
    var i;
    var fishalive = 0;
    var deadfish = 0;
    for (i=0; i<5; i++) {
        if (fish[i].alive) {
            fishalive ++;
        }
        else {
            deadfish ++;
        }
    }
    if (deadfish == 5) {
        endgame();
    }
}
// check if a bottle has been put in the bin
function bottleinbin() {
    var i;
    var bottledeleted = false;
    for (i=0; i<bottlecount; i++) {
        if ((bottles[i].x >= binX)&&
            (bottles[i].x <= binX+binwidth)&&
            (bottles[i].y >= binY)&&
            (bottles[i].y <= binY+binheight)) {
                bottles.splice(i, 1)
                bottledeleted = true;
                bottlecount--;
                bottlessaved++;
        }
    }
    // if we deleted a bottle now we need to re index the array
    if (bottledeleted){
        for (i=0; i<bottlecount; i++){
            bottles[i].index = i;
        }
    }
}

// timer
var time = 0;

function updatetime() {
    time++;
}
function settimer() {
    var timer = document.getElementById("timer");
    timer.innerHTML = "timer: " + time + "s";
}

// increasing speed for difficulty
function speedup() {
    fallspeed = fallspeed + fallspeed/2;
    floatspeed = floatspeed + floatspeed/2;
}

// goes along with updating the game I guess but this is the automatic interval stuff:
// need to have this in a function that is only called once the START is pressed to avoid 
// many bottles falling at the same time if the user waits many seconds before pressing start
// need to give time to read instructions.
// start the game
var mytimer;
var addingbottles;
var speedingup;
function start() {
    mytimer = setInterval(updatetime, 1000);
    addingbottles = setInterval(addbottle, 2000);
    speedingup = setInterval(speedup, 20000);


    // create restart button once start button clicked
    var startbutton = document.getElementById("button");
    startbutton.innerHTML = "RESTART";
    startbutton.addEventListener("click", restart, false)

    // call update
    update();
}

// restart the game
function restart() {

    clearInterval(mytimer);
    clearInterval(addingbottles);
    clearInterval(speedingup);

    gameover = false;
    time = 0;
    bottlessaved = 0;
    bottles.splice(0, bottlecount);
    bottlecount = 0;
    var i;
    for (i=0; i<5; i++) {
        fish[i].alive = true;
    }




}


// end the game
var gameover = false;
function endgame() {
    gameover = true;
    // did all the fish die?
    // you lost
    var notification = document.getElementById("scorescreen");
    notification.innerHTML = "you recycled "+bottlessaved+" botles in "+time+" seconds";
    // how many fish are still alive?
    // leader board?
    // input name?


    // clear();

    // option to restart?
}

// MAIN METHOD 
// update the game and keep everything moving smoothly
function update() { 
    settimer();
    // fishes and bottles setting up and moving
    clear();
    setupcanvas();
    fishalive();
    fishSwim();
    fishinframe();
    bottlefall();
    makebottlefloat();
    bottlefloat();
    bottleinframe();
    bottlekill();
    bottleinbin();


    // timer and checking if the game is finished yet
    settimer();
    if (!gameover){
        requestAnimationFrame(update);
    }
}
