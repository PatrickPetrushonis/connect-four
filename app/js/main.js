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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm5ldyBWdWUoe1xyXG4gICBlbDogJyNnYW1lJyxcclxuICAgZGF0YToge1xyXG4gICAgICBpc1BsYXllclR1cm46IHRydWUsXHJcbiAgICAgIHRva2VuU3RhdGVzOiBbXSxcclxuICAgICAgY29sdW1uQ291bnQ6IDcsXHJcbiAgICAgIHJvd0NvdW50OiA2LFxyXG4gICAgICB0dXJuVGltZTogMTAwMCxcclxuICAgICAgaXNHYW1lT3ZlcjogZmFsc2VcclxuICAgfSxcclxuICAgbWV0aG9kczoge1xyXG4gICAgICBBZGRUb2tlblRvQ29sdW1uOiBmdW5jdGlvbih0aGlzQ29sLCBldmVudCkge1xyXG4gICAgICAgICAvLyBPbmx5IGFsbG93IHBsYXllciBhY3Rpb24gb24gdGhlaXIgb3duIHR1cm5cclxuICAgICAgICAgaWYodGhpcy5pc1BsYXllclR1cm4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMucm93Q291bnQgLSAxOyB4ID49IDA7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAvLyBFbnN1cmUgc2VsZWN0ZWQgY2VsbCBpcyBkZWZhdWx0IHN0YXRlXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbdGhpc0NvbF1beF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3RoaXNDb2xdW3hdID0gMTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aGlzVGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIEluZGljYXRlIHBsYXllciBoYXMgc2VsZWN0ZWQgdGhpcyBjZWxsXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgeSA9IHRoaXNUYXJnZXQuY2hpbGRFbGVtZW50Q291bnQgLSAxOyB5ID49IDA7IHktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZighdGhpc1RhcmdldC5jaGlsZHJlblt5XS5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1wbGF5ZXInKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXNUYXJnZXQuY2hpbGRyZW5beV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tY29tcHV0ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzVGFyZ2V0LmNoaWxkcmVuW3ldLmNsYXNzTGlzdC50b2dnbGUoJ3Rva2VuLS1wbGF5ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBwbGF5ZXIgaGFzIHRyaWdnZXJlZCBhIHdpbiBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgICAgdGhpcy5DaGVja0ZvcldpbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHR1cm4gdHJhbnNpdGlvbiBwcm92aWRlZCBnYW1lIGlzIHN0aWxsIGluLXByb2dyZXNzXHJcbiAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgbmV4dCBwbGF5ZXIgdHVybiBmb3IgYW5pbWF0aW9ucyBhbmQgY29tcHV0ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLlByZXBhcmVOZXh0UGxheWVyVHVybiwgdGhpcy50dXJuVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY29tcHV0ZXIncyB0dXJuIHNob3J0bHkgYWZ0ZXIgcGxheWVyJ3MgdHVyblxyXG4gICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuQWRkVG9rZW5Ub1JhbmRvbUNvbHVtbiwgdGhpcy50dXJuVGltZSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNHYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICBhbGVydCgnVmljdG9yeSEnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIEFkZFRva2VuVG9SYW5kb21Db2x1bW46IGZ1bmN0aW9uKCkgeyAgICAgICAgIFxyXG4gICAgICAgICBpZighdGhpcy5pc1BsYXllclR1cm4pIHtcclxuICAgICAgICAgICAgLy8gUmFuZG9tbHkgc2VsZWN0IGEgY29sdW1uIHJlcHJlc2VudGVkIGJ5IGFuIGludGVnZXJcclxuICAgICAgICAgICAgdmFyIHJhbmRDb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmNvbHVtbkNvdW50KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeCA9IHRoaXMucm93Q291bnQgLSAxOyB4ID49IDA7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAvLyBFbnN1cmUgc2VsZWN0ZWQgY2VsbCBpcyBkZWZhdWx0IHN0YXRlXHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMudG9rZW5TdGF0ZXNbcmFuZENvbF1beF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3JhbmRDb2xdW3hdID0gMjtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW5FbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbHVtbicpO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gSW5kaWNhdGUgY29tcHV0ZXIgaGFzIHNlbGVjdGVkIHRoaXMgY2VsbFxyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIHkgPSBjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZEVsZW1lbnRDb3VudCAtIDE7IHkgPj0gMDsgeS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKCFjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZHJlblt5XS5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2VuLS1wbGF5ZXInKSAmJiAhY29sdW1uRWxlbWVudHNbcmFuZENvbF0uY2hpbGRyZW5beV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2tlbi0tY29tcHV0ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5FbGVtZW50c1tyYW5kQ29sXS5jaGlsZHJlblt5XS5jbGFzc0xpc3QudG9nZ2xlKCd0b2tlbi0tY29tcHV0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBjb21wdXRlciBoYXMgdHJpZ2dlcmVkIGEgd2luIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLkNoZWNrRm9yV2luQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBicmVhazsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzR2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmVhdGVkIScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgQ2hlY2tGb3JXaW5Db25kaXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgUHJlcGFyZU5leHRQbGF5ZXJUdXJuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgICBSZXNldEdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAvLyBFbXB0eSB0b2tlbiBzdGF0ZXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgIHRoaXMudG9rZW5TdGF0ZXMgPSBbXTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIFB1c2ggY29sdW1ucyBvZiB0b2tlbiBzdGF0ZXMgd2l0aCBkZWZhdWx0IHZhbHVlc1xyXG4gICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgdGhpcy5jb2x1bW5Db3VudDsgeCsrKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMDsgeSA8IHRoaXMucm93Q291bnQ7IHkrKykge1xyXG4gICAgICAgICAgICAgICB0aGlzLnRva2VuU3RhdGVzW3hdW3ldID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgY29sdW1uRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb2x1bW4nKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIEVuc3VyZSBjb2x1bW4gY2VsbHMgaW5kaWNhdGUgdW5hbGlnbmVkIGRlZmF1bHQgdmFsdWVzXHJcbiAgICAgICAgIGZvcih2YXIgeCA9IDA7IHggPCBjb2x1bW5FbGVtZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAwOyB5IDwgY29sdW1uRWxlbWVudHNbeF0uY2hpbGRFbGVtZW50Q291bnQ7IHkrKykge1xyXG4gICAgICAgICAgICAgICBjb2x1bW5FbGVtZW50c1t4XS5jaGlsZHJlblt5XS5jbGFzc05hbWUgPSAnY2VsbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gSW5kaWNhdGUgZ2FtZSBpcyBub3Qgb3ZlclxyXG4gICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSBmYWxzZTtcclxuICAgICAgICAgdGhpcy5pc1BsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcbiAgIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICB0aGlzLlJlc2V0R2FtZSgpO1xyXG4gICB9XHJcbn0pOyJdLCJmaWxlIjoibWFpbi5qcyJ9
