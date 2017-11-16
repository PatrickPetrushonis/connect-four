new Vue({
   el: '#game',
   data: {
      tokenStates: [],
      columnCount: 7,
      rowCount: 6,
      turnTime: 1000,
      isPlayerTurn: true,
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
               alert('Defeated!');
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
         for(var x = 0; x < this.columnCount - 1; x++) {
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
         for(var x = this.columnCount - 1; x > 0 ; x--) { 
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
      }
   },
   beforeMount() {
      this.ResetGame();
   }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICB0b2tlblN0YXRlczogW10sXHJcbiAgICAgIGNvbHVtbkNvdW50OiA3LFxyXG4gICAgICByb3dDb3VudDogNixcclxuICAgICAgdHVyblRpbWU6IDEwMDAsXHJcbiAgICAgIGlzUGxheWVyVHVybjogdHJ1ZSxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2VcclxuICAgfSxcclxuICAgbWV0aG9kczoge1xyXG4gICAgICBBZGRUb2tlblRvQ29sdW1uOiBmdW5jdGlvbih0aGlzQ29sLCBldmVudCkge1xyXG4gICAgICAgICAvLyBPbmx5IGFsbG93IHBsYXllciBhY3Rpb24gb24gdGhlaXIgb3duIHR1cm5cclxuICAgICAgICAgaWYodGhpcy5pc1BsYXllclR1cm4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMucm93Q291bnQgLSAxOyB4ID49IDA7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAvLyBFbnN1cmUgc2VsZWN0ZWQgY2VsbCBpcyBkZWZhdWx0IHN0YXRlXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbdGhpc0NvbF1beF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID0gMTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aGlzVGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIEluZGljYXRlIHBsYXllciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IHRoaXNUYXJnZXQuY2hpbGRFbGVtZW50Q291bnQgLSAxOyB5ID49IDA7IHktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuID0gdGhpc1RhcmdldC5jaGlsZHJlblt5XS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuQ2FuQWRkVG9rZW4odGhpc1Rva2VuKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzVG9rZW4uY2xhc3NMaXN0LnRvZ2dsZSgndG9rZW4tLXBsYXllcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHBsYXllciBoYXMgdHJpZ2dlcmVkIGEgd2luIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrRm9yV2luQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgdHVybiB0cmFuc2l0aW9uIHByb3ZpZGVkIGdhbWUgaXMgc3RpbGwgaW4tcHJvZ3Jlc3NcclxuICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAvLyBEZWxheSBuZXh0IHBsYXllciB0dXJuIGZvciBhbmltYXRpb25zIGFuZCBjb21wdXRlciByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuUHJlcGFyZU5leHRQbGF5ZXJUdXJuLCB0aGlzLnR1cm5UaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBjb21wdXRlcidzIHR1cm4gc2hvcnRseSBhZnRlciBwbGF5ZXIncyB0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5BZGRUb2tlblRvUmFuZG9tQ29sdW1uLCB0aGlzLnR1cm5UaW1lICogMC41KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGhpcy5pc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgICAgIGFsZXJ0KCdWaWN0b3J5IScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbjogZnVuY3Rpb24oKSB7ICAgICAgICAgXHJcbiAgICAgICAgIGlmKCF0aGlzLmlzUGxheWVyVHVybikge1xyXG4gICAgICAgICAgICAvLyBSYW5kb21seSBzZWxlY3QgYSBjb2x1bW4gcmVwcmVzZW50ZWQgYnkgYW4gaW50ZWdlclxyXG4gICAgICAgICAgICB2YXIgcmFuZENvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY29sdW1uQ291bnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB4ID0gdGhpcy5yb3dDb3VudCAtIDE7IHggPj0gMDsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgIC8vIEVuc3VyZSBzZWxlY3RlZCBjZWxsIGlzIGRlZmF1bHQgc3RhdGVcclxuICAgICAgICAgICAgICAgaWYodGhpcy50b2tlblN0YXRlc1tyYW5kQ29sXVt4XSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXNbcmFuZENvbF1beF0gPSAyO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbkVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29sdW1uJyk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSBjb21wdXRlciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkRWxlbWVudENvdW50IC0gMTsgeSA+PSAwOyB5LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNUb2tlbiA9IGNvbHVtbkVsZW1lbnRzW3JhbmRDb2xdLmNoaWxkcmVuW3ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5DYW5BZGRUb2tlbih0aGlzVG9rZW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNUb2tlbi5jbGFzc0xpc3QudG9nZ2xlKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBjb21wdXRlciBoYXMgdHJpZ2dlcmVkIGEgd2luIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrRm9yV2luQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBicmVhazsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmVhdGVkIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQ2hlY2tGb3JXaW5Db25kaXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdmVydGljYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIGxhc3RUb2tlblN0YXRlID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50OyB5KyspIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3hdW3ldICE9IDAgJiYgdGhpcy50b2tlblN0YXRlc1t4XVt5XSA9PSBsYXN0VG9rZW5TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKzsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBVcGRhdGUgbGFzdCB0b2tlbiBzdGF0ZSB0byBzdGF0ZSBvZiBjdXJyZW50IHRva2VuXHJcbiAgICAgICAgICAgICAgIGxhc3RUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t4XVt5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgaG9yaXpvbnRhbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5yb3dDb3VudDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFRva2VuU3RhdGUgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMuY29sdW1uQ291bnQ7IHkrKykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbeV1beF0gIT0gMCAmJiB0aGlzLnRva2VuU3RhdGVzW3ldW3hdID09IGxhc3RUb2tlblN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBsYXN0IHRva2VuIHN0YXRlIHRvIHN0YXRlIG9mIGN1cnJlbnQgdG9rZW5cclxuICAgICAgICAgICAgICAgbGFzdFRva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3ldW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciB0b3AgbGVmdC10by1yaWdodCBkaWFnb25hbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDE7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50IC0gMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciB0aGlzVG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeF1beV07XHJcblxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlICE9IDAgJiYgdGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4ICsgMV1beSArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgLSAyICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggKyAyXVt5ICsgMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDMgJiYgeSA8IHRoaXMucm93Q291bnQgLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCArIDNdW3kgKyAzXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdG9wIHJpZ2h0LXRvLWxlZnQgZGlhZ29uYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnMgXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMuY29sdW1uQ291bnQgLSAxOyB4ID4gMCA7IHgtLSkgeyBcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudCAtIDE7IHkrKykge1xyXG4gICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSAhPSAwICYmIHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCAtIDFdW3kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50ICsgMiAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4IC0gMl1beSArIDJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgKyAzICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggLSAzXVt5ICsgM10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICBQcmVwYXJlTmV4dFBsYXllclR1cm46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICB0aGlzLmlzUGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIENhbkFkZFRva2VuOiBmdW5jdGlvbih0b2tlbikge1xyXG4gICAgICAgICByZXR1cm4gIXRva2VuLmNsYXNzTGlzdC5jb250YWlucygndG9rZW4tLXBsYXllcicpICYmICF0b2tlbi5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1jb21wdXRlcicpO1xyXG4gICAgICB9LFxyXG4gICAgICBSZXNldEdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAvLyBFbXB0eSB0b2tlbiBzdGF0ZXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXMgPSBbXTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIFB1c2ggY29sdW1ucyBvZiB0b2tlbiBzdGF0ZXMgd2l0aCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudDsgeCsrKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQ7IHkrKykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3hdW3ldID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgdG9rZW5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9rZW4nKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIEVuc3VyZSB0b2tlbnMgaW5kaWNhdGUgdW5hbGlnbmVkIGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0b2tlbnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdG9rZW5zW3hdLmNsYXNzTmFtZSA9ICd0b2tlbic7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIEluZGljYXRlIGdhbWUgaXMgbm90IG92ZXJcclxuICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gZmFsc2U7XHJcbiAgICAgICAgIHRoaXMuaXNQbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICB9LFxyXG4gICBiZWZvcmVNb3VudCgpIHtcclxuICAgICAgdGhpcy5SZXNldEdhbWUoKTtcclxuICAgfVxyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
