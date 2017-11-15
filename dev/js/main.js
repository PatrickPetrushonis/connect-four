new Vue({
   el: '#game',
   data: {
      isPlayerTurn: true,
      tokenStates: [],
      columnCount: 7,
      rowCount: 6,
      turnTime: 1000,
      isGameOver: false
   },
   methods: {
      AddTokenToColumn: function(thisCol, event) {
         // Only allow player action on their own turn
         if(this.isPlayerTurn) {
            this.isPlayerTurn = false;

            for(var x = this.rowCount - 1; x >= 0; x--) {
               // Ensure selected cell is default state
               if(this.tokenStates[thisCol][x] == 0) {
                  this.tokenStates[thisCol][x] = 1;
                  
                  var thisTarget = event.currentTarget;                  
                  
                  // Indicate player has selected this cell
                  for(var y = thisTarget.childElementCount - 1; y >= 0; y--) {
                     if(!thisTarget.children[y].classList.contains('token--player') && 
                        !thisTarget.children[y].classList.contains('token--computer')) {
                        thisTarget.children[y].classList.toggle('token--player');
                        break;
                     }
                  }

                  // Check whether player has triggered a win condition
                  this.CheckForWinCondition();
                  
                  // Handle turn transition provided game is still in-progress
                  if(!this.isGameOver) {
                     // Delay next player turn for animations and computer response
                     setTimeout(this.PrepareNextPlayerTurn, this.turnTime);
                     
                     // Handle computer's turn shortly after player's turn
                     setTimeout(this.AddTokenToRandomColumn, this.turnTime * 0.5);
                  }
                  
                  break;
               }
            }
            
            if(this.isGameOver) {
               alert('Victory!');
            }
         }
      },
      AddTokenToRandomColumn: function() {         
         if(!this.isPlayerTurn) {
            // Randomly select a column represented by an integer
            var randCol = Math.floor(Math.random() * this.columnCount);
            
            for(var x = this.rowCount - 1; x >= 0; x--) {
               // Ensure selected cell is default state
               if(this.tokenStates[randCol][x] == 0) {
                  this.tokenStates[randCol][x] = 2;
                  
                  var columnElements = document.getElementsByClassName('column');
                  
                  // Indicate computer has selected this cell
                  for(var y = columnElements[randCol].childElementCount - 1; y >= 0; y--) {
                     if(!columnElements[randCol].children[y].classList.contains('token--player') && !columnElements[randCol].children[y].classList.contains('token--computer')) {
                        columnElements[randCol].children[y].classList.toggle('token--computer');
                        break;
                     }
                  }
               
                  // Check whether computer has triggered a win condition
                  this.CheckForWinCondition();
                  
                  break;                  
               }
            }

            if(this.isGameOver) {
               alert('Defeated!');
            }
         }
      },
      CheckForWinCondition: function() {
         
      },
      PrepareNextPlayerTurn: function() {
         this.isPlayerTurn = true;
      },
      ResetGame: function() {
         // Empty token states for initialization
         this.tokenStates = [];
         
         // Push columns of token states with default values
         for(var x = 0; x < this.columnCount; x++) { 
            this.tokenStates.push([]);
            
            for(var y = 0; y < this.rowCount; y++) {
               this.tokenStates[x][y] = 0;
            }
         }
         
         var columnElements = document.getElementsByClassName('column');
         
         // Ensure column cells indicate unaligned default values
         for(var x = 0; x < columnElements.length; x++) {
            for(var y = 0; y < columnElements[x].childElementCount; y++) {
               columnElements[x].children[y].className = 'cell';
            }
         }
         
         // Indicate game is not over
         this.isGameOver = false;
         this.isPlayerTurn = true;
      }
   },
   beforeMount() {
      this.ResetGame();
   }
});