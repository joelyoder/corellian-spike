# Corellian Spike
*The world's first* digital Sabacc game.*

Written in vanilla JS.

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
- [ ] Comparing hands and determining a winner
- [ ] Distributing the winnning pot(s) to the winner
- [ ] Special win conditions (which hands beat which)
- [x] Player hands are reset, but credits are not
- [x] Players without enough credits to ante are eliminated
- [x] A new game is started after the final round

*as far as I can tell from Google searches...

---

To launch the http server in Github Codespaces, use the command: `http-server`