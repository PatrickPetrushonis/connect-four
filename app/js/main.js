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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICBpc1BsYXllclR1cm46IHRydWUsXHJcbiAgICAgIHRva2VuU3RhdGVzOiBbXSxcclxuICAgICAgY29sdW1uQ291bnQ6IDcsXHJcbiAgICAgIHJvd0NvdW50OiA2LFxyXG4gICAgICB0dXJuVGltZTogMTAwMCxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2VcclxuICAgfSxcclxuICAgbWV0aG9kczoge1xyXG4gICAgICBBZGRUb2tlblRvQ29sdW1uOiBmdW5jdGlvbih0aGlzQ29sLCBldmVudCkge1xyXG4gICAgICAgICAvLyBPbmx5IGFsbG93IHBsYXllciBhY3Rpb24gb24gdGhlaXIgb3duIHR1cm5cclxuICAgICAgICAgaWYodGhpcy5pc1BsYXllclR1cm4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMucm93Q291bnQgLSAxOyB4ID49IDA7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAvLyBFbnN1cmUgc2VsZWN0ZWQgY2VsbCBpcyBkZWZhdWx0IHN0YXRlXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbdGhpc0NvbF1beF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID0gMTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aGlzVGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIEluZGljYXRlIHBsYXllciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IHRoaXNUYXJnZXQuY2hpbGRFbGVtZW50Q291bnQgLSAxOyB5ID49IDA7IHktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZighdGhpc1RhcmdldC5jaGlsZHJlblt5XS5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1wbGF5ZXInKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXNUYXJnZXQuY2hpbGRyZW5beV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tY29tcHV0ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzVGFyZ2V0LmNoaWxkcmVuW3ldLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1wbGF5ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBwbGF5ZXIgaGFzIHRyaWdnZXJlZCBhIHdpbiBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja0ZvcldpbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHR1cm4gdHJhbnNpdGlvbiBwcm92aWRlZCBnYW1lIGlzIHN0aWxsIGluLXByb2dyZXNzXHJcbiAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgbmV4dCBwbGF5ZXIgdHVybiBmb3IgYW5pbWF0aW9ucyBhbmQgY29tcHV0ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLlByZXBhcmVOZXh0UGxheWVyVHVybiwgdGhpcy50dXJuVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY29tcHV0ZXIncyB0dXJuIHNob3J0bHkgYWZ0ZXIgcGxheWVyJ3MgdHVyblxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbiwgdGhpcy50dXJuVGltZSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICBhbGVydCgnVmljdG9yeSEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIEFkZFRva2VuVG9SYW5kb21Db2x1bW46IGZ1bmN0aW9uKCkgeyAgICAgICAgIFxyXG4gICAgICAgICBpZighdGhpcy5pc1BsYXllclR1cm4pIHtcclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgY29sdW1uIHJlcHJlc2VudGVkIGJ5IGFuIGludGVnZXJcclxuICAgICAgICAgICAgdmFyIHJhbmRDb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbHVtbkNvdW50KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMucm93Q291bnQgLSAxOyB4ID49IDA7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAvLyBFbnN1cmUgc2VsZWN0ZWQgY2VsbCBpcyBkZWZhdWx0IHN0YXRlXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbcmFuZENvbF1beF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3JhbmRDb2xdW3hdID0gMjtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW5FbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbHVtbicpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSW5kaWNhdGUgY29tcHV0ZXIgaGFzIHNlbGVjdGVkIHRoaXMgY2VsbFxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIHkgPSBjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZEVsZW1lbnRDb3VudCAtIDE7IHkgPj0gMDsgeS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKCFjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZHJlblt5XS5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1wbGF5ZXInKSAmJiAhY29sdW1uRWxlbWVudHNbcmFuZENvbF0uY2hpbGRyZW5beV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tY29tcHV0ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZHJlblt5XS5jbGFzc0xpc3QudG9nZ2xlKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBjb21wdXRlciBoYXMgdHJpZ2dlcmVkIGEgd2luIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrRm9yV2luQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBicmVhazsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmVhdGVkIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQ2hlY2tGb3JXaW5Db25kaXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdmVydGljYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IHRoaXMuY29sdW1uQ291bnQ7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIGxhc3RUb2tlblN0YXRlID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50OyB5KyspIHsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzLnRva2VuU3RhdGVzW3hdW3ldICE9IDAgJiYgdGhpcy50b2tlblN0YXRlc1t4XVt5XSA9PSBsYXN0VG9rZW5TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKzsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBVcGRhdGUgbGFzdCB0b2tlbiBzdGF0ZSB0byBzdGF0ZSBvZiBjdXJyZW50IHRva2VuXHJcbiAgICAgICAgICAgICAgIGxhc3RUb2tlblN0YXRlID0gdGhpcy50b2tlblN0YXRlc1t4XVt5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgaG9yaXpvbnRhbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5yb3dDb3VudDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFRva2VuU3RhdGUgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMuY29sdW1uQ291bnQ7IHkrKykgeyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbeV1beF0gIT0gMCAmJiB0aGlzLnRva2VuU3RhdGVzW3ldW3hdID09IGxhc3RUb2tlblN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBsYXN0IHRva2VuIHN0YXRlIHRvIHN0YXRlIG9mIGN1cnJlbnQgdG9rZW5cclxuICAgICAgICAgICAgICAgbGFzdFRva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3ldW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIENoZWNrIGZvciB0b3AgbGVmdC10by1yaWdodCBkaWFnb25hbCBjb25uZWN0aW9ucyBvZiBmb3VyIHRva2Vuc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDE7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCB0aGlzLnJvd0NvdW50IC0gMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciB0aGlzVG9rZW5TdGF0ZSA9IHRoaXMudG9rZW5TdGF0ZXNbeF1beV07XHJcblxyXG4gICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgY29ubmVjdCBjb3VudCBmb3Igbm9uLWRlZmF1bHQgbWF0Y2hpbmcgc2VxdWVudGlhbCBzdGF0ZXMgXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlICE9IDAgJiYgdGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4ICsgMV1beSArIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgLSAyICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggKyAyXVt5ICsgMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4IDwgdGhpcy5jb2x1bW5Db3VudCAtIDMgJiYgeSA8IHRoaXMucm93Q291bnQgLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCArIDNdW3kgKyAzXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSAgICAgIFxyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICBpZihjb25uZWN0Q291bnQgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgY29ubmVjdENvdW50ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAvLyBDaGVjayBmb3IgdG9wIHJpZ2h0LXRvLWxlZnQgZGlhZ29uYWwgY29ubmVjdGlvbnMgb2YgZm91ciB0b2tlbnMgXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMuY29sdW1uQ291bnQgLSAxOyB4ID4gMCA7IHgtLSkgeyBcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudCAtIDE7IHkrKykge1xyXG4gICAgICAgICAgICAgICB2YXIgdGhpc1Rva2VuU3RhdGUgPSB0aGlzLnRva2VuU3RhdGVzW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGNvbm5lY3QgY291bnQgZm9yIG5vbi1kZWZhdWx0IG1hdGNoaW5nIHNlcXVlbnRpYWwgc3RhdGVzIFxyXG4gICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSAhPSAwICYmIHRoaXNUb2tlblN0YXRlID09IHRoaXMudG9rZW5TdGF0ZXNbeCAtIDFdW3kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKHggPCB0aGlzLmNvbHVtbkNvdW50ICsgMiAmJiB5IDwgdGhpcy5yb3dDb3VudCAtIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpc1Rva2VuU3RhdGUgPT0gdGhpcy50b2tlblN0YXRlc1t4IC0gMl1beSArIDJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCA8IHRoaXMuY29sdW1uQ291bnQgKyAzICYmIHkgPCB0aGlzLnJvd0NvdW50IC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzVG9rZW5TdGF0ZSA9PSB0aGlzLnRva2VuU3RhdGVzW3ggLSAzXVt5ICsgM10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgaWYoY29ubmVjdENvdW50ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGNvbm5lY3RDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICBQcmVwYXJlTmV4dFBsYXllclR1cm46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICB0aGlzLmlzUGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIFJlc2V0R2FtZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgIC8vIEVtcHR5IHRva2VuIHN0YXRlcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAgdGhpcy50b2tlblN0YXRlcyA9IFtdO1xyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gUHVzaCBjb2x1bW5zIG9mIHRva2VuIHN0YXRlcyB3aXRoIGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCB0aGlzLmNvbHVtbkNvdW50OyB4KyspIHsgXHJcbiAgICAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXMucHVzaChbXSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgdGhpcy5yb3dDb3VudDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXNbeF1beV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBjb2x1bW5FbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbHVtbicpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gRW5zdXJlIGNvbHVtbiBjZWxscyBpbmRpY2F0ZSB1bmFsaWduZWQgZGVmYXVsdCB2YWx1ZXNcclxuICAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IGNvbHVtbkVsZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCBjb2x1bW5FbGVtZW50c1t4XS5jaGlsZEVsZW1lbnRDb3VudDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgIGNvbHVtbkVsZW1lbnRzW3hdLmNoaWxkcmVuW3ldLmNsYXNzTmFtZSA9ICdjZWxsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBJbmRpY2F0ZSBnYW1lIGlzIG5vdCBvdmVyXHJcbiAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgICB0aGlzLmlzUGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgfSxcclxuICAgYmVmb3JlTW91bnQoKSB7XHJcbiAgICAgIHRoaXMuUmVzZXRHYW1lKCk7XHJcbiAgIH1cclxufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
