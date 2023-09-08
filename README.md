# Corellian Spike
 *Sabacc for the bold!*

## What Works

### Game Setup
- Generating a deck of Sabacc cards
- A configurable number of players are generated, delt a hand, and given starting credits
- The top of the deck is discarded
- Players automatically ante up

### Game Progression
- Turns progress after player actions
- Stages progress after players take their turns
- Rounds progress at at the end of rounds
- The UI is updated after state changes

### Drawing Phase
- Standing
- Drawing a card from the deck, paying 1 credit, and chosing to keep or discard that card

### Spike Phase
- Rolling the dice
- Re-dealing cards to players after a spike

### Betting Phase
- Standing

### Game End
- A new game is started after the final round
- Player hands are reset, but credits are not

## What Does Not Work

### Drawing Phase
- Discarding from your hand and drawing from the deck
- Discarding from your hand and drawing from the discard

### Betting phase
- Making a bet
- Calling the bet
- Raising the bet
- Junking (folding)
- Going all in

### Game End
- Comparing hands and determining a winner
- Special win conditions (which hands beat which)