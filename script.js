"use strict";

// The Pot
let gamePot = 0;
let sabaccPot = 0;

// Stacks of Cards
let deck = new Array();
let discard = new Array();

// Defaults
let startingCredits = 410;
const gameAnte = 1;
const sabaccAnte = 2;
const raiseLimit = 3;

// Players
let playerCount = 4;
let players = new Array();

// Game State
let currentRound = 1;
let currentStage = 1;
let currentPlayer = 0;
let currentBet = 0;
let currentRaise = 0;

// Set up a new game automatically on load
function load()
{
	newGame();
}

window.addEventListener('load', load);

// Allow users to start a new game and define starting vars
function setupGame() {
    playerCount = loopUntilCorrectNumber('How many people are playing?', 6);
    startingCredits = loopUntilCorrectNumber('How many credits should they start with?', 10000);

    players = new Array();

    newGame();
}

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
        players[i] = {
            Hand:new Array(),
            Credits:startingCredits,
            LastBet:0,
            HasBet:false,
            AllIn:false,
            HasJunked:false,
            IsOut:false,
            HasWon:false
        };
    }
    
    newDeal();
    anteUp();
    updateGameUI();
}

function testing(testCase) {
    for (let i = 0; i < playerCount; i++) {
        players[i].Hand = new Array();
    }

    // Score winner
    if (testCase === 1) {
        // 5
        players[0].Hand[0] = {Value: 2};
        players[0].Hand[1] = {Value: 3};
        // -4
        players[1].Hand[0] = {Value: -2};
        players[1].Hand[1] = {Value: -1};
        players[1].Hand[2] = {Value: -1};
        // 15
        players[2].Hand[0] = {Value: 10};
        players[2].Hand[1] = {Value: 5};
        // -10
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: 0};
    }

    // Handsize winner
    if (testCase === 2) {
        // 4
        players[0].Hand[0] = {Value: 2};
        players[0].Hand[1] = {Value: 2};
        // -4
        players[1].Hand[0] = {Value: -2};
        players[1].Hand[1] = {Value: -1};
        players[1].Hand[2] = {Value: -1};
        // 15
        players[2].Hand[0] = {Value: 10};
        players[2].Hand[1] = {Value: 5};
        // -10
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: 0};
    }

    // Single Positive winner
    if (testCase === 3) {
        // 4
        players[0].Hand[0] = {Value: 2};
        players[0].Hand[1] = {Value: 2};
        // -4
        players[1].Hand[0] = {Value: -3};
        players[1].Hand[1] = {Value: -1};
        // 15
        players[2].Hand[0] = {Value: 10};
        players[2].Hand[1] = {Value: 5};
        // -10
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: 0};
    }

    // Multiple positive winner
    if (testCase === 4) {
        // 4
        players[0].Hand[0] = {Value: 2};
        players[0].Hand[1] = {Value: 2};
        // -4
        players[1].Hand[0] = {Value: -2};
        players[1].Hand[1] = {Value: -2};
        // 4
        players[2].Hand[0] = {Value: 4};
        players[2].Hand[1] = {Value: 0};
        // -14
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: -4};
    }

    // Pure Sabacc
    if (testCase === "puresabacc") {
        // -8
        players[0].Hand[0] = {Value: -4};
        players[0].Hand[1] = {Value: -4};
        // 0 - Pure Sabacc
        players[1].Hand[0] = {Value: 0};
        players[1].Hand[1] = {Value: 0};
        // 0 - Sabacc
        players[2].Hand[0] = {Value: 4};
        players[2].Hand[1] = {Value: -4};
        // 0 - Sabacc with hand advantage
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: 0};
        players[3].Hand[2] = {Value: 10};
    }

    // Gee Whiz!
    if (testCase === "geewiz") {
        // 0 - Gee Whiz version 1
        players[0].Hand[0] = {Value: 1};
        players[0].Hand[1] = {Value: 2};
        players[0].Hand[2] = {Value: 3};
        players[0].Hand[3] = {Value: 4};
        players[0].Hand[4] = {Value: -10};
        // 0 - Gee Whiz version 2
        players[1].Hand[0] = {Value: -1};
        players[1].Hand[1] = {Value: -2};
        players[1].Hand[2] = {Value: -3};
        players[1].Hand[3] = {Value: -4};
        players[1].Hand[4] = {Value: 10};
        // 4
        players[2].Hand[0] = {Value: 4};
        players[2].Hand[1] = {Value: 0};
        // -14
        players[3].Hand[0] = {Value: -10};
        players[3].Hand[1] = {Value: -4};
    }
}

