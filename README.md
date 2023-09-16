# Corellian Spike
*The world's first digital Sabacc game.*

Written in vanilla JS.

[Play online](https://joelyoder.github.io/corellian-spike/)

## MVP Progress

### Game Setup
- [x] Generating a deck of Sabacc cards
- [x] A configurable number of players are generated, delt a hand, and given starting credits
- [x] The top of the deck is discarded
- [x] Players automatically ante up

### Game Progression
- [x] Turns progress after player actions
- [x] Stages progress after players take their turns
- [x] Rounds progress at at the end of rounds
- [x] The UI is updated after state changes

### Drawing Phase
- [x] Standing
- [x] Drawing a card from the deck and chosing to keep or discard that card
- [x] Discarding from your hand and drawing from the deck
- [x] Discarding from your hand and drawing from the discard

### Betting Phase
- [x] Standing
- [x] Making a bet
- [x] Calling the bet
- [x] Raising the bet
- [x] Junking (folding)
- [ ] Going all in
    - Basic implementaion added, but does not account for side pots yet. Currently the player with the highest credits can cheese the game by always going all in.
- [x] Raise limit

### Spike Phase
- [x] Rolling the dice
- [x] Re-dealing cards to players after a spike

### Game End
- [x] Game ends after third round
- [x] Comparing hands and determining a winner
- [ ] Special win conditions (which hands beat which)
    - Also currently does not have logic to handle multiple players with the same winning score
- [x] Distributing the winnning pot(s) to the winner
- [x] Player hands are reset, but credits are not
- [x] Players without enough credits to ante are eliminated
- [x] A new game is started after the final round

## User Interface
- [x] Only show the current player's hand
- [x] Only show actions that the current player is allowed to take
- [x] User-friendly desktop layout
- [ ] User-friendly mobile layout
- [ ] Card designs that look like real Sabacc cards and show staves
    - Basic version implemented
- [x] Star Wars inspired theme (colors & fonts)

---

To launch the http server in Github Codespaces, use the command: `http-server`