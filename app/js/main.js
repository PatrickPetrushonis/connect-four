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
            
            if(this.isGameOver) {
               // Indicate player has won current game
               this.hasWon = true;
               
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
                     this.isDraw = true;
                  }
                  
                  break;                  
               }
            }

            if(this.isGameOver) {
               // Indicate player has lost current game
               this.hasLost = true;
               
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICB0b2tlblN0YXRlczogW10sXHJcbiAgICAgIGNvbHVtbkNvdW50OiA3LFxyXG4gICAgICByb3dDb3VudDogNixcclxuICAgICAgdHVyblRpbWU6IDEwMDAsXHJcbiAgICAgIHdpbkNvdW50OiAwLFxyXG4gICAgICBsb3NzQ291bnQ6IDAsXHJcbiAgICAgIGlzUGxheWVyVHVybjogdHJ1ZSxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2UsXHJcbiAgICAgIGlzRHJhdzogZmFsc2UsXHJcbiAgICAgIGhhc1dvbjogZmFsc2UsXHJcbiAgICAgIGhhc0xvc3Q6IGZhbHNlXHJcbiAgIH0sXHJcbiAgIG1ldGhvZHM6IHtcclxuICAgICAgQWRkVG9rZW5Ub0NvbHVtbjogZnVuY3Rpb24odGhpc0NvbCwgZXZlbnQpIHtcclxuICAgICAgICAgLy8gT25seSBhbGxvdyBwbGF5ZXIgYWN0aW9uIG9uIHRoZWlyIG93biB0dXJuXHJcbiAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXJUdXJuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHggPSB0aGlzLnJvd0NvdW50IC0gMTsgeCA+PSAwOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgLy8gRW5zdXJlIHNlbGVjdGVkIGNlbGwgaXMgZGVmYXVsdCBzdGF0ZVxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1t0aGlzQ29sXVt4XSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB2YXIgdGhpc1RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7ICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHNlbGVjdGVkIHRoaXMgY2VsbFxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIHkgPSB0aGlzVGFyZ2V0LmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IHRoaXNUYXJnZXQuY2hpbGRyZW5beV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzLkNhbkFkZFRva2VuKHRoaXNUb2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Rva2VuLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1wbGF5ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBwbGF5ZXIgaGFzIHRyaWdnZXJlZCBhIHdpbiBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja0ZvcldpbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHR1cm4gdHJhbnNpdGlvbiBwcm92aWRlZCBnYW1lIGlzIHN0aWxsIGluLXByb2dyZXNzXHJcbiAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgbmV4dCBwbGF5ZXIgdHVybiBmb3IgYW5pbWF0aW9ucyBhbmQgY29tcHV0ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLlByZXBhcmVOZXh0UGxheWVyVHVybiwgdGhpcy50dXJuVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY29tcHV0ZXIncyB0dXJuIHNob3J0bHkgYWZ0ZXIgcGxheWVyJ3MgdHVyblxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbiwgdGhpcy50dXJuVGltZSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHdvbiBjdXJyZW50IGdhbWVcclxuICAgICAgICAgICAgICAgdGhpcy5oYXNXb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IHdpbiBjb3VudFxyXG4gICAgICAgICAgICAgICB0aGlzLndpbkNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBBZGRUb2tlblRvUmFuZG9tQ29sdW1uOiBmdW5jdGlvbigpIHsgICAgICAgICBcclxuICAgICAgICAgaWYoIXRoaXMuaXNQbGF5ZXJUdXJuKSB7XHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIGNvbHVtbiByZXByZXNlbnRlZCBieSBhbiBpbnRlZ2VyXHJcbiAgICAgICAgICAgIHZhciByYW5kQ29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jb2x1bW5Db3VudCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2FuQWRkVG9rZW5Ub0NvbHVtbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCBjb2x1bW4gaGFzIGVtcHR5IGNlbGxzXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0aGlzLnJvd0NvdW50OyB4KyspIHtcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1tyYW5kQ29sXVt4XSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbkFkZFRva2VuVG9Db2x1bW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFjYW5BZGRUb2tlblRvQ29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbigpO1xyXG4gICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB4ID0gdGhpcy5yb3dDb3VudCAtIDE7IHggPj0gMDsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgIC8vIEVuc3VyZSBzZWxlY3RlZCBjZWxsIGlzIGRlZmF1bHQgc3RhdGVcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1tyYW5kQ29sXVt4XSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXNbcmFuZENvbF1beF0gPSAyO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbkVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29sdW1uJyk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBjb21wdXRlciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkcmVuW3ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5DYW5BZGRUb2tlbih0aGlzVG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNUb2tlbi5jbGFzc0xpc3QudG9nZ2xlKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkQWRkVG9rZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIGNvbXB1dGVyIGhhcyB0cmlnZ2VyZWQgYSB3aW4gY29uZGl0aW9uXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tGb3JXaW5Db25kaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgZ2FtZSBpcyBhIGRyYXdcclxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5Jc0dhbWVBRHJhdygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNEcmF3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5pc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgICAgIC8vIEluZGljYXRlIHBsYXllciBoYXMgbG9zdCBjdXJyZW50IGdhbWVcclxuICAgICAgICAgICAgICAgdGhpcy5oYXNMb3N0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCB3aW4gY291bnRcclxuICAgICAgICAgICAgICAgdGhpcy5sb3NzQ291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIENoZWNrRm9yV2luQ29uZGl0aW9uOiBmdW5jdGlvbigpIHsgICAgICAgICBcclxuICAgICAgICAgLy8gQ2hlY2sgZm9yIHZlcnRpY2FsIGNvbm5lY3Rpb25zIG9mIGZvdXIgdG9rZW5zXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0aGlzLmNvbHVtbkNvdW50OyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBsYXN0VG9rZW5TdGF0ZSA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudDsgeSsrKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBjb25uZWN0IGNvdW50IGZvciBub24tZGVmYXVsdCBtYXRjaGluZyBzZXF1ZW50aWFsIHN0YXRlcyBcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1t4XVt5XSAhPSAwICYmIHRoaXMudG9rZW5TdGF0ZXNbeF1beV0gPT0gbGFzdFRva2VuU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGlmKGNvbm5lY3RDb3VudCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gVXBkYXRlIGxhc3QgdG9rZW4gc3RhdGUgdG8gc3RhdGUgb2YgY3VycmVudCB0b2tlblxyXG4gICAgICAgICAgICAgICBsYXN0VG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeF1beV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gQ2hlY2sgZm9yIGhvcml6b250YWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMucm93Q291bnQ7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIGxhc3RUb2tlblN0YXRlID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbHVtbkNvdW50OyB5KyspIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3ldW3hdICE9IDAgJiYgdGhpcy50b2tlblN0YXRlc1t5XVt4XSA9PSBsYXN0VG9rZW5TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAvLyBVcGRhdGUgbGFzdCB0b2tlbiBzdGF0ZSB0byBzdGF0ZSBvZiBjdXJyZW50IHRva2VuXHJcbiAgICAgICAgICAgICAgIGxhc3RUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t5XVt4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdG9wIGxlZnQtdG8tcmlnaHQgZGlhZ29uYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQgLSAzOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudCAtIDE7IHkrKykge1xyXG4gICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSAhPSAwICYmIHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCArIDFdW3kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50IC0gMiAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4ICsgMl1beSArIDJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgLSAzICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggKyAzXVt5ICsgM10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgLy8gQ2hlY2sgZm9yIHRvcCByaWdodC10by1sZWZ0IGRpYWdvbmFsIGNvbm5lY3Rpb25zIG9mIGZvdXIgdG9rZW5zIFxyXG4gICAgICAgICBmb3IodmFyIHggPSB0aGlzLmNvbHVtbkNvdW50IC0gMTsgeCA+PSAzIDsgeC0tKSB7IFxyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50IC0gMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciB0aGlzVG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeF1beV07XHJcblxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlICE9IDAgJiYgdGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4IC0gMV1beSArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgKyAyICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggLSAyXVt5ICsgMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCArIDMgJiYgeSA8IHRoaXMucm93Q291bnQgLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCAtIDNdW3kgKyAzXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgIH0sXHJcbiAgICAgIFByZXBhcmVOZXh0UGxheWVyVHVybjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgICAgQ2FuQWRkVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XHJcbiAgICAgICAgIHJldHVybiAhdG9rZW4uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tcGxheWVyJykgJiYgIXRva2VuLmNsYXNzTGlzdC5jb250YWlucygndG9rZW4tLWNvbXB1dGVyJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIElzR2FtZUFEcmF3OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykge1xyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbeF1beV0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgICAgUmVzZXRHYW1lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgLy8gRW1wdHkgdG9rZW4gc3RhdGVzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgICAgICB0aGlzLnRva2VuU3RhdGVzID0gW107XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBQdXNoIGNvbHVtbnMgb2YgdG9rZW4gc3RhdGVzIHdpdGggZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykgeyBcclxuICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlcy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50OyB5KyspIHtcclxuICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1t4XVt5XSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIHRva2VucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rva2VuJyk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBFbnN1cmUgdG9rZW5zIGluZGljYXRlIHVuYWxpZ25lZCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdG9rZW5zLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRva2Vuc1t4XS5jbGFzc05hbWUgPSAndG9rZW4nO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBSZXNldCBnYW1lIG92ZXIgc3RhdGVzXHJcbiAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xyXG4gICAgICAgICB0aGlzLmhhc1dvbiA9IGZhbHNlO1xyXG4gICAgICAgICB0aGlzLmhhc0xvc3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgIC8vIEFsbG93IHBsYXllciB0byBhZGQgZmlyc3QgdG9rZW5cclxuICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcbiAgIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICB0aGlzLlJlc2V0R2FtZSgpO1xyXG4gICB9XHJcbn0pOyJdLCJmaWxlIjoibWFpbi5qcyJ9