function getWinner() {
    // Set up a new array that will be used to filter down through the win conditions
    let contenders = new Array();

    // Assign valid players to the contenders list and populate their values
    for (let i = 0; i < playerCount; i++) {
        // Cannot be out, junked, or have already won a pot (i.e. an all in player has won the game pot)
        if (players[i].HasJunked === false && players[i].IsOut === false && players[i].HasWon === false) {

            let playerScore = 0;
            let playerHand = [];

            // Calculate their final score by adding up their hand
            for (let x = 0; x < players[i].Hand.length; x++) {
                let temp = players[i].Hand[x].Value;
                playerScore += parseFloat(temp);
            }

            // Staves do not matter, so move the values into an array
            for (let x = 0; x < players[i].Hand.length; x++) {
                let temp = players[i].Hand[x].Value;
                playerHand.push(temp);
            }

            // Sort the player hands to make them easier to compare against
            playerHand.sort((a, b) => a - b);

            // Store all of the relevant data needed to calculate the win conditions
            let playerData = {
                PlayerID: i,
                FinalScore: playerScore,
                AbsScore: Math.abs(playerScore),
                HandSize: players[i].Hand.length,
                Hand: playerHand,
                HandRank: 0
            }

            contenders.push(playerData);
        }
    }

    // If there are multiple players in the running to win, assign ranks to their hands. Otherwise, congrats on the bluff!
    if (contenders.length > 1) {
        rankHands();
    } else {
        return contenders[0];
    }

    // Compare all of the hands to determine the best rank
    // Check to make sure there are no ties before assigning a winner
    // If none of the players have a high enough rank, run resolveTies()

    function rankHands() {
        for (let i = 0; i < contenders.length; i++) {
            switch (contenders[i].Hand.join()) {
                // Pure Sabacc
                // Both sylops and no other cards, totaling zero
                case "0,0":
                    contenders[i].HandRank = 1;
                    break;
                // Full Sabacc
                // A sylop and four tens (two positive, two negative) totaling zero
                case "-10,-10,0,10,10":
                    contenders[i].HandRank = 2;
                    break;
                // Fleet
                // A sylop and four of a kind that aren’t tens (two positive, two negative) totaling zero
                case "tbd":
                    contenders[i].HandRank = 3;
                    break;
                // Prime Sabacc
                // A sylop and a pair of tens (one positive, one negative) totaling zero
                case "-10,0,10":
                    contenders[i].HandRank = 4;
                    break;
                // Yee-haa
                // A sylop and a pair that aren’t tens (one positive, one negative) totaling zero
                case "tbd":
                    contenders[i].HandRank = 5;
                    break;
                // Rhylet
                // Positive three of a kind and a negative pair (or vice versa) totaling zero
                case "tbd":
                    contenders[i].HandRank = 6;
                    break;
                // Squadron
                // Four of a kind (two positive, two negative) totaling zero
                case "tbd":
                    contenders[i].HandRank = 7;
                    break;
                // Gee Whiz!
                case "-4,-3,-2,-1,10":
                    contenders[i].HandRank = 8;
                    break;
                case "-10,1,2,3,4":
                    contenders[i].HandRank = 8;
                    break;
                // Straight Khyron
                // A sequential run of four cards, totaling zero.
                case "tbd":
                    contenders[i].HandRank = 9;
                    break;
                // Banthas Wild
                // Three of a kind (plus one or two other cards) totaling zero
                case "tbd":
                    contenders[i].HandRank = 10;
                    break;
                // Rule of Two
                // Two pairs with a total hand value of zero (may or may not contain a fifth card)
                case "tbd":
                    contenders[i].HandRank = 11;
                    break;
                // Sabacc or Nulrhek - if no player ranks higher than this, resolveTies will decide the winner
                default:
                    contenders[i].HandRank = 12;
                    break;
            }
        }
    }

    function resolveTies() {
        // The lowest score wins
        let lowest = 0;

        // Find the lowest absolute score
        for (let i = 1; i < contenders.length; i++) {
            if (contenders[i].AbsScore < contenders[lowest].AbsScore) lowest = i;
        }

        let lowestScore = contenders[lowest].AbsScore;

        // Remove any contenders with a higher absolute score
        for (let i = 0; i < contenders.length; i++) {
            if (contenders[i].AbsScore > lowestScore) {
                contenders.splice(i, 1);
                i--;
            }
        }

        // A positive score beats a negative one
        let positive = 0;

        // If a number is positive, it will become the positive check - otherwise this will be a negative number if all are
        for (let i = 1; i < contenders.length; i++) {
            if (contenders[i].FinalScore > contenders[positive].FinalScore) positive = i;
        }

        let mostPositive = contenders[positive].FinalScore;

        // Remove any contenders with less positivity than the control
        for (let i = 0; i < contenders.length; i++) {
            if (contenders[i].FinalScore < mostPositive) {
                contenders.splice(i, 1);
                i--;
            } 
        }

        // The largest hand wins
        let largest = 0;

        // Find the largest hand size
        for (let i = 1; i < contenders.length; i++) {
            if (contenders[i].HandSize > contenders[largest].HandSize) largest = i;
        }

        let largestHand = contenders[largest].HandSize;

        // Remove any contenders with a lower hand size
        for (let i = 0; i < contenders.length; i++) {
            if (contenders[i].HandSize < largestHand) {
                contenders.splice(i, 1);
                i--;
            }  
        }

        // TODO:Highest total value of all positive cards

        // TODO:Highest single positive card value
    }

    // If all else fails, the rules say that a blind draw should be the tiebreaker.

    //return contenders[0];
    return contenders;
}

