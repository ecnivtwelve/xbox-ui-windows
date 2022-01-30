// imports
const fs = require('fs');
var cp = require("child_process");

// dossier documents/xbox
let documents = "C:/Users/" + require("os").userInfo().username + "/Documents";
let xbox = documents + "/Xbox";
let assets = xbox + "/Assets";
let games = xbox + "/Games";
let wallpaper = assets + "/video.mp4"
let profilepic = assets + "/gamerpic.png"
let gamertag = assets + "/gamertag.txt";
let gamerdescription = assets + "/gamerdescription.txt";
let gamercolor = assets + "/gamercolor.txt";

// colors
const content3 = fs.readFileSync(gamercolor);
var root = document.querySelector(':root');
root.style.setProperty('--theme-color', content3.toString());

// gamertag & gamerdescription
const content = fs.readFileSync(gamertag);
$("#gamertag").html(content.toString());
let gamertag_full = content.toString();

const content2 = fs.readFileSync(gamerdescription);
$("#gamerdescription").html(content2.toString());

// fond d'écran
document.getElementById("wallpaper").src = wallpaper;
document.getElementById("profilepic").src = profilepic;

// startup
setTimeout(function(){
    $("#startup").css("display", "none");
}, 8000);

setTimeout(function(){
    $("#dashboard").css("display", "block");
}, 5000);

setTimeout(function(){
    $("#dashboard").css("display", "none");
}, 7000);

setTimeout(function(){
    $("#wallpaper").css("display", "block");
}, 8400);

setTimeout(function(){
    $("#dashboard").css("display", "block");

    setTimeout(function(){
        var login_sound = new Audio("assets/login.mp3");
        login_sound.play()
        $("#dashboard").append(`<div class="login">
            <img class="log_img" src="${profilepic}">
            <p class="log_txt">Bonjour, ${gamertag_full}</p>
        </div>`);
    }, 500);
}, 9000);

// heure
setInterval(() => {
    var time = new Date();
    let heure = ('0'+time.getHours()).slice(-2);
    let mins = ('0'+time.getMinutes()).slice(-2);
    let temps = heure + ":" + mins;
    document.getElementById("time").innerHTML = temps;
}, 10);

// dom navigator
var el = document.querySelector('#gamelist');
new DomNavigator(el);

// get games
fs.readdir(games, (err, files) => {
    let tilenbr = 0;

    files.forEach(file => {
        let tileimg = games + "/" + file + "/tile.png";
        document.getElementById("game-"+tilenbr).style.backgroundImage = "url('"+tileimg+"')";

        tilenbr = tilenbr + 1;
    });
});

// notifications

var notification_sound = new Audio("assets/notification.mp3");

function notify(img, text) {
    setTimeout(function(){
        notification_sound.play();
    }, 100);

    $("#dashboard").append(`<div class="new-notification">
    <img class="not_img" src="${img}">
    <p class="not_txt">${text}</p>
</div>`);
}

// xbox controller
Controller.search();

window.addEventListener('gc.controller.found', function(event) {
    let controller = event.detail.controller;
    notify(
        "assets/controller.jpeg",
        "Une nouvelle manette Xbox à été reconnue par votre console."
    )
}, false);

window.addEventListener('gc.controller.lost', function(event) {
    notify(
        "assets/controller.jpeg",
        "Votre manette Xbox vient d'être déconnectée de votre console."
    )
}, false);

function goLeft() {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowLeft",
        keyCode: 37,
        code: "ArrowLeft",
        which: 37,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    }));

    var navigation_sound = new Audio("assets/navigate.mp3");
    navigation_sound.play();
}

function goRight() {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowRight",
        keyCode: 39,
        code: "ArrowRight",
        which: 39,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    }));

    var navigation_sound = new Audio("assets/navigate.mp3");
    navigation_sound.play();
}

function goUp() {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowUp",
        keyCode: 38,
        code: "ArrowUp",
        which: 38,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    }));

    var navigation_sound = new Audio("assets/navigate.mp3");
    navigation_sound.play();
}

function goDown() {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowDown",
        keyCode: 40,
        code: "ArrowDown",
        which: 40,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    }));

    var navigation_sound = new Audio("assets/navigate.mp3");
    navigation_sound.play();
}

window.addEventListener('gc.controller.found', function(event) {
    var controller = event.detail.controller;
    console.log("Controller found at index " + controller.index + ".");
    console.log("'" + controller.name + "' is ready!");
}, false);

window.addEventListener('gc.controller.lost', function(event) {
    console.log("The controller at index " + event.detail.index + " has been disconnected.");
    console.log(Controller.getController(0));
}, false);

window.addEventListener('gc.button.press', function(event) {
    let button = event.detail;

    if(button.name === "DPAD_LEFT") {
        goLeft();
    }
    if(button.name === "DPAD_RIGHT") {
        goRight();
    }
}, false);

window.addEventListener('gc.analog.start', function(event) {
    let button = event.detail;

    if(button.position.x < -0.1) {
        goLeft();
    }
    if(button.position.x > 0.1) {
        goRight();
    }
}, false);

// select & open game
window.addEventListener('gc.button.press', function(event) {
    let button = event.detail;

    if(button.name === "FACE_1") {
        let gameClass = document.getElementsByClassName("selected")[0].id;
        console.log("gameclass : " + gameClass);

        let str = gameClass.slice(5);
        console.log("str : " + str);

        fs.readdir(games, (err, files) => {
            let folder = files[str];
            let launcher = games + "/" + folder + "/launcher.lnk";

            console.log("launcher : " + launcher);

            cp.exec('"' + launcher + '"');
        });
    }
}, false);

// fps and measures
const times = [];
let fps;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;

        $("#fps").html(fps + " fps")
        refreshLoop();
    });
}

refreshLoop();

let fpsdisplay = false;

window.addEventListener("keypress", function(event) {
    if(event.key === "f") {
        if(fpsdisplay === false) {
            $("#fps").css("display", "block")
            fpsdisplay = true;
        }
        else if(fpsdisplay === true) {
            $("#fps").css("display", "none")
            fpsdisplay = false;
        }
    }
});