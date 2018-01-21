// DOM elements
const fields           = document.getElementsByClassName('box');
const infoBoard        = document.getElementById('info-board');
const resetButtonGame  = document.getElementById('button-reset-game');
const resetButtonScore = document.getElementById('button-reset-score');

// Won status consts
const WON_STATUS_NONE  = false;
const WON_STATUS_X     = 'X';
const WON_STATUS_O     = 'O';
const WON_STATUS_DRAWN = 'DRAWN';

// Bit masks
const emptyMask = 0b00000000;
const fullMask  = 0b11111111;

// All possible win combinations
const wonMasks = [
	/*
		[+][+][+]
		[ ][ ][ ]
		[ ][ ][ ]
	*/
	0b000000111,

	/*
		[ ][ ][ ]
		[+][+][+]
		[ ][ ][ ]
	*/
	0b000111000,

	/*
		[ ][ ][ ]
		[ ][ ][ ]
		[+][+][+]
	*/
	0b111000000,

	/*
		[+][ ][ ]
		[+][ ][ ]
		[+][ ][ ]
	*/
	0b001001001,

	/*
		[ ][+][ ]
		[ ][+][ ]
		[ ][+][ ]
	*/
	0b010010010,

	/*
		[ ][ ][+]
		[ ][ ][+]
		[ ][ ][+]
	*/
	0b100100100,

	/*
		[+][ ][ ]
		[ ][+][ ]
		[ ][ ][+]
	*/
	0b100010001,

	/*
		[ ][ ][+]
		[ ][+][ ]
		[+][ ][ ]
	*/
	0b001010100
];

var turnX = true;

var usedFields = emptyMask;

var player1Mask = emptyMask;
var player2Mask = emptyMask;

// board info
var xScore = 0;
var oScore = 0;
var resetTimes = 0;


// ------------ Init Game ------------
initGame();
// -----------------------------------


// Functions
function processFieldClick() {
	var field = this.getAttribute('tag');
	registerField(this, whosTurn(), field);
}

function whosTurn() {
	return (turnX) ? 'X' : 'O';
}

function registerField(button, playerid, fieldid) {
	if (usedFields & (1 << fieldid)) {
		return;
	}

	if (playerid == 'X') {
		player1Mask |= (1 << fieldid);
	} else {
		player2Mask |= (1 << fieldid);
	}

	button.innerHTML = whosTurn();
	button.style.backgroundColor = "#1a222a";

	usedFields |= (1 << fieldid);

	setTimeout(function() {
		var result = checkWin(playerid);
		switch (result) {
			case WON_STATUS_X:
				xScore++;
				showFinishDialog('X won the game!');
				break;

			case WON_STATUS_O:
				oScore++;
				showFinishDialog('O won the game!');
				break;

			case WON_STATUS_DRAWN:
				showFinishDialog('Drawn game :(');
				break;
		}

		turnX = !turnX;

		updateBoardInfo();
	}, 100);
}

function checkWin(playerid) {
	var mask = player2Mask;

	if (playerid == 'X') {
		mask = player1Mask;
	}

	for (var i = 0; i < wonMasks.length; i++) {
		if ( (mask & wonMasks[i]) == wonMasks[i]) {
			blockGame();
			return playerid;
		}
	}

	if ( (usedFields & fullMask) == fullMask) {
		return WON_STATUS_DRAWN;
	}
	return false;
}

function blockGame() {
	usedFields = fullMask;
}

function resetGame() {
	// Reset all masks
	player1Mask =
	player2Mask =
	usedFields  = emptyMask;

	// GUI reset
	for (var i = 0; i < fields.length; i++) {
		fields[i].innerHTML = '';
		fields[i].style.backgroundColor = "";
	}

	updateBoardInfo();
}

function updateBoardInfo() {
	infoBoard.innerHTML = whosTurn() + '`s turn!<br> <br> <br>'
						+ 'X Score: ' + xScore + '<br>'
						+ 'O Score: ' + oScore + '<br>'
						+ 'Reset Times: ' + resetTimes;
}

function showFinishDialog(msg) {
	alert(msg);
	resetGame();
}

function initGame() {
	// Reset game button
	resetButtonGame.addEventListener('click', function() {
		resetTimes++;
		resetGame();
	});

	// Reset score button
	resetButtonScore.addEventListener('click', function() {
		xScore = 0;
		oScore = 0;

		updateBoardInfo();
		//resetGame();
	})

	// Register fields
	for (var i = 0; i < fields.length; i++) {
		fields[i].addEventListener('click', processFieldClick, false);
	}

	// Init board
	updateBoardInfo();
}