function endGame() {
    let winner = getWinner();

    alert(`Game over! The winner is Player ${winner.PlayerID + 1}!`);

    // Assign winnings to the winning player
    players[winner.PlayerID].Credits += gamePot;

    // If a player gets Sabacc, reset give them the winnings and reset the sabacc pot
    if (winner.FinalScore === 0) {
        players[winner.PlayerID].Credits += sabaccPot;
        sabaccPot = 0;
    }

    // Reset everything that always should be reset
    gamePot = 0;
    currentPlayer = 0;
    currentRound = 1;
    currentStage = 1;
    currentBet = 0;

    // Empty the player hands and remove uneeded flags
    for (let i = 0; i < playerCount; i++) {
        players[i].Hand = new Array();
        players[i].AllIn = false;
        players[i].HasJunked = false;

        // If a player doesn't have enough credits to ante, they are OUT
        if (players[i].Credits < 3) {
            players[i].IsOut = true;
        }
    }

    newDeal();
    anteUp();
    skipJunkedPlayers();
    updateGameUI();
}

function updateGameUI() {
    // Money
    document.getElementById('gamePot').innerText = gamePot;
    document.getElementById('sabaccPot').innerText = sabaccPot;

    renderPlayerTracker();

    // Game State
    document.getElementById('currentRound').innerText = currentRound;
    document.getElementById('currentRound').innerText = currentRound;

    switch (currentStage) {
        case 1:
            document.getElementById('currentStage').innerText = 'Drawing';
            break;
        case 2:
            document.getElementById('currentStage').innerText = 'Betting';
            break;
        case 3:
            document.getElementById('currentStage').innerText = 'Spike';
            
            break;
        default:
            // If you see this, something has gone wrong
            document.getElementById('currentStage').innerText = 'Error';
    }

    renderHand();

    // Determine visibility of drawing and betting controls
    if(currentStage === 1) {
        document.getElementById("drawing").style.display = "initial";
        document.getElementById("betting").style.display = "none";
        document.getElementsByClassName("current-bet")[0].style.display = "none";
    } else if(currentStage === 2) {
        document.getElementById("betting").style.display = "initial";
        document.getElementById("drawing").style.display = "none";

        document.getElementById("call").innerHTML = `Call <span class="neg"><span class="credit">$</span>${currentBet - players[currentPlayer].LastBet}</span>`;
        document.getElementById("allIn").innerHTML = `ALL IN <span class="neg"><span class="credit">$</span>${players[currentPlayer].Credits}</span>`;

        // Show the current bet
        document.getElementsByClassName("current-bet")[0].style.display = "flex";
        document.getElementById('currentBet').innerText = currentBet;

        // Ensure all of the buttons are visible by default
        document.getElementById("check").style.display = "initial";
        document.getElementById("bet").style.display = "initial";
        document.getElementById("call").style.display = "initial";
        document.getElementById("raise").style.display = "initial";
        document.getElementById("junk").style.display = "initial";
        document.getElementById("allIn").style.display = "initial";

        // If no bet has been made, hide the call, raise and junk options
        if (currentBet === 0 ) {
            document.getElementById("call").style.display = "none";
            document.getElementById("raise").style.display = "none";
            document.getElementById("junk").style.display = "none";
        }

        // If a bet has already been made, hide the check and bet buttons
        if (currentBet > 0) {
            document.getElementById("check").style.display = "none";
            document.getElementById("bet").style.display = "none";
        }

        // If the player is too poor to make a bet or must go all in, hide call and raise
        if (currentBet >= players[currentPlayer].Credits) {
            document.getElementById("call").style.display = "none";
            document.getElementById("raise").style.display = "none";
        }

        // If the player is too poor to make any bets, ensure the bet and all in buttons are hidden
        if (players[currentPlayer].Credits === 0 || currentBet > players[currentPlayer].Credits) {
            document.getElementById("bet").style.display = "none";
            document.getElementById("allIn").style.display = "none";
        }

        // Hide the raise button if you've hit the limit
        if (currentRaise === raiseLimit) {
            document.getElementById("raise").style.display = "none";
        }

    } else if(currentStage === 3) {
        document.getElementById("drawing").style.display = "none";
        document.getElementById("betting").style.display = "none";
        document.getElementsByClassName("current-bet")[0].style.display = "none";
    }
}

