'use strict';
/* Memory Game Models and Business Logic */

function Tile(title) {
  this.title = title;
  this.flipped = false;
}

Tile.prototype.flip = function() {
  this.flipped = !this.flipped;
}

function Game(tileNames) {
  var tileDeck = makeDeck(tileNames);
  this.trials = 0;
  this.grid = makeGrid(tileDeck);
  this.message = Game.MESSAGE_CLICK;
  this.unmatchedPairs = tileNames.length;

  this.flipTile = function(tile) {
    if (tile.flipped) {
      return;
    }

    tile.flip();
    this.trials += 1;

    /* iframe 的 parent 就是包它的頁面 */
    let test = "bbbbbbbbbbbbbbbbbbbbbb";
    console.log('test = ' + test);
    //window.postMessage(test, 'https://jeff41101.github.io'); 

    window.parent.postMessage(test, 'https://teams.microsoft.com/'); 
    window.parent.postMessage(test, 'https://localhost:53000'); 
    window.parent.postMessage(test, '*'); 

    window.parent.addEventListener('load', () => {
        console.log('in the EventListner - local host');
        parent.postMessage(test, 'https://localhost:53000'); 
    });
    window.addEventListener('load', () => {
        console.log('in the EventListner - teams microsoft');
        parent.postMessage(test, 'https://teams.microsoft.com/');
    });

    if (!this.firstPick || this.secondPick) {

      if (this.secondPick) {
        this.firstPick.flip();
        this.secondPick.flip();
        this.firstPick = this.secondPick = undefined;
      }

      this.firstPick = tile;
      this.message = Game.MESSAGE_ONE_MORE;

    } else {

     if (this.firstPick.title === tile.title) {
        this.unmatchedPairs--;
        console.log(this.unmatchedPairs);
        if (this.unmatchedPairs === 0) {
            console.log('hit zero!!');
            // TODO:
            // Needs to impliment reset function
        }
        this.message = (this.unmatchedPairs > 0) ? Game.MESSAGE_MATCH : Game.MESSAGE_WON;
        this.firstPick = this.secondPick = undefined;
      } else {
        this.secondPick = tile;
        this.message = Game.MESSAGE_MISS;
      }
    }
  }
}

Game.MESSAGE_CLICK = 'Click on a tile.';
Game.MESSAGE_ONE_MORE = 'Pick one more card.'
Game.MESSAGE_MISS = 'Try again.';
Game.MESSAGE_MATCH = 'Good job! Keep going.';
Game.MESSAGE_WON = 'You win!';



/* Create an array with two of each tileName in it */
function makeDeck(tileNames) {
  var tileDeck = [];
  tileNames.forEach(function(name) {
    tileDeck.push(new Tile(name));
    tileDeck.push(new Tile(name));
  });

  return tileDeck;
}


function makeGrid(tileDeck) {
  var gridDimension = Math.sqrt(tileDeck.length),
      grid = [];

  for (var row = 0; row < gridDimension; row++) {
    grid[row] = [];
    for (var col = 0; col < gridDimension; col++) {
        grid[row][col] = removeRandomTile(tileDeck);
    }
  }

  return grid;
}


function removeRandomTile(tileDeck) {
  var i = Math.floor(Math.random()*tileDeck.length);
  return tileDeck.splice(i, 1)[0];
}

function apiCall() {
    var settings = {
        "url": "https://wjuc7h96k7.execute-api.ap-northeast-1.amazonaws.com/dev/PassInfo",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "x-api-key": "WHJzpbI0r29A01Hbsg5H776YNuyWe5FI5XCgplRu",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "Trials": "10"
        }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

// Get message from GamePlay WebPage
window.addEventListener('message', event => {
    // IMPORTANT: check the origin of the data!
    console.log(event.origin);
    if (event.origin === 'https://localhost:53000') {
        // The data was sent from your site.
        // Data sent with postMessage is stored in event.data:
        console.log(event.data);
    } else {
        // The data was NOT sent from your site!
        // Be careful! Do not use it. This else branch is
        // here just for clarity, you usually shouldn't need it.
        console.log('failed');
        return;
    }
});