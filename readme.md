# Captain's Mistress (a.k.a. Connect Four)

This game is implemented using Javascript, HTML, and CSS.

## Additional tools

* Vue framework for enhanced interaction with MVC and two-way data binding
* SCSS preprocessor for style nesting and variables
* Gulp workflow for compiling CSS from SCSS, watching files, and facilitating local tests

## Specifications

* The board is 6 units tall and 7 units wide. 
* The human-player goes first by choosing one of the 7 columns to drop a token.  
* The token will fall to the bottom of that column.  
* The computer-player will then make a move (no strategy necessary, random column selection). 
* The first player to get 4 tokens in a row (horizontal, vertical, or diagonal) is the winner.
  
## Requirements
 
* Game-ability (does the game work)
* Code readability
* README.md file with journal of work or thought processes
* No use of special frameworks or libraries designed for Connect Four
* Denote and explain any use of other libraries like JQuery

## Thought Processes

### Win condition checking

* Horizontal
* Vertical
* Top left to bottom right diagonal
* Top right to bottom left diagonal