function renderPlayerTracker() {
    // Reset the html
    document.getElementById('playerTracker').innerHTML = '';

    // Set up the credit tracker UI
    for (let i = 0; i < playerCount; i++) {
        let playerCard = document.createElement('div');
        playerCard.className = "playercard";

        let playerName = document.createElement('div');
        playerName.className = "name";
        playerName.innerText = `Player ${i + 1}`;

        let playerCredits = document.createElement('div');
        playerCredits.className = "credits";
        playerCredits.innerHTML = '<span class="credit">$</span>' + players[i].Credits;

        if (players[i].HasJunked === true || players[i].IsOut === true) {
            playerCard.className = "playercard out";
        }

        if (currentPlayer === i) {
            playerCard.className = "playercard active";
        }

        playerCard.appendChild(playerName);
        playerCard.appendChild(playerCredits);
		document.getElementById('playerTracker').appendChild(playerCard);
    }
}

function renderHand() {
    // Reset the hands
    document.getElementById('hand').innerHTML = '';
    document.getElementById('hand').style.display = 'none';
    document.getElementById('showhand').style.display = 'inline-block';

    let container = document.createElement('div');
    container.className = `container`;

    let handValues = new Array();

    for (let x = 0; x < players[currentPlayer].Hand.length; x++) {
        let cardType;

        if (players[currentPlayer].Hand[x].Value > 0) {
            cardType = "pos";
        } else if (isNegative(players[currentPlayer].Hand[x].Value)) {
            cardType = "neg";
        } else {
            cardType = "";
        }

        let card = document.createElement('div');
        let value = document.createElement('div');
        card.className = "card " + players[currentPlayer].Hand[x].Stave + " " + cardType;
        value.className = "value";

        let cardValue;
        if (players[currentPlayer].Hand[x].Value === 0) {
            cardValue = `🟈`;
        } else {
            cardValue = players[currentPlayer].Hand[x].Value;
        }
        

        value.innerText = cardValue;
        card.appendChild(value);
        container.appendChild(card);

        handValues.push(players[currentPlayer].Hand[x].Value);
    }

    let handTotal = document.createElement('div');
    handTotal.innerHTML = `Hand total: <strong>${handValues.reduce((a, b) => a + b, 0)}</strong>`;
    handTotal.className = "handtotal";

    document.getElementById('hand').appendChild(container);
    document.getElementById('hand').appendChild(handTotal);
}

