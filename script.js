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
        // Create the players array that tracks their stats and give them the starting credits
        players[i] = {Hand:new Array(), Credits:startingCredits};
    }
    
    newDeal();
    anteUp();
    updateGameUI();

    console.log('Round ' + currentRound, 'Stage ' + currentStage, 'Player ' +  (currentPlayer + 1));
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

    newDeal();
    anteUp();
    updateGameUI();
}

function updateGameUI() {
    // Money
    document.getElementById('gamePot').innerText = gamePot;
    document.getElementById('sabaccPot').innerText = sabaccPot;
    document.getElementById('currentBet').innerText = currentBet;
    renderCreditTracker();

    // Game State
    document.getElementById('currentRound').innerText = currentRound;
    document.getElementById('currentPlayer').innerText = (currentPlayer + 1);
    document.getElementById('currentRound').innerText = currentRound;

    switch (currentStage) {
        case 1:
            document.getElementById('currentStage').innerText = 'Draw';
            break;
        case 2:
            document.getElementById('currentStage').innerText = 'Betting';
            break;
        case 3:
            document.getElementById('currentStage').innerText = 'Spike';
            
            break;
        default:
            document.getElementById('currentStage').innerText = 'Error';
    }

    renderHands();
}

function renderCreditTracker() {
    // Reset the credit tracker
    document.getElementById('creditTracker').innerHTML = '';

    // Set up the credit tracker UI
    for (let i = 0; i < playerCount; i++) {
        let playerCreditTracker = document.createElement('li');
        playerCreditTracker.innerText = `Player ${i + 1} Credits: ` + players[i].Credits;
		document.getElementById('creditTracker').appendChild(playerCreditTracker);
    }
}

function renderHands() {
    // Reset the hands
    document.getElementById('hands').innerHTML = '';

    // Set up the credit tracker UI
    for (let i = 0; i < playerCount; i++) {
        let heading = document.createElement('h2');
        heading.innerText = `Player ${i + 1} Hand`;

        let container = document.createElement('div');
        container.className = "container";

        console.log(players[i].Hand.length);

        for (let x = 0; x < (players[i].Hand.length); i++) {
            let cardType;

            if (players[i].Hand[x].Value > 0) {
                cardType = "pos";
            } else if (isNegative(players[i].Hand[x].Value)) {
                cardType = "neg";
            } else {
                cardType = "";
            }

            let card = document.createElement('div');
            let value = document.createElement('div');
            card.className = "card " + players[i].Hand[x].Stave + " " + cardType;
            value.className = "value";

            value.innerText = players[i].Hand[x].Value;
            card.appendChild(value);
            container.appendChild(card);
        }

        document.getElementById('hands').appendChild(heading);
        document.getElementById('hands').appendChild(container);
    }
}

// Turn Taking
function nextPlayer() {
    // Move our player tracker to the next player
    currentPlayer++;

    // If the tracker goes past the current number of players, move the stage tracker forward and reset the player tracker
    if (currentPlayer === playerCount) {
        currentPlayer = 0;
        currentStage++;
    }

    // At the end of the final stage, roll the spike and move to the next round
    if (currentStage === 3) {
        rollSpike();
        currentStage = 1;
        currentRound++;
    }

    // After the third round, end the game
    if (currentRound === 4) {
        alert("Game Over!");

        endGame();
    }

    // Update the game UI to refelect these state changes
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
        } else if (isNegative(deck[i].Value)) {
            cardType = "neg";
        } else {
            cardType = "";
        }
        
        // Create the divs for the cards and assign classes
        let card = document.createElement('div');
        let value = document.createElement('div');
        card.className = "card " + deck[i].Stave + " " + cardType;
        value.className = "value";

        value.innerText = deck[i].Value;
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

function discardCard(unwantedCard) {
    // Remove the current discard pile card in the DOM, if there is one
    document.getElementById('discard').innerHTML = '';

    // Put the discarded card into the top of the discard pile
    discard.push(unwantedCard);

    // Determine if the card should be green or red depending on the value
    // This uses generic class names for color customization
    let cardType;
    if (unwantedCard.Value > 0) {
        cardType = "pos";
    } else if (isNegative(unwantedCard.Value)) {
        cardType = "neg";
    } else {
        cardType = "";
    }

    // Create the card on the page
    let card = document.createElement('div');
    let value = document.createElement('div');
    card.className = "card " + unwantedCard.Stave + " " + cardType;
    value.className = "value";

    value.innerHTML = unwantedCard.Value;
    card.appendChild(value);

    document.getElementById('discard').appendChild(card);
}

function newDeal() {
    resetDeck();

    // Deal 2 cards to each player
    for (let p = 0; p < playerCount; p++) {
        players[p].Hand.push(...dealCards(2));
    }

    // Discard the top card of the deck
    discardCard(deck.pop());
}

function reDeal() {
    let handSizes = new Array();

    // Pull the current number of cards from each player
    for (let p = 0; p < playerCount; p++) {

        // Pull the number of cards that are in their hand
        let playerHand = players[p].Hand
        let handSize = Object.keys(playerHand).length;

        // Store that in our array
        handSizes.push(handSize);

        // Empty their hand
        players[p] = {Hand:new Array()};
    }

    console.log("All player data before reset: ", players);
    console.log("All player cards: " + handSizes);

    resetDeck();

    for (let p = 0; p < playerCount; p++) {
        // Pull their number of cards out of our array
        let newHand = handSizes.pop();

        // Deal them the same number of cards from the fresh desk
        players[p].Hand.push(...dealCards(newHand));
    }

    console.log("All player data after reset: ", players);

    // Discard the top card of the deck
    discardCard(deck.pop());
}

function dealCards(cardNumber) {
    let deltCards = new Array();

    // Pull the number of requested cards off the deck and pass them back 
    for (let i = 0; i < cardNumber; i++ ) {
        deltCards.push(deck.pop());
    }

    return deltCards;
}

// Drawing Functions
function stand() {
    nextPlayer();
}

function drawFromPile() {
    // Spend 1 credit
    spendGamePot(currentPlayer, 1);

    // Pull one card from the deck
    let drawnCard = dealCards(1);

    // Ask if the player wants to keep the card, either add it to their hand or discard it
    if (confirm(`You draw a ${drawnCard[0].Value}, do you want to keep it?`) === true) {
        players[currentPlayer].Hand.push(...drawnCard);
    } else {
        discardCard(drawnCard[0]);
    }

    nextPlayer();
}

function swapFromPile() {

    nextPlayer();
}

function swapFromDiscard() {

    nextPlayer();
}

// Spending Functions
function spendGamePot(player, amount) {
    players[player].Credits = players[player].Credits - amount;
    gamePot = gamePot + amount;

    document.getElementById('gamePot').innerText = gamePot;
}

function spendSabaccPot(player, amount) {
    players[player].Credits = players[player].Credits - amount;
    sabaccPot = sabaccPot + amount;

    document.getElementById('sabaccPot').innerText = sabaccPot;
}

function anteUp() {
    for (let p = 0; p < playerCount; p++) {
        spendGamePot(p, gameAnte);
        spendSabaccPot(p, sabaccAnte);
    }
}

// Betting Functions
function check() {
    nextPlayer();
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
    var firstDie = Math.floor((Math.random()*6) + 1);
    var secondDie = Math.floor((Math.random()*6) + 1);

    if (firstDie === secondDie) {
        alert("Spiked!");
        reDeal();
    } else {
        alert("No Spike");
    }
}

// Misc utilities
function isNegative(num) {
    if (typeof num === 'number' && Math.sign(num) === -1) {
        return true;
    }

    return false;
}