/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
const DECK_TEMPLATE = [];
const READER = require('readline-sync');

// template generator. Populates array passed in with cards.
function populateTemplate(arrToPopulate) {
  const SPECIAL_FACES = ['King', 'Queen', 'Prince'];
  const SUIT_FACES = ['Heart', 'Club', 'Diamond', 'Spades'];

  for (let numbereds = 2; numbereds <= 10; numbereds += 1) {
    for (let suits = 0; suits <= 3; suits += 1) {
      arrToPopulate.push({ suit: SUIT_FACES[suits], face: numbereds });
    }
  }

  for (let specials = 0; specials < 3; specials += 1) {
    for (let suits = 0; suits <= 3; suits += 1) {
      arrToPopulate.push({ suit: SUIT_FACES[suits], face: SPECIAL_FACES[specials] });
    }
  }

  SUIT_FACES.forEach((currentSuit) => {
    arrToPopulate.push({ suit: currentSuit, face: 'Ace' });
  });
}

// Deck Template is populated. Not Shuffled
populateTemplate(DECK_TEMPLATE);

// Deck shuffler. Does not mutate. Returns a new array
function shuffleArray(populatedDeck) {
  const DEEP_COPY_ARR_STRING = JSON.stringify(populatedDeck);
  const DEEP_COPY_ARR = JSON.parse(DEEP_COPY_ARR_STRING);

  for (let i = DEEP_COPY_ARR.length - 1; i > 0; i -= 1) {
    const J = Math.floor(Math.random() * (i + 1));
    const TEMP = DEEP_COPY_ARR[i];
    DEEP_COPY_ARR[i] = DEEP_COPY_ARR[J];
    DEEP_COPY_ARR[J] = TEMP;
  }

  return DEEP_COPY_ARR;
}

// Use to log information to console. Player's deck
function displayDeck(deck) {
  let message = `${deck[0].face} of ${deck[0].suit} and ${deck[1].face} of ${deck[1].suit}`;
  if (deck.length > 2) {
    for (let extraCard = 2; extraCard < deck.length; extraCard += 1) {
      message += `, ${deck[extraCard].face} of ${deck[extraCard].suit}`;
    }
  }

  return message;
}

// Use to log information to console. Dealer's first card and amount of other cards they have
function displayDealerFirstDeckAndLength(deck) {
  const MESSAGE = `First card of the dealer is ${deck[0].face} of ${deck[0].suit} of ${deck.length - 1} other cards.`;
  return MESSAGE;
}

// Use to log information to console. Both parties decks
function displayBothResults(playerDeck, dealerDeck, playerDeckValue, dealerDeckValue) {
  return `You had deck of ${displayDeck(playerDeck)} with total value of ${playerDeckValue}\nDealer had deck of ${displayDeck(dealerDeck)} with total value of ${dealerDeckValue}`;
}

// Returns deck with 2 cards and card numbers used to pick those 2 cards.
function roundStart(shuffledDeck, currentCardCount) {
  const partyDeck = [];
  partyDeck.push(shuffledDeck[currentCardCount]);
  partyDeck.push(shuffledDeck[currentCardCount + 1]);

  return [partyDeck, currentCardCount + 2];
}

function evaluateDeck(deck) {
  let sumOfDeck = 0;
  deck.forEach((card) => {
    if (card.face === 'Ace') {
      if (sumOfDeck <= 10) {
        sumOfDeck += 11;
      } else {
        sumOfDeck += 1;
      }
    } else if (['King', 'Queen', 'Prince'].includes(card.face)) {
      sumOfDeck += 10;
    } else {
      sumOfDeck += card.face;
    }
  });
  return sumOfDeck;
}

function playerPrompter(shuffledDeck, playerDeck, currentCardCount) {
  while (true) {
    console.log('\x1b[34m%s\x1b[0m', 'What would you like to do? HIT OR STAY: ');
    const USER_INPUT = READER.prompt().trim().toUpperCase();
    if (USER_INPUT === 'HIT' && shuffledDeck.length > currentCardCount) {
      playerDeck.push(shuffledDeck[currentCardCount]);
      return [false, currentCardCount + 1];
    }
    if (USER_INPUT === 'STAY') {
      return [true, currentCardCount];
    }
    console.log('Invalid Input');
  }
}

function dealerPrompter(shuffledDeck, dealerDeck, currentCardCount) {
  if (evaluateDeck(dealerDeck) >= 17 || shuffledDeck.length <= currentCardCount) {
    return [true, currentCardCount];
  }

  dealerDeck.push(shuffledDeck[currentCardCount]);
  return [false, currentCardCount + 1];
}