// Turn Taking
function nextPlayer() {
    // Move our player tracker to the next player
    currentPlayer++;

    skipJunkedPlayers();

    // Skip junked and out players
    while ((currentPlayer != playerCount) && (players[currentPlayer].HasJunked === true || players[currentPlayer].IsOut === true)) {
        currentPlayer++;
    }

    // If the tracker goes past the current number of players, but the first player still needs to call the betting goes back around
    if ((currentPlayer === playerCount) && (players[0].LastBet < currentBet)) {
        currentPlayer = 0;
        skipJunkedPlayers();
    }

    // Otherwise if the tracker goes past the current number of players, move the stage tracker forward and reset the player tracker
    else if (currentPlayer === playerCount) {
        resetBetting();

        currentPlayer = 0;
        skipJunkedPlayers();

        currentStage++;
    }

    // Finally if the player has already bet once and they don't need to increase their bet to stay in, move to the next round
    else if ((players[currentPlayer].HasBet === true) && (players[currentPlayer].LastBet === currentBet)) {
        resetBetting();

        currentPlayer = 0;
        skipJunkedPlayers();

        currentStage++;
    }

    // At the end of the final stage, roll the spike and move to the next round
    if (currentStage === 3) {
        updateGameUI();

        rollSpike();

        currentPlayer = 0;
        skipJunkedPlayers();

        currentStage = 1;
        currentRound++;
    }

    // Update the game UI to refelect these state changes
    updateGameUI();

    // After the third round, end the game
    if (currentRound === 4) {
        endGame();
    }
}

function skipJunkedPlayers() {
    // If a player has junked or is out, skip em
    while ((currentPlayer != playerCount) && (players[currentPlayer].HasJunked === true || players[currentPlayer].IsOut === true)) {
        currentPlayer++;
    }

    // If there is only one player left, end the game early
    let activePlayerCount = 0;

    for (let i = 0; i < playerCount; i++) {
        if (players[i].HasJunked === false && players[i].IsOut === false) {
            activePlayerCount++;
        }
    }

    if (activePlayerCount < 2) {
        endGame();
    }
}

function resetBetting() {
    // Reset betting tracking for all players
    for (let i = 0; i < playerCount; i++) {
        players[i].LastBet = 0;
        players[i].HasBet = false;
    }

    // Reset the current bet counter
    currentBet = 0;
}


// The Card Deck
const staves = ['circles', 'triangles', 'squares'];
const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10];
const sylopNumber = 2;

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

    // Add in our two sylop cards
    for (let s = 0; s < sylopNumber; s++) {
        let card = {Value: 0, Stave: 'sylop'};
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
    for (let i = 0; i < playerCount; i++) {
        // Don't deal cards to players that are out of the game
        if (players[i].HasJunked === false && players[i].IsOut === false) {
            players[i].Hand.push(...dealCards(2));
        }
    }

    // Discard the top card of the deck
    discardCard(deck.pop());
}

function reDeal() {
    let handSizes = new Array();

    // Pull the current number of cards from each player
    for (let x = 0; x < playerCount; x++) {

        // Pull the number of cards that are in their hand
        let handSize = players[x].Hand.length;

        // Store that in our array
        handSizes.push(handSize);

        // Discard the player hand
        for (let i = 0; i < handSize; i++) {
            let tempCard = players[x].Hand.pop();
            discardCard(tempCard);
        }
    }

    for (let i = 0; i < playerCount; i++) {
        // Pull their number of cards out of our array
        let newHand = handSizes.shift();

        // Deal them the same number of cards from the fresh desk
        players[i].Hand.push(...dealCards(newHand));
    }
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
    // Spend 1 credit
    spendGamePot(currentPlayer, 1);

    // Take a chosen card from their hand and discard it
    discardCard(...pullFromHand());

    // Add a new card to the player's hand
    players[currentPlayer].Hand.push(...dealCards(1));

    // Let the player know what card they picked up, since their hand is about to disappear
    let latestCard = players[currentPlayer].Hand.length - 1;
    alert(`You pick up a ${players[currentPlayer].Hand[latestCard].Value}`);

    nextPlayer();
}

