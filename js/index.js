"use strict";

$(document).ready(function(){

  function Button(name,coloron,coloroff,sound,fontcoloron,fontcoloroff){
    this.name = name;
    this.coloron = coloron;
    this.coloroff = coloroff;
    this.sound_path = sound;
    this.fontcoloron = fontcoloron;
    this.fontcoloroff = fontcoloroff;
    this.status = "off";
    this.enable = function(){
      var element = document.getElementById(this.name);
      element.classList.remove("off");
      element.classList.add("on");
    };
    this.disable = function(){
      var element = document.getElementById(this.name);
      element.classList.remove("on");
      element.classList.add("off");
    };
    this.colorLite = function(){
      var element = document.getElementById(this.name);
      element.style.background = this.coloron;
    };
    this.colorDark = function(){
      var element = document.getElementById(this.name);
      element.style.background = this.coloroff;
    };
    this.play = function(){
      var audioElement = document.createElement('audio'),
          element = document.getElementById(this.name),
          color = this.coloroff;
          console.log(this.name);
      audioElement.setAttribute('src', this.sound_path);
      audioElement.addEventListener('', function() { this.play(); }, false);
      audioElement.play();
      this.colorLite();
      setTimeout(function(){ element.style.background = color; }, 500);
    };
    this.setFontcolorOn = function(){
      var element = document.getElementById(this.name);
      element.style.color = this.fontcoloron;
    };
    this.setFontcolorOff = function(){
      var element = document.getElementById(this.name);
      element.style.color = this.fontcoloroff;
    }
  }

  var gb = new Button("green","#00cc66","green","https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",false,false),
      rb = new Button("red","#ff6666","#cc0000","https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",false,false),
      bb = new Button("blue","#6699ff","#003366","https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",false,false),
      yb = new Button("yellow","#ffff66","#cccc00","https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",false,false),
      onoffb = new Button("onoff",false,false,false,"red","grey"),
      startb = new Button("start",false,false,false,"red","grey"),
      strictb = new Button("strict",false,false,false,"red","grey"),
      buttonArray = [gb,rb,bb,yb], //objects array
      playerArray = [],
      handler_gb = function(){ gb.play(); playerArray.push(0); console.log("playerArray: " + playerArray);} ,
      handler_rb = function(){ rb.play(); playerArray.push(1); console.log("playerArray: " + playerArray);} ,
      handler_bb = function(){ bb.play(); playerArray.push(2); console.log("playerArray: " + playerArray);} ,
      handler_yb = function(){ yb.play(); playerArray.push(3); console.log("playerArray: " + playerArray);} ,
      interval,
      interval1,
      interval_player,
      level = 1,
      maxLevel = 10,
      lcd = document.getElementById("lcd"),
      computerArray = [],
      bingo = 0
      ;

  lcd.value = "--";

  function onButtonHandlers(){
    $( "#green" ).bind( "mousedown", handler_gb);
    $( "#red" ).bind( "mousedown", handler_rb);
    $( "#blue" ).bind( "mousedown", handler_bb);
    $( "#yellow" ).bind( "mousedown", handler_yb);
  }
  function offButtonHandlers(){
    $( "#green" ).unbind( "mousedown", handler_gb);
    $( "#red" ).unbind( "mousedown", handler_rb);
    $( "#blue" ).unbind( "mousedown", handler_bb);
    $( "#yellow" ).unbind( "mousedown", handler_yb);
  }
  function enableLCD(){
    var element = document.getElementById("lcd");
    element.classList.add("red");
    element.value = "1";
    level = element.value;
  }
  function disableLCD(){
    var element = document.getElementById("lcd");
    element.classList.remove("red");
    element.value = "--";
    level = element.value;
  }
  function randomNumber(){
    return Math.floor(Math.random() * 4);
  }
  function randomArr(){
    for (var i=1; i <= level; i++){
      computerArray.push(randomNumber());
    }
  }
  function emptyArr(arr) {
    var j;

    if (arr.length > 0) {
      for (j = arr.length; j > 0; j--) {
        arr.pop();
      }
    }
  }
  function computerTurn(){
    var element = document.getElementById("lcd");

    element.value = level;
    if(level > maxLevel){ return; }; // stop recursion
    if(bingo >= 0 && bingo <= maxLevel && level > 0){ randomArr(); } //chose computerArray

    for (var i = 0; i < computerArray.length; i++){ //playing computerArray
      setTimeout(function(x) {
                                return function() {
                                                  var btn;
                                                  btn = buttonArray[computerArray[x]];
                                                  btn.play();
                                                  setTimeout( function(){ btn.colorDark(); }, 700 );
                                                };
                              }(i), 1000*i);
    }
    if (playerArray.length > 0){ emptyArr(playerArray); }
    onButtonHandlers();
    if(onoffb.status === "on" && startb.status === "on"){
      setTimeout( function(){ offButtonHandlers();
                              interval_player = setInterval(checkBingo, 300); //check bingo
                            }, 2000*level); //time for player to repeat computerArr
    }
  }
  function checkBingo(){
    bingo = 0;
    for (var i=0; i<computerArray.length; i++){ //bingo counter
      if (playerArray[i] === computerArray[i]){
        bingo++;
      }
    }
    if(bingo === computerArray.length && level === maxLevel){
      alert("You win!");
      clearInterval(interval_player);
      startOff();
    }else if (bingo === computerArray.length && level <= maxLevel){
      if (level < maxLevel) { level++; }
      emptyArr(playerArray);
      emptyArr(computerArray);
      clearInterval(interval_player);
      computerTurn();
    }else  if (bingo < computerArray.length && level <= maxLevel && strictb.status === "off"){
      lcd.value = "!!";
      setTimeout(function(){ lcd.value = level; computerTurn(); }, 500);
      bingo = -1;
      emptyArr(playerArray);
      clearInterval(interval_player);
      //computerTurn();
    }else  if (bingo < computerArray.length && level <= maxLevel && strictb.status === "on"){
      alert("You lose!");
      clearInterval(interval_player);
      startOff();
      strictb.status = "off";
      strictb.setFontcolorOff();
    }
    clearInterval(interval_player);
    return;
  }
  function startOff(){
    startb.setFontcolorOff();
    startb.status = "off";
    disableLCD();
    emptyArr(computerArray);
    emptyArr(playerArray);
  }
  $("#onoff").on("click",function(){
    if(onoffb.status === "off"){
      onoffb.setFontcolorOn();
      //onButtonHandlers();
      onoffb.status = "on";
    }else if(onoffb.status === "on") {
      onoffb.setFontcolorOff();
      //offButtonHandlers();
      onoffb.status = "off";
      strictb.setFontcolorOff();
      startOff();
      clearInterval(interval_player);
      level = maxLevel + 1;
    }
  });
  $("#strict").on("click",function(){
    if(onoffb.status === "on" && strictb.status === "off"){
      strictb.setFontcolorOn();
      strictb.status = "on";
    }else if (onoffb.status === "on" && strictb.status === "on"){
      strictb.setFontcolorOff();
      strictb.status = "off";
    }
  });
  $("#start").on("click",function(){
    if(onoffb.status === "on" && startb.status === "off"){
      startb.setFontcolorOn();
      startb.status = "on";
      enableLCD();
      computerTurn();
    }else if (onoffb.status === "on" && startb.status === "on"){
      startOff();
      lcd.value = "--";
    }
  });
});
