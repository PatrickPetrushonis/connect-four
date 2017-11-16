# Captain's Mistress (a.k.a. Connect Four)

This game is implemented using Javascript, HTML, and CSS.

## Table of Contents

* Additional Tools
* Specifications
* Requirements
* Instructions
* Thought Processes

## Additional Tools

* Vue framework for enhanced interaction with MVC and two-way data binding
* SCSS preprocessor for style nesting, variables, and functions
* Gulp workflow for compiling CSS from SCSS, watching files, and facilitating local tests

## Specifications

* The board is 6 units tall and 7 units wide
* The human-player goes first by choosing one of the 7 columns to drop a token
* The token will fall to the bottom of that column
* The computer-player will then make a move (no strategy necessary, random column selection)
* The first player to get 4 tokens in a row (horizontal, vertical, or diagonal) is the winner
  
## Requirements
 
* Game-ability (does the game work)
* Code readability
* README.md file with journal of work or thought processes
* No use of special frameworks or libraries designed for Connect Four
* Denote and explain any use of other libraries like JQuery

## Instructions

* Download repository to a local folder of your choice
* Open the command line at that directory (type 'cmd' into windows explore for quick-access)
* Execute the following commands:
		
		// Installs all node modules specified in the package.json
		npm install

		// Adds gulp to the environment PATH for use in the CLI 
		npm install -g gulp

		// Runs the default gulp task which compiles the project
		gulp

## Thought Processes

### Vue Framework

Using this front-end framework greatly facilitates the logic end of the game. This allowed the quick creation of an object with unique methods and properties to handle game state, player turns, gameplay, and win conditions in a concise package. The addition of minimal markup for event and data binding within the HTML also provides a greater sense of order to a potentially cluttered file.

### Gulp Workflow

This workflow is extremely helpful when adding modular improvements to a project. For this particular case, the primary uses are error detection regardless of IDE and compiling SCSS into CSS with all necessary browser prefixes. Additionally, the vue.js library can be easily combined with the custom Vue object into a single JavaScript file. Provided the project were to increase across multiple pages, an addition of the Nunjucks templating engine would be desirable.

### Win condition checking

There are four potential win conditions, based on the alignment of the connected tokens. Horizontal across a single row, vertical across a single column, diagonal from the top left to bottom right, and diagonal from the top right to the bottom left. As each of these require different awareness of their adjacent tokens, a separate looping handler was implemented for each. All four of these handlers are called on each token addition as a redundancy check rather than intuitively predicting which win condition is more valid.

### Potential improvements

* Increase computer difficult
* Indicate winning connection
* Mass falling token animation on reset
* Dynamically generate game grid