// Part 2: Initialization of rules before game start
// This statement generates array of cards that are shuffled
const SHUFFLED_DECK = shuffleArray(DECK_TEMPLATE);

// Tricky variable but meant to keep track of new cards to pick from shuffled deck
let cardToPick = 0;

// 2 variables meant to keep track of scores for each parties (Player and Dealer)
let [playerScore, dealerScore] = [0, 0];

// Part 3: Game start
// Main game loop. Game ends when there are 4 or less cards
while (cardToPick <= 48) {
  // Displays scores of both parties
  console.log('\x1b[36m%s\x1b[0m', `Player: ${playerScore}, Dealer: ${dealerScore}`);

  // Initialization of riles for each round
  // Start player deck with 2 cards
  let playerDeck;
  [playerDeck, cardToPick] = roundStart(SHUFFLED_DECK, cardToPick);

  // Start dealerDeck with 2 cards
  let dealerDeck;
  [dealerDeck, cardToPick] = roundStart(SHUFFLED_DECK, cardToPick);

  // Variables meant to keep track if a party has decided to stay or not
  let [playerStayed, dealerStayed] = [false, false];

  let [playerValue, dealerValue] = [evaluateDeck(playerDeck), evaluateDeck(dealerDeck)];

  // Part 4: Round start
  // This is a round loop. Ending of this loop means that a round has concluded
  while (true) {
    // This is a action of the player
    // Should a player take action is dependent on playerStayed
    // If stayed then player should stay frozen until end of the round
    if (!playerStayed) {
      console.log(`You have ${displayDeck(playerDeck)}. Your value is ${playerValue}`);
      console.log(displayDealerFirstDeckAndLength(dealerDeck));

      // Function to prompt user what action they would like to take. Takes input from user
      // Returns new deck and boolean for if user stayed or not
      [playerStayed, cardToPick] = playerPrompter(SHUFFLED_DECK, playerDeck, cardToPick);

      // To clear up clutter for user
      console.log();

      // For user information aswell
      if (playerStayed) {
        console.log('...you stayed');
      } else {
        console.log(`...you hit and drew ${playerDeck[playerDeck.length - 1].face} of ${playerDeck[playerDeck.length - 1].suit}`);
      }

      // Function that will update the overall deck value
      playerValue = evaluateDeck(playerDeck);

      // If value of dealer deck exceeds 21, the round concludes instantly
      if (playerValue > 21) {
        // Player busted
        // For user information again
        console.log('\x1b[31m%s\x1b[0m', '=> You Lost');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));
        dealerScore += 1;
        break;
      }
    }

    // This is a action of the dealer
    // Should a dealer take action is also dependent on dealerStayed
    // If stayed then dealer should stay frozen until end of the round
    if (!dealerStayed) {
      // Function for computer to decide what action they should take
      // Doesn't take input. Always returns true if deck value is above 17
      [dealerStayed, cardToPick] = dealerPrompter(SHUFFLED_DECK, dealerDeck, cardToPick);

      // Actions of dealer for user information
      if (dealerStayed) {
        console.log('...dealer stayed');
      } else {
        console.log('...dealer hit and drew a card');
      }

      // Function that will update the overall deck value
      dealerValue = evaluateDeck(dealerDeck);

      // If value of dealer exceeds, the round concludes instantly
      if (dealerValue > 21) {
        // Dealer busted
        // For user information
        console.log('\x1b[32m%s\x1b[0m', '=> You Won');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));

        // Increments score of player since dealer busted
        playerScore += 1;
        break;
      }
    }

    // Once both parties have stayed, evaluate who is the winner and end round
    if (playerStayed && dealerStayed) {
      if (dealerValue > playerValue) {
        // Dealers deck value is bigger. For user information
        console.log('\x1b[31m%s\x1b[0m', '=> You Lost');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));

        dealerScore += 1;
      } else if (playerValue > dealerValue) {
        // PLayers deck value is bigger. For user information
        console.log('\x1b[32m%s\x1b[0m', '=> You Won');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));

        playerScore += 1;
      } else {
        // Reached a draw. Or very bad error. For user information
        console.log('\x1b[33m%s\x1b[0m', '=> Draw');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));
      }

      // conclude round
      break;
    }
  }

  console.log();
  console.log('-------------------------');
  console.log();
}
