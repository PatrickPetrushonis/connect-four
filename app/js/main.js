new Vue({
   el: '#game',
   data: {
      tokenStates: [],
      columnCount: 7,
      rowCount: 6,
      turnTime: 1000,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICB0b2tlblN0YXRlczogW10sXHJcbiAgICAgIGNvbHVtbkNvdW50OiA3LFxyXG4gICAgICByb3dDb3VudDogNixcclxuICAgICAgdHVyblRpbWU6IDEwMDAsXHJcbiAgICAgIGlzUGxheWVyVHVybjogdHJ1ZSxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2UsXHJcbiAgICAgIGhhc1dvbjogZmFsc2UsXHJcbiAgICAgIGhhc0xvc3Q6IGZhbHNlXHJcbiAgIH0sXHJcbiAgIG1ldGhvZHM6IHtcclxuICAgICAgQWRkVG9rZW5Ub0NvbHVtbjogZnVuY3Rpb24odGhpc0NvbCwgZXZlbnQpIHtcclxuICAgICAgICAgLy8gT25seSBhbGxvdyBwbGF5ZXIgYWN0aW9uIG9uIHRoZWlyIG93biB0dXJuXHJcbiAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXJUdXJuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHggPSB0aGlzLnJvd0NvdW50IC0gMTsgeCA+PSAwOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgLy8gRW5zdXJlIHNlbGVjdGVkIGNlbGwgaXMgZGVmYXVsdCBzdGF0ZVxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1t0aGlzQ29sXVt4XSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB2YXIgdGhpc1RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7ICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHNlbGVjdGVkIHRoaXMgY2VsbFxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIHkgPSB0aGlzVGFyZ2V0LmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IHRoaXNUYXJnZXQuY2hpbGRyZW5beV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzLkNhbkFkZFRva2VuKHRoaXNUb2tlbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Rva2VuLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1wbGF5ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBwbGF5ZXIgaGFzIHRyaWdnZXJlZCBhIHdpbiBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja0ZvcldpbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHR1cm4gdHJhbnNpdGlvbiBwcm92aWRlZCBnYW1lIGlzIHN0aWxsIGluLXByb2dyZXNzXHJcbiAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgbmV4dCBwbGF5ZXIgdHVybiBmb3IgYW5pbWF0aW9ucyBhbmQgY29tcHV0ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLlByZXBhcmVOZXh0UGxheWVyVHVybiwgdGhpcy50dXJuVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY29tcHV0ZXIncyB0dXJuIHNob3J0bHkgYWZ0ZXIgcGxheWVyJ3MgdHVyblxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbiwgdGhpcy50dXJuVGltZSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBwbGF5ZXIgaGFzIHdvbiBjdXJyZW50IGdhbWVcclxuICAgICAgICAgICAgICAgdGhpcy5oYXNXb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbjogZnVuY3Rpb24oKSB7ICAgICAgICAgXHJcbiAgICAgICAgIGlmKCF0aGlzLmlzUGxheWVyVHVybikge1xyXG4gICAgICAgICAgICAvLyBSYW5kb21seSBzZWxlY3QgYSBjb2x1bW4gcmVwcmVzZW50ZWQgYnkgYW4gaW50ZWdlclxyXG4gICAgICAgICAgICB2YXIgcmFuZENvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY29sdW1uQ291bnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB4ID0gdGhpcy5yb3dDb3VudCAtIDE7IHggPj0gMDsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgIC8vIEVuc3VyZSBzZWxlY3RlZCBjZWxsIGlzIGRlZmF1bHQgc3RhdGVcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1tyYW5kQ29sXVt4XSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXNbcmFuZENvbF1beF0gPSAyO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbkVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29sdW1uJyk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBjb21wdXRlciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkcmVuW3ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5DYW5BZGRUb2tlbih0aGlzVG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNUb2tlbi5jbGFzc0xpc3QudG9nZ2xlKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBjb21wdXRlciBoYXMgdHJpZ2dlcmVkIGEgd2luIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrRm9yV2luQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBicmVhazsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgLy8gSW5kaWNhdGUgcGxheWVyIGhhcyBsb3N0IGN1cnJlbnQgZ2FtZVxyXG4gICAgICAgICAgICAgICB0aGlzLmhhc0xvc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQ2hlY2tGb3JXaW5Db25kaXRpb246IGZ1bmN0aW9uKCkgeyAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdmVydGljYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIGxhc3RUb2tlblN0YXRlID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50OyB5KyspIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3hdW3ldICE9IDAgJiYgdGhpcy50b2tlblN0YXRlc1t4XVt5XSA9PSBsYXN0VG9rZW5TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKzsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBVcGRhdGUgbGFzdCB0b2tlbiBzdGF0ZSB0byBzdGF0ZSBvZiBjdXJyZW50IHRva2VuXHJcbiAgICAgICAgICAgICAgIGxhc3RUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t4XVt5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgaG9yaXpvbnRhbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5yb3dDb3VudDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFRva2VuU3RhdGUgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMuY29sdW1uQ291bnQ7IHkrKykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbeV1beF0gIT0gMCAmJiB0aGlzLnRva2VuU3RhdGVzW3ldW3hdID09IGxhc3RUb2tlblN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBsYXN0IHRva2VuIHN0YXRlIHRvIHN0YXRlIG9mIGN1cnJlbnQgdG9rZW5cclxuICAgICAgICAgICAgICAgbGFzdFRva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3ldW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciB0b3AgbGVmdC10by1yaWdodCBkaWFnb25hbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDM7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50IC0gMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciB0aGlzVG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeF1beV07XHJcblxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlICE9IDAgJiYgdGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4ICsgMV1beSArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgLSAyICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggKyAyXVt5ICsgMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDMgJiYgeSA8IHRoaXMucm93Q291bnQgLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCArIDNdW3kgKyAzXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdG9wIHJpZ2h0LXRvLWxlZnQgZGlhZ29uYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnMgXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMuY29sdW1uQ291bnQgLSAxOyB4ID49IDMgOyB4LS0pIHsgXHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQgLSAxOyB5KyspIHtcclxuICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t4XVt5XTtcclxuXHJcbiAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBjb25uZWN0IGNvdW50IGZvciBub24tZGVmYXVsdCBtYXRjaGluZyBzZXF1ZW50aWFsIHN0YXRlcyBcclxuICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgIT0gMCAmJiB0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggLSAxXVt5ICsgMV0pIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCArIDIgJiYgeSA8IHRoaXMucm93Q291bnQgLSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCAtIDJdW3kgKyAyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50ICsgMyAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4IC0gM11beSArIDNdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIGlmKGNvbm5lY3RDb3VudCA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgUHJlcGFyZU5leHRQbGF5ZXJUdXJuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgICBDYW5BZGRUb2tlbjogZnVuY3Rpb24odG9rZW4pIHtcclxuICAgICAgICAgcmV0dXJuICF0b2tlbi5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1wbGF5ZXInKSAmJiAhdG9rZW4uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgfSxcclxuICAgICAgUmVzZXRHYW1lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgLy8gRW1wdHkgdG9rZW4gc3RhdGVzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgICAgICB0aGlzLnRva2VuU3RhdGVzID0gW107XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBQdXNoIGNvbHVtbnMgb2YgdG9rZW4gc3RhdGVzIHdpdGggZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykgeyBcclxuICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlcy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50OyB5KyspIHtcclxuICAgICAgICAgICAgICAgdGhpcy50b2tlblN0YXRlc1t4XVt5XSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIHRva2VucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rva2VuJyk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBFbnN1cmUgdG9rZW5zIGluZGljYXRlIHVuYWxpZ25lZCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdG9rZW5zLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRva2Vuc1t4XS5jbGFzc05hbWUgPSAndG9rZW4nO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBJbmRpY2F0ZSBnYW1lIGlzIG5vdCBvdmVyXHJcbiAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICB0aGlzLmlzUGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgICAgIHRoaXMuaGFzV29uID0gZmFsc2U7XHJcbiAgICAgICAgIHRoaXMuaGFzTG9zdCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcbiAgIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICB0aGlzLlJlc2V0R2FtZSgpO1xyXG4gICB9XHJcbn0pOyJdLCJmaWxlIjoibWFpbi5qcyJ9
