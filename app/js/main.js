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
                        break;
                     }
                  }
               
                  // Check whether computer has triggered a win condition
                  this.CheckForWinCondition();
                  
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
         
         // Indicate game is not over
         this.isGameOver = false;
         this.isPlayerTurn = true;
         this.hasWon = false;
         this.hasLost = false;
      }
   },
   beforeMount() {
      this.ResetGame();
   }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICB0b2tlblN0YXRlczogW10sXHJcbiAgICAgIGNvbHVtbkNvdW50OiA3LFxyXG4gICAgICByb3dDb3VudDogNixcclxuICAgICAgdHVyblRpbWU6IDEwMDAsXHJcbiAgICAgIHdpbkNvdW50OiAwLFxyXG4gICAgICBsb3NzQ291bnQ6IDAsXHJcbiAgICAgIGlzUGxheWVyVHVybjogdHJ1ZSxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2UsXHJcbiAgICAgIGhhc1dvbjogZmFsc2UsXHJcbiAgICAgIGhhc0xvc3Q6IGZhbHNlXHJcbiAgIH0sXHJcbiAgIG1ldGhvZHM6IHtcclxuICAgICAgQWRkVG9rZW5Ub0NvbHVtbjogZnVuY3Rpb24odGhpc0NvbCwgZXZlbnQpIHtcclxuICAgICAgICAgLy8gT25seSBhbGxvdyBwbGF5ZXIgYWN0aW9uIG9uIHRoZWlyIG93biB0dXJuXHJcbiAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXJUdXJuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHggPSB0aGlzLnJvd0NvdW50IC0gMTsgeCA+PSAwOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgLy8gRW5zdXJlIHNlbGVjdGVkIGNlbGwgaXMgZGVmYXVsdCBzdGF0ZVxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1t0aGlzQ29sXVt4XSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB2YXIgdGhpc1RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7ICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHNlbGVjdGVkIHRoaXMgY2VsbFxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIHkgPSB0aGlzVGFyZ2V0LmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IHRoaXNUYXJnZXQuY2hpbGRyZW5beV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzLkNhbkFkZFRva2VuKHRoaXNUb2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Rva2VuLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1wbGF5ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBwbGF5ZXIgaGFzIHRyaWdnZXJlZCBhIHdpbiBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja0ZvcldpbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHR1cm4gdHJhbnNpdGlvbiBwcm92aWRlZCBnYW1lIGlzIHN0aWxsIGluLXByb2dyZXNzXHJcbiAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgbmV4dCBwbGF5ZXIgdHVybiBmb3IgYW5pbWF0aW9ucyBhbmQgY29tcHV0ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLlByZXBhcmVOZXh0UGxheWVyVHVybiwgdGhpcy50dXJuVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY29tcHV0ZXIncyB0dXJuIHNob3J0bHkgYWZ0ZXIgcGxheWVyJ3MgdHVyblxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbiwgdGhpcy50dXJuVGltZSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHdvbiBjdXJyZW50IGdhbWVcclxuICAgICAgICAgICAgICAgdGhpcy5oYXNXb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IHdpbiBjb3VudFxyXG4gICAgICAgICAgICAgICB0aGlzLndpbkNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBBZGRUb2tlblRvUmFuZG9tQ29sdW1uOiBmdW5jdGlvbigpIHsgICAgICAgICBcclxuICAgICAgICAgaWYoIXRoaXMuaXNQbGF5ZXJUdXJuKSB7XHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWx5IHNlbGVjdCBhIGNvbHVtbiByZXByZXNlbnRlZCBieSBhbiBpbnRlZ2VyXHJcbiAgICAgICAgICAgIHZhciByYW5kQ29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jb2x1bW5Db3VudCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHggPSB0aGlzLnJvd0NvdW50IC0gMTsgeCA+PSAwOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgLy8gRW5zdXJlIHNlbGVjdGVkIGNlbGwgaXMgZGVmYXVsdCBzdGF0ZVxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3JhbmRDb2xdW3hdID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1tyYW5kQ29sXVt4XSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB2YXIgY29sdW1uRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb2x1bW4nKTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIEluZGljYXRlIGNvbXB1dGVyIGhhcyBzZWxlY3RlZCB0aGlzIGNlbGxcclxuICAgICAgICAgICAgICAgICAgZm9yKHZhciB5ID0gY29sdW1uRWxlbWVudHNbcmFuZENvbF0uY2hpbGRFbGVtZW50Q291bnQgLSAxOyB5ID49IDA7IHktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuID0gY29sdW1uRWxlbWVudHNbcmFuZENvbF0uY2hpbGRyZW5beV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzLkNhbkFkZFRva2VuKHRoaXNUb2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Rva2VuLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1jb21wdXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIGNvbXB1dGVyIGhhcyB0cmlnZ2VyZWQgYSB3aW4gY29uZGl0aW9uXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tGb3JXaW5Db25kaXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIGxvc3QgY3VycmVudCBnYW1lXHJcbiAgICAgICAgICAgICAgIHRoaXMuaGFzTG9zdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgd2luIGNvdW50XHJcbiAgICAgICAgICAgICAgIHRoaXMubG9zc0NvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBDaGVja0ZvcldpbkNvbmRpdGlvbjogZnVuY3Rpb24oKSB7ICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciB2ZXJ0aWNhbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFRva2VuU3RhdGUgPSAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQ7IHkrKykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbeF1beV0gIT0gMCAmJiB0aGlzLnRva2VuU3RhdGVzW3hdW3ldID09IGxhc3RUb2tlblN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBsYXN0IHRva2VuIHN0YXRlIHRvIHN0YXRlIG9mIGN1cnJlbnQgdG9rZW5cclxuICAgICAgICAgICAgICAgbGFzdFRva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3hdW3ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciBob3Jpem9udGFsIGNvbm5lY3Rpb25zIG9mIGZvdXIgdG9rZW5zXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0aGlzLnJvd0NvdW50OyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBsYXN0VG9rZW5TdGF0ZSA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5jb2x1bW5Db3VudDsgeSsrKSB7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBjb25uZWN0IGNvdW50IGZvciBub24tZGVmYXVsdCBtYXRjaGluZyBzZXF1ZW50aWFsIHN0YXRlcyBcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1t5XVt4XSAhPSAwICYmIHRoaXMudG9rZW5TdGF0ZXNbeV1beF0gPT0gbGFzdFRva2VuU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIGlmKGNvbm5lY3RDb3VudCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgLy8gVXBkYXRlIGxhc3QgdG9rZW4gc3RhdGUgdG8gc3RhdGUgb2YgY3VycmVudCB0b2tlblxyXG4gICAgICAgICAgICAgICBsYXN0VG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeV1beF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gQ2hlY2sgZm9yIHRvcCBsZWZ0LXRvLXJpZ2h0IGRpYWdvbmFsIGNvbm5lY3Rpb25zIG9mIGZvdXIgdG9rZW5zXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0aGlzLmNvbHVtbkNvdW50IC0gMzsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQgLSAxOyB5KyspIHtcclxuICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t4XVt5XTtcclxuXHJcbiAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBjb25uZWN0IGNvdW50IGZvciBub24tZGVmYXVsdCBtYXRjaGluZyBzZXF1ZW50aWFsIHN0YXRlcyBcclxuICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgIT0gMCAmJiB0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggKyAxXVt5ICsgMV0pIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDIgJiYgeSA8IHRoaXMucm93Q291bnQgLSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCArIDJdW3kgKyAyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50IC0gMyAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4ICsgM11beSArIDNdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIGlmKGNvbm5lY3RDb3VudCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciB0b3AgcmlnaHQtdG8tbGVmdCBkaWFnb25hbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2VucyBcclxuICAgICAgICAgZm9yKHZhciB4ID0gdGhpcy5jb2x1bW5Db3VudCAtIDE7IHggPj0gMyA7IHgtLSkgeyBcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudCAtIDE7IHkrKykge1xyXG4gICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSAhPSAwICYmIHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCAtIDFdW3kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50ICsgMiAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4IC0gMl1beSArIDJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgKyAzICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggLSAzXVt5ICsgM10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICBQcmVwYXJlTmV4dFBsYXllclR1cm46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICB0aGlzLmlzUGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIENhbkFkZFRva2VuOiBmdW5jdGlvbih0b2tlbikge1xyXG4gICAgICAgICByZXR1cm4gIXRva2VuLmNsYXNzTGlzdC5jb250YWlucygndG9rZW4tLXBsYXllcicpICYmICF0b2tlbi5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1jb21wdXRlcicpO1xyXG4gICAgICB9LFxyXG4gICAgICBSZXNldEdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAvLyBFbXB0eSB0b2tlbiBzdGF0ZXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXMgPSBbXTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIFB1c2ggY29sdW1ucyBvZiB0b2tlbiBzdGF0ZXMgd2l0aCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudDsgeCsrKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQ7IHkrKykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3hdW3ldID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgdG9rZW5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9rZW4nKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIEVuc3VyZSB0b2tlbnMgaW5kaWNhdGUgdW5hbGlnbmVkIGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0b2tlbnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdG9rZW5zW3hdLmNsYXNzTmFtZSA9ICd0b2tlbic7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIEluZGljYXRlIGdhbWUgaXMgbm90IG92ZXJcclxuICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgICAgdGhpcy5oYXNXb24gPSBmYWxzZTtcclxuICAgICAgICAgdGhpcy5oYXNMb3N0ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgfSxcclxuICAgYmVmb3JlTW91bnQoKSB7XHJcbiAgICAgIHRoaXMuUmVzZXRHYW1lKCk7XHJcbiAgIH1cclxufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