function swapFromDiscard() {
    // Spend 2 credits
    spendGamePot(currentPlayer, 2);

    // Yoink the top card in the discard pile
    let pickedUpCard = discard.pop();

    // Take a chosen card from their hand and discard it
    discardCard(...pullFromHand());

    // Add the picked up card to the player's hand
    players[currentPlayer].Hand.push(pickedUpCard);

    nextPlayer();
}

function pullFromHand() {
    // Prompt until they give a valid number
    let cardNumber = loopUntilCorrectNumber(`Discard a card from your hand. Choose a number between 1-${players[currentPlayer].Hand.length} based on hand order.`, players[currentPlayer].Hand.length);

    // Decrease the number to match the array keys
    cardNumber--;

    //Yoink the card out of their hand
    let chosenCard = players[currentPlayer].Hand.splice(cardNumber, 1);

    // Return the card
    return chosenCard;
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
    for (let i = 0; i < playerCount; i++) {
        if (players[i].IsOut === false) {
            spendGamePot(i, gameAnte);
            spendSabaccPot(i, sabaccAnte);
        }
    }
}

// Betting Functions
function check() {
    nextPlayer();
}

function bet(amount) {
    if (amount === 0) {
    // Get their bet
    amount = loopUntilCorrectNumber(`How many credits would you like to bet? Your current balance: ${players[currentPlayer].Credits}`, players[currentPlayer].Credits);
    }

    // If they put in everything they have, ensure they're considered all in
    if (amount === players[currentPlayer].Credits) {
        allIn();
    } else {
        // Update the current bet
        currentBet = amount;

        // Bye bye money!
        spendGamePot(currentPlayer, currentBet);

        trackBet();
        nextPlayer();
    }
}

function call() {
    // Up your bet to match the current bet
    spendGamePot(currentPlayer, (currentBet - players[currentPlayer].LastBet));

    trackBet();
    nextPlayer();
}

function raise() {
    // Get their bet
    let raiseAmount = loopUntilCorrectNumber(`How many credits would you like to bet? Your current balance: ${players[currentPlayer].Credits}`, players[currentPlayer].Credits);

    // Update the current bet
    currentBet += raiseAmount;

    // Bet the raised amount, but don't add in the current bet if you already put that money in the pot this round
    spendGamePot(currentPlayer, (currentBet - players[currentPlayer].LastBet));

    // Iterate the raise counter
    currentRaise++;

    trackBet();
    nextPlayer();
}

function junk() {
    players[currentPlayer].HasJunked = true;

    // Discard the player hand
    for (let i = 0; i <= players[currentPlayer].Hand.length; i++) {
        let tempCard = players[currentPlayer].Hand.pop();
        discardCard(tempCard);
    }

    nextPlayer();
}

function allIn() {
    // Record their bet
    players[currentPlayer].LastBet = players[currentPlayer].Credits;

    // Update the current bet
    currentBet = players[currentPlayer].Credits;

    // Bet all the things!
    spendGamePot(currentPlayer, players[currentPlayer].Credits);

    // Toggle the All In flag to end betting for the game
    players[currentPlayer].AllIn = true;

    trackBet();
    nextPlayer();
}

function trackBet() {
    // Keep track of how much you've bet this round
    players[currentPlayer].LastBet = currentBet;

    // Mark that you have made a bet this round
    players[currentPlayer].HasBet = true;
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

function showHide(id, display){
    let e = document.getElementById(id);

    if ( e.style.display !== 'none' ) {
        e.style.display = 'none';
    } else {
        e.style.display = display;
    }
}

function loopUntilCorrectNumber(promptQuestion, maxValue) {
    let retval;
    while (true) {
      retval = (prompt(promptQuestion));
      
      if (!isNaN(retval) && retval > 0 && retval <= maxValue) {
        return parseInt(retval);
      }
        
      alert("Please enter a valid number");
    }
}

function getAllIndexes(arr, val) {
    let indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}