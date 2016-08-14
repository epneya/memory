function Game(width, height) {
  var WIDTH = width, HEIGHT = height,
      CANVAS, CTX, MOUSE = {x:null, y: null},
      FRAMES = 0,
      gameState = 0,
      menuState = 0,
      ingameState,
      memory = {
        turn: 1,
        moves: 0,
        selected: [],
        tmp: [],
        finished: false
      },
      img = new Image();
      img.src = "./img/icons.png";
  window.gameObjects = {
        intro: [],
        menu: [],
        ingame: []
      };
  var DRAWER = {
        draw: function () {
          CTX.clearRect(0, 0, WIDTH, HEIGHT);
          switch (gameState) {
            case 0: //INTRO
              if (FRAMES > 60) gameObjects.intro["memory_text"].draw();
              break;
            case 1: //MENU
              gameObjects.menu["memory_text"].draw();
              switch (menuState) {
                case 0: //MAIN
                  gameObjects.menu["play_button"].draw();
                  break;
                case 1: //PLAY
                  gameObjects.menu['pvp_button'].draw();
                  gameObjects.menu['ki_button'].draw();
                  gameObjects.menu['back_button'].draw();
                  break;
                default:
                  console.error("NONE EXISTING MENUSTATE FOR DRAW");
              }
              break;
            case 2: //INGAME
              gameObjects.ingame['memory_text'].draw();
              switch (ingameState) {
                case 0: //PVP
                  gameObjects.ingame['player1_text'].draw();
                  gameObjects.ingame['player1_score'].draw();
                  gameObjects.ingame['player2_text'].draw();
                  gameObjects.ingame['player2_score'].draw();
                  if (memory.turn == 1) {
                    CTX.beginPath(); CTX.moveTo(160, 80); CTX.lineTo(170, 70); CTX.lineTo(170, 90); CTX.lineTo(160, 80); CTX.stroke();
                  } else {
                    CTX.beginPath(); CTX.moveTo(490, 80); CTX.lineTo(480, 70); CTX.lineTo(480, 90); CTX.lineTo(490, 80); CTX.stroke();
                  }
                  for (var i = 0, n = 0; i < 8; i++) {
                    for (var ii = 0; ii < 4; ii++) {
                      CTX.strokeStyle = "#ffffff";
                      CTX.strokeRect(i * 74 + 26 , ii * 74 + 153, 70, 70);
                      CTX.fillStyle = "#ffffff";
                      if (gameObjects.ingame['field_list'][n] !== undefined) gameObjects.ingame['field_list'][n].draw();
                      n++;
                    }
                  }
                  break;
                case 1: //KI
                  break;
                default:
                  console.error("NONE EXISTING INGAMESTATE FOR DRAW");
              }
              break;
            case 3: //WINNER
              CTX.font = "64px Pacifico";
              CTX.fillStyle = "white";
              if (gameObjects.ingame['player1_score'].score > gameObjects.ingame['player2_score'].score) {
                CTX.fillText("Player 1 wins!", WIDTH/2, 3*HEIGHT/8);
              } else if (gameObjects.ingame['player1_score'].score < gameObjects.ingame['player2_score'].score) {
                CTX.fillText("Player 2 wins!", WIDTH/2, 3*HEIGHT/8);
              } else {
                CTX.fillText("It's a tie!", WIDTH/2, 3*HEIGHT/8);
              }
              gameObjects.ingame['back_button'].draw();
              break;
            default:
              console.error('NONE EXISTING GAMESTATE FOR DRAW');
              break;
          }
        }
      },
      UPDATER = {
        update: function () {
          FRAMES++;
          switch (gameState) {
            case 0: //INTRO
              if (300 > FRAMES && FRAMES > 120) gameObjects.intro["memory_text"].y += (HEIGHT/4 - gameObjects.intro["memory_text"].y)/60;
              break;
            case 1: //MENU
              switch (menuState) {
                case 0: //MAIN
                  break;
                case 1: //PLAY
                  break;
                default:
                  console.error("NONE EXISTING MENUSTATE FOR UPDATE");
              }
              break;
            case 2: //INGAME
              switch (ingameState) {
                case 0: //PVP
                  if (memory.moves >= 2) {
                    memory.moves = 0;
                    if (memory.selected[0] == memory.selected[1]) {
                        gameObjects.ingame['player' + memory.turn + '_score'].score++;
                        memory.tmp = memory.selected;
                        window.setTimeout(function () {
                          for (var i = 0; i < 32; i++) {
                            if (gameObjects.ingame['field_list'][i] !== undefined) {
                              if (gameObjects.ingame['field_list'][i].id == memory.tmp[0]) gameObjects.ingame['field_list'][i] = undefined;
                            }
                          }
                          memory.tmp = [];
                        }, 800);
                    } else {
                      if (memory.turn == 2) {
                        memory.turn = 1;
                      } else {
                        memory.turn = 2;
                      }
                      window.setTimeout(function () {
                        for (var i = 0; i < 32; i++) {
                          if (gameObjects.ingame['field_list'][i] !== undefined) gameObjects.ingame['field_list'][i].show = false;
                        }
                      }, 800);
                    }
                    memory.selected = [];
                  }
                  if (gameObjects.ingame['player1_score'].score + gameObjects.ingame['player2_score'].score == 16) memory.finished = true;
                  if (memory.finished) gameState = 3;
                  break;
                case 1: //KI
                  break;
                default:
                  console.error("NONE EXISTING INGAMESTATE FOR CLICK");
              }
              break;
            case 3:
              break;
            default:
              console.error('NONE EXISTING GAMESTATE FOR UPDATE');
              break;
          }
        }
      },
      loop = function () {
        DRAWER.draw();
        UPDATER.update();
        window.setTimeout(function () {loop();}, 1000/60);
      },
      pressed = function (ax,ay,aw,ah,bx,by) {
	       return ax - 1 <= bx && ay - 1 <= by && ax + aw >= bx && ay + ah >= by;
      },
      init = function () {
        CTX.textBaseline = "middle";
        CTX.textAlign = "center";

        CANVAS.onmousemove = function (evt) {
          MOUSE.x = Math.floor(evt.pageX - (window.innerWidth - WIDTH)/2);
          MOUSE.y = Math.floor(evt.pageY - (window.innerHeight - HEIGHT)/2);
        };

        CANVAS.onclick = function () {
          switch (gameState) {
            case 0: //INTRO
              break;
            case 1: //MENU
              switch (menuState) {
                case 0: //MAIN
                  if (pressed(gameObjects.menu['play_button'].x, gameObjects.menu['play_button'].y, gameObjects.menu['play_button'].width, gameObjects.menu['play_button'].height, MOUSE.x, MOUSE.y)) menuState = 1;
                  break;
                case 1: //PLAY
                  if (pressed(gameObjects.menu['pvp_button'].x, gameObjects.menu['pvp_button'].y, gameObjects.menu['pvp_button'].width, gameObjects.menu['pvp_button'].height, MOUSE.x, MOUSE.y)) {
                    for (var i = 0, a = Math.floor(Math.random()*32); i < 32; i++) {
                      while (gameObjects.ingame['field_list'][a] !== undefined) {
                          a = Math.floor(Math.random()*32);
                      }
                      gameObjects.ingame['field_list'][a] = gameObjects.ingame['tiles_list'][i];
                    }
                    for (var i = 0, n = 0; i < 8; i++) {
                      for (var ii = 0; ii < 4; ii++) {
                        gameObjects.ingame['field_list'][n].cords.x = i * 74 + 26;
                        gameObjects.ingame['field_list'][n].cords.y = ii * 74 + 153;
                        n++;
                      }
                    }
                    gameState = 2;
                    ingameState = 0;
                    menuState = 0;
                  }
                  if (pressed(gameObjects.menu['back_button'].x, gameObjects.menu['back_button'].y, gameObjects.menu['back_button'].width, gameObjects.menu['back_button'].height, MOUSE.x, MOUSE.y)) menuState = 0;
                  break;
                default:
                  console.error("NONE EXISTING MENUSTATE FOR CLICK");
              }
              break;
            case 2: //INGAME
              switch (ingameState) {
                case 0: //PVP
                  for (var i = 0, tile; i < 32; i++) {
                    if (gameObjects.ingame['field_list'][i] !== undefined) {
                      tile = gameObjects.ingame['field_list'][i];
                      if (pressed(tile.cords.x, tile.cords.y, 70, 70, MOUSE.x, MOUSE.y) && gameObjects.ingame['field_list'][i].show == false) {gameObjects.ingame['field_list'][i].show = true; memory.moves++; memory.selected.push(tile.id);}
                    }
                  }
                  break;
                case 1: //KI
                  break;
                default:
                  console.error("NONE EXISTING INGAMESTATE FOR CLICK");
              }
              break;
            case 3:
              if (pressed(gameObjects.ingame['back_button'].x, gameObjects.ingame['back_button'].y, gameObjects.ingame['back_button'].width, gameObjects.ingame['back_button'].height, MOUSE.x, MOUSE.y)) {
                gameState = 1;
                menuState = 0;
                gameObjects.ingame['player1_score'].score = 0;
                gameObjects.ingame['player2_score'].score = 0;
                gameObjects.menu['memory_text'].y = HEIGHT/4;
                memory.finished = false;
                for (var i = 0; i < 32; i++) {
                  gameObjects.ingame['tiles_list'][i].show = false;
                }
              }
              break;
            default:
              console.error("NONE EXISTING GAMESTATE FOR CLICK");
          }
        }


       //INTRO
        gameObjects.intro['memory_text'] = {x: WIDTH/2, y: HEIGHT/2, text: 'Memory', style: {color: '#ffffff', font: '76px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x, this.y); CTX.restore();}};
       //MENU
        gameObjects.menu['memory_text'] = gameObjects.intro['memory_text'];
         //:MAIN
          gameObjects.menu['play_button'] = {x: (WIDTH - 120)/2, y: Math.floor(HEIGHT - 40) * 0.6, width: 120, height: 40, text: 'Play', style: {color: '#ffffff', font: '20px Pacifico', bgcolor: '#b64236'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.bgcolor; CTX.fillRect(this.x, this.y, this.width, this.height); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x + 60, this.y + 20); CTX.restore();}};
         //:PLAY
          gameObjects.menu['pvp_button'] = {x: (WIDTH - 120)/2, y: Math.floor(HEIGHT - 40) * 0.45, width: 120, height: 40, text: 'PvP', style: {color: '#ffffff', font: '20px Pacifico', bgcolor: '#b64236'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.bgcolor; CTX.fillRect(this.x, this.y, this.width, this.height); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x + 60, this.y + 20); CTX.restore();}};
          gameObjects.menu['ki_button'] = {x: (WIDTH - 120)/2, y: Math.floor(HEIGHT - 40) * 0.6, width: 120, height: 40, text: 'Ki', style: {color: '#ffffff', font: '20px Pacifico', bgcolor: '#7f433c'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.bgcolor; CTX.fillRect(this.x, this.y, this.width, this.height); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x + 60, this.y + 20); CTX.beginPath(); CTX.moveTo(this.x + 40, this.y + 25); CTX.lineTo(this.x + 80, this.y + 15); CTX.strokeStyle="white"; CTX.stroke(); CTX.restore();}};
          gameObjects.menu['back_button'] = {x: (WIDTH - 120)/2, y: Math.floor(HEIGHT - 40) * 0.75, width: 120, height: 40, text: 'Back', style: {color: '#ffffff', font: '20px Pacifico', bgcolor: '#b64236'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.bgcolor; CTX.fillRect(this.x, this.y, this.width, this.height); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x + 60, this.y + 20); CTX.restore();}};

       //INGAME
        gameObjects.ingame['memory_text'] = {x: WIDTH/2, y: HEIGHT/8, text: 'Memory', style: {color: '#ffffff', font: '76px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x, this.y); CTX.restore();}};
        gameObjects.ingame['player1_text'] = {x: WIDTH/7, y: HEIGHT/8, text: 'Player 1', style: {color: '#ffffff', font: '24px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x, this.y); CTX.restore();}};
        gameObjects.ingame['player1_score'] = {x: WIDTH/7, y: HEIGHT/5, score: 0, style: {color: '#ffffff', font: '32px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.score, this.x, this.y); CTX.restore();}};
        gameObjects.ingame['player2_text'] = {x: 6*WIDTH/7, y: HEIGHT/8, text: 'Player 2', style: {color: '#ffffff', font: '24px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x, this.y); CTX.restore();}};
        gameObjects.ingame['player2_score'] = {x: 6*WIDTH/7, y: HEIGHT/5, score: 0, style: {color: '#ffffff', font: '32px Pacifico'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.score, this.x, this.y); CTX.restore();}};
        gameObjects.ingame['back_button'] = {x: (WIDTH - 120)/2, y: Math.floor(HEIGHT - 40) * 0.75, width: 120, height: 40, text: 'Back', style: {color: '#ffffff', font: '20px Pacifico', bgcolor: '#b64236'}, draw: function () {CTX.save(); CTX.fillStyle = this.style.bgcolor; CTX.fillRect(this.x, this.y, this.width, this.height); CTX.fillStyle = this.style.color; CTX.font = this.style.font; CTX.fillText(this.text, this.x + 60, this.y + 20); CTX.restore();}};
        var tiles_list = [];
          for (var i = 0; i < 32; i++) {
            var id = Math.floor(i/2);
            tiles_list.push({
              id:''+id,
              show:false,
              cords:{x:null,y:null},
              draw:function(){
                if (this.show == true) {
                  CTX.drawImage(img, (+this.id)*70, 0, 70, 70, this.cords.x, this.cords.y, 70, 70);
                } else {
                  CTX.font = "42px Pacifico";
                   CTX.fillText("?", this.cords.x + 35, this.cords.y + 35);
                 }
              }
            })
          }
        gameObjects.ingame['tiles_list']=tiles_list;        gameObjects.ingame['field_list'] = [];

        loop();
      };

  this.run = function () {
    if (document.getElementsByTagName('canvas')[0] == undefined) {
      CANVAS = document.createElement('canvas');
      CANVAS.width = WIDTH;
      CANVAS.height = HEIGHT;
      CTX = CANVAS.getContext('2d');
      document.body.appendChild(CANVAS);

      init();

      window.setTimeout(function () {gameState = 1;}, 5250);
    } else {
      console.error('MEMORY IS ALREADY RUNNING!');
    }
  };
}

document.getElementById("memory_button").onclick = function () {
  window.memory = new Game(640, 480);
  memory.run();
};
