
/*!
 * Connect Four game application
 * Patrick Petrushonis - 2017
 */
new Vue({
   el: '#game',
   data: {
      tokenStates: [],
      columnCount: 7,
      rowCount: 6,
      turnTime: 1000,
      winCount: 0,
      lossCount: 0,
      isPlayerTurn: true,
      isGameOver: false,
      isDraw: false,
      hasWon: false,
      hasLost: false
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
                     var thisToken = thisTarget.children[y].children[0];
                     
                     if(this.CanAddToken(thisToken)) {
                        thisToken.classList.toggle('token--player');
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
            
            // Indicate player has won current game
            if(this.isGameOver) {
               var vm = this;

               setTimeout(function() {
                  vm.hasWon = true;
               }, this.turnTime);
               
               // Increment win count
               this.winCount++;
            }
         }
      },
      AddTokenToRandomColumn: function() {         
         if(!this.isPlayerTurn) {
            // Randomly select a column represented by an integer
            var randCol = Math.floor(Math.random() * this.columnCount);

            var canAddTokenToColumn = false;

            // Check that column has empty cells
            for(var x = 0; x < this.rowCount; x++) {
               if(this.tokenStates[randCol][x] == 0) {
                  canAddTokenToColumn = true;
               }
            }

            if(!canAddTokenToColumn) {
               this.AddTokenToRandomColumn();
               return
            }
            
            for(var x = this.rowCount - 1; x >= 0; x--) {
               // Ensure selected cell is default state
               if(this.tokenStates[randCol][x] == 0) {
                  this.tokenStates[randCol][x] = 2;
                  
                  var columnElements = document.getElementsByClassName('column');
                  
                  // Indicate computer has selected this cell
                  for(var y = columnElements[randCol].childElementCount - 1; y >= 0; y--) {
                     var thisToken = columnElements[randCol].children[y].children[0];
                     
                     if(this.CanAddToken(thisToken)) {
                        thisToken.classList.toggle('token--computer');
                        didAddToken = true;
                        break;
                     }
                  }
               
                  // Check whether computer has triggered a win condition
                  this.CheckForWinCondition();

                  // Check whether game is a draw
                  if(this.IsGameADraw()) {
                     var vm = this;

                     setTimeout(function() {
                        vm.isDraw = true;
                     }, this.turnTime);
                  }
                  
                  break;                  
               }
            }

            // Indicate player has lost current game
            if(this.isGameOver) {
               var vm = this;

               setTimeout(function() {
                  vm.hasLost = true;
               }, this.turnTime);
               
               // Increment win count
               this.lossCount++;
            }
         }
      },
      CheckForWinCondition: function() {         
         // Check for vertical connections of four tokens
         for(var x = 0; x < this.columnCount; x++) {
            var connectCount = 0;
            var lastTokenState = 0;
            
            for(var y = 0; y < this.rowCount; y++) {               
               // Increment connect count for non-default matching sequential states 
               if(this.tokenStates[x][y] != 0 && this.tokenStates[x][y] == lastTokenState) {
                  connectCount++;               
               }
               else {
                  connectCount = 0;
               }
               
               if(connectCount >= 3) {
                  this.isGameOver = true;
                  return;
               }
               
               // Update last token state to state of current token
               lastTokenState = this.tokenStates[x][y];
            }
         }
         
         // Check for horizontal connections of four tokens
         for(var x = 0; x < this.rowCount; x++) {
            var connectCount = 0;
            var lastTokenState = 0;

            for(var y = 0; y < this.columnCount; y++) {               
               // Increment connect count for non-default matching sequential states 
               if(this.tokenStates[y][x] != 0 && this.tokenStates[y][x] == lastTokenState) {
                  connectCount++;
               }
               else {
                  connectCount = 0;
               }

               if(connectCount >= 3) {
                  this.isGameOver = true;
                  return;
               }

               // Update last token state to state of current token
               lastTokenState = this.tokenStates[y][x];
            }
         }         
         
         // Check for top left-to-right diagonal connections of four tokens
         for(var x = 0; x < this.columnCount - 3; x++) {
            var connectCount = 0;
            
            for(var y = 0; y < this.rowCount - 1; y++) {
               var thisTokenState = this.tokenStates[x][y];

               // Increment connect count for non-default matching sequential states 
               if(thisTokenState != 0 && thisTokenState == this.tokenStates[x + 1][y + 1]) {
                  connectCount++;

                  if(x < this.columnCount - 2 && y < this.rowCount - 2) {
                     if(thisTokenState == this.tokenStates[x + 2][y + 2]) {
                        connectCount++;

                        if(x < this.columnCount - 3 && y < this.rowCount - 3) {
                           if(thisTokenState == this.tokenStates[x + 3][y + 3]) {
                              connectCount++;
                           }
                        }
                     }
                  }      
               }

               if(connectCount >= 3) {
                  this.isGameOver = true;
                  break;
               }
               
               connectCount = 0;
            }
         }
            
         // Check for top right-to-left diagonal connections of four tokens 
         for(var x = this.columnCount - 1; x >= 3 ; x--) { 
            var connectCount = 0;
            
            for(var y = 0; y < this.rowCount - 1; y++) {
               var thisTokenState = this.tokenStates[x][y];

               // Increment connect count for non-default matching sequential states 
               if(thisTokenState != 0 && thisTokenState == this.tokenStates[x - 1][y + 1]) {
                  connectCount++;

                  if(x < this.columnCount + 2 && y < this.rowCount - 2) {
                     if(thisTokenState == this.tokenStates[x - 2][y + 2]) {
                        connectCount++;

                        if(x < this.columnCount + 3 && y < this.rowCount - 3) {
                           if(thisTokenState == this.tokenStates[x - 3][y + 3]) {
                              connectCount++;
                           }
                        }
                     }
                  }      
               }

               if(connectCount >= 3) {
                  this.isGameOver = true;
                  break;
               }
               
               connectCount = 0;
            }
         }         
      },
      PrepareNextPlayerTurn: function() {
         this.isPlayerTurn = true;
      },
      CanAddToken: function(token) {
         return !token.classList.contains('token--player') && !token.classList.contains('token--computer');
      },
      IsGameADraw: function() {
         for(var x = 0; x < this.columnCount; x++) {
            for(var y = 0; y < this.rowCount; y++) {
               if(this.tokenStates[x][y] == 0) {
                  return false;
               }
            }
         }

         return true;
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
         
         var tokens = document.getElementsByClassName('token');
         
         // Ensure tokens indicate unaligned default values
         for(var x = 0; x < tokens.length; x++) {
            tokens[x].className = 'token';
         }
         
         // Reset game over states
         this.isGameOver = false;
         this.isDraw = false;
         this.hasWon = false;
         this.hasLost = false;

         // Allow player to add first token
         this.isPlayerTurn = true;
      }
   },
   beforeMount() {
      this.ResetGame();
   }
});