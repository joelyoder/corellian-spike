"use strict";

// The Pot
let gamePot = 0;
let sabaccPot = 0;
let currentBet = 0;

// Record of Cards in Play
let deck = new Array();
let discardPile = new Array();

// Player Stats
let player1Hand = new Array();
let player2Hand = new Array();

let player1Credits = 0;
let player2Credits = 0;

function load()
{
	newGame();
}

window.addEventListener('load', load);

// Game Management
function newGame() {
    // Set up the deck
    resetDeck();

    // Set everything to the defaults
    player1Hand = new Array();
    player2Hand = new Array();
    gamePot = 0;
    sabaccPot = 0;
    currentBet = 0;
}

function endGame() {

}

// The Card Deck
const staves = ['circles', 'triangles', 'squares'];
const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10];
const sylopsNumber = 2;

// Setting up the deck
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

    // Get the deck element on the page
    document.getElementById('deck').innerHTML = '';

    for(let i = 0; i < deck.length; i++) {

        // Determine if the card should be green or red depending on the value
        // This uses generic class names for color customization
        let cardType;
        
        if (deck[i].Value > 0) {
            cardType = "pos";
        } else if (deck[1].Value < 0) {
            cardType = "neg";
        } else {
            cardType = "";
        }

        //console.log('this is working');
        
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
    deck = getDeck();
    shuffle();
}

// Card Management
function dealToPlayer(player, cardAmount) {

}

function addToHand(player, card) {

}

function removeFromHand(player, card) {

}

// Drawing Functions
function stand() {

}

function drawFromPile() {

}

function swapFromPile() {

}

function swapFromDiscard() {

}

// Betting Functions
function check() {

}

function bet(amount) {

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