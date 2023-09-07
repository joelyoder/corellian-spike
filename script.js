"use strict";

// The Pot
let gamePot = 0;
let sabaccPot = 0;

// Stacks of Cards
let deck = new Array();
let discard = new Array();

// Defaults
const startingCredits = 100;
const gameAnte = 1;
const sabaccAnte = 2;

// Players
const playerCount = 4;
let players = new Array();

// Game State
let currentRound = 1;
let currentStage = 1;
let currentPlayer = 0;
let currentBet = 0;

// Set up a new game automatically on load
function load()
{
	newGame();
}

window.addEventListener('load', load);

// Game Setup
function newGame() {
    // Set everything to the defaults
    gamePot = 0;
    sabaccPot = 0;
    currentPlayer = 0;
    currentRound = 1;
    currentStage = 1;
    currentBet = 0;

    // Set up the players
    for (let i = 0; i < playerCount; i++) {
        players[i] = {Hand:new Array(), Credits:startingCredits};
    }

    updateGameUI();

    newDeal();
    anteUp();

    console.log('Round ' + currentRound, 'Stage ' + currentStage, 'Player ' +  currentPlayer);
}

function endGame() {
    // Determine winner via game conditions
    // Assign winnings to the winning player
    // Reset sabacc pot if they won via sabacc

    // Reset everything that always should be reset
    gamePot = 0;
    currentPlayer = 0;
    currentRound = 1;
    currentStage = 1;
    currentBet = 0;

    // Empty the player hands
    for (let i = 0; i < playerCount; i++) {
        players[i] = {Hand:new Array()};
    }

    updateGameUI();

    newDeal();
    anteUp();
}

function updateGameUI() {
    document.getElementById('gamePot').innerText = gamePot;
    document.getElementById('sabaccPot').innerText = sabaccPot;
    document.getElementById('currentBet').innerText = currentBet;
    document.getElementById('currentRound').innerText = currentRound;
    document.getElementById('currentPlayer').innerText = currentPlayer;
    document.getElementById('currentRound').innerText = currentRound;

    switch (currentStage) {
        case 1:
            document.getElementById('currentStage').innerText = 'Draw';
            currentStage++;
            break;
        case 2:
            document.getElementById('currentStage').innerText = 'Betting';
            currentStage++;
            break;
        case 3:
            document.getElementById('currentStage').innerText = 'Spike';
            currentStage = 1;
            currentRound++;
            rollSpike();
            break;
        default:
            document.getElementById('currentStage').innerText = 'Error';
    }
}

// Turn Taking
function nextPlayer() {
    currentPlayer++;

    if (currentPlayer === (playerCount - 1)) {
        currentPlayer = 0;
        console.log('reset player');
    }

    updateGameUI();
}


// The Card Deck
const staves = ['circles', 'triangles', 'squares'];
const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10];
const sylopsNumber = 2;

// Deck management
function getDeck() {
    let deck = new Array();

    // Build the deck of normal cards, iteration over the staves and values
    for (let i = 0; i < staves.length; i++) {

        for (let x = 0; x < values.length; x++) {
            let card = {Value: values[x], Stave: staves[i]};
            deck.push(card);
        }
    }

    // Add in our two sylops cards
    for (let s = 0; s < sylopsNumber; s++) {
        let card = {Value: 0, Stave: 'sylops'};
        deck.push(card);
    }

    return deck;
}

function shuffle() {

    // Shuffle for 1000 times
    for (let i = 0; i < 1000; i++) {
        
        // Pick two random locations to start swapping cards
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

        // Swap the cards in locations 1 and 2, rinse and repeat
		deck[location1] = deck[location2];
		deck[location2] = tmp;
    }

    renderDeck();
}

function renderDeck() {

    // Reset the element
    document.getElementById('deck').innerHTML = '';

    for(let i = 0; i < deck.length; i++) {

        // Determine if the card should be green or red depending on the value
        // This uses generic class names for color customization
        let cardType;
        
        if (deck[i].Value > 0) {
            cardType = "pos";
        } else if (isNegative(deck[1].Value)) {
            cardType = "neg";
        } else {
            cardType = "";
        }
        
        // Create the divs for the cards and assign classes
        let card = document.createElement('div');
        let value = document.createElement('div');
        card.className = "card " + deck[i].Stave + " " + cardType;
        value.className = "value";

        value.innerHTML = deck[i].Value;
		card.appendChild(value);

		document.getElementById('deck').appendChild(card);
    } 
}

function resetDeck() {
    // Empty the discard pile first!
    discard = new Array();

    deck = getDeck();
    shuffle();
}

function discardDeck() {
    discard.push(deck.pop());

    document.getElementById('discard').innerText = discard[0].Value;
}

function newDeal() {
    resetDeck();

    // Deal 2 cards to each player
    for (let p = 0; p < playerCount; p++) {
        players[p].Hand.push(...dealCards(2));
    }

    discardDeck();
}

function reDeal() {
    // Pull the current number of cards from each player

    resetDeck();

    // Deal out the same number of cards to each player

    discardDeck();
}

function dealCards(cardNumber) {
    let cards = new Array();

    for (let i = 0; i < cardNumber; i++ ) {
        cards.push(deck.pop());
    }

    return cards;
}

// Drawing Functions
function stand() {
    nextPlayer();
}

function drawFromPile() {

}

function swapFromPile() {

}

function swapFromDiscard() {

}

// Betting Functions
function anteGamePot(player, amount) {
    players[player].Credits = players[player].Credits - amount;
    gamePot = gamePot + amount;

    document.getElementById('gamePot').innerText = gamePot;
}

function anteSabaccPot(player, amount) {
    players[player].Credits = players[player].Credits - amount;
    sabaccPot = sabaccPot + amount;

    document.getElementById('sabaccPot').innerText = sabaccPot;
}

function anteUp() {
    for (let p = 0; p < playerCount; p++) {
        anteGamePot(p, gameAnte);
        anteSabaccPot(p, sabaccAnte);
    }
}

function check() {
    // Move to the next player's turn
}

function bet(pot, amount) {
    
}

function call() {

}

function raise(amount) {

}

function junk() {

}

function allIn() {

}

// Spiking Functions
function rollSpike() {

}

// Misc utilities
function isNegative(num) {
    if (typeof num === 'number' && Math.sign(num) === -1) {
        return true;
    }

    return false;
}