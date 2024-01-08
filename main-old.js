const DECK_TEMPLATE = [];
const READER = require("readline-sync");

// template generator. NOT SHUFFLED. MUTATES
function populateTemplate(arr) {
  const specialFaces = ["King", "Queen", "Prince"];
  const suitFaces = ["Heart", "Club", "Diamond", "Spades"];

  for (let numbereds = 2; numbereds <= 10; numbereds++) {
    for (let suits = 0; suits < 4; suits++) {
      arr.push({ suit: suitFaces[suits], face: numbereds });
      arr.push({ suit: suitFaces[suits], face: numbereds });
      arr.push({ suit: suitFaces[suits], face: numbereds });
      arr.push({ suit: suitFaces[suits], face: numbereds });
    }
  }

  for (let specials = 0; specials < 3; specials++) {
    for (let suits = 0; suits < 4; suits++) {
      arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
      arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
      arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
      arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
    }
  }

  suitFaces.forEach((currentSuit) => {
    arr.push({ suit: currentSuit, face: "Ace" });
  });
}

// Standard deck of cards not shuffled.
populateTemplate(DECK_TEMPLATE);

// Deck shuffler. non-MUTATES. returns shuffled deck.
function shuffleArray(arr) {
  const deepCopyArrString = JSON.stringify(arr);
  const deepCopyArr = JSON.parse(deepCopyArrString);

  for (let i = deepCopyArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deepCopyArr[i];
    deepCopyArr[i] = deepCopyArr[j];
    deepCopyArr[j] = temp;
  }

  return deepCopyArr;
}

// Just to display information to user. Player's deck
function displayDeck(deck) {
  let message = `${deck[0].face} of ${deck[0].suit} and ${deck[1].face} of ${deck[1].suit}`;
  if (deck.length > 2) {
    for (let extraCard = 2; extraCard < deck.length; extraCard++) {
      message += `, ${deck[extraCard].face} of ${deck[extraCard].suit}`;
    }
  }

  return message;
}

// Just to display information to user. Dealer's first card and amount of other cards they have.
function displayDealerFirstDeckAndLength(deck) {
  const MESSAGE = `First card of the dealer is ${deck[0].face} of ${
    deck[0].suit
  } of ${deck.length - 1} other cards.`;
  return MESSAGE;
}

// Just to display information to user. Both parties decks
function displayBothResults(playerDeck, dealerDeck, playerScore, dealerScore) {
  return `You had deck of ${displayDeck(
    playerDeck,
  )} with total value of ${playerScore}\nDealer had deck of ${displayDeck(
    dealerDeck,
  )} with total value of ${dealerScore}`;
}

// Mutates decks passed in. Increments global variable by 4
const roundStart = function (playerDeck, dealerDeck) {
  playerDeck.push(shuffledDeck[cardToPick]);
  playerDeck.push(shuffledDeck[cardToPick + 1]);
  dealerDeck.push(shuffledDeck[cardToPick + 2]);
  dealerDeck.push(shuffledDeck[cardToPick + 3]);
  cardToPick += 4;
};

// returns a boolean and mutates argument and incements global variable
const userPrompter = function (playerDeck) {
  while (true) {
    console.log(
      "\x1b[34m%s\x1b[0m",
      "What would you like to do? HIT OR STAY: ",
    );
    const userInput = READER.prompt().trim().toUpperCase();
    if (userInput === "HIT" && shuffledDeck.length > cardToPick) {
      playerDeck.push(shuffledDeck[cardToPick]);
      cardToPick++;
      return false;
    } else if (userInput === "STAY") {
      return true;
    } else {
      console.log("Invalid Input");
    }
  }
};

// returns a boolean and mutates argument and increments global variable
const computerPrompter = function (dealerDeck) {
  if (evaluateDeck(dealerDeck) >= 17 || shuffledDeck.length <= cardToPick) {
    return true;
  }

  dealerDeck.push(shuffledDeck[cardToPick]);
  cardToPick++;
  return false;
};

// Doesn't mutate, returns sum of value deck passed in
const evaluateDeck = function (deck) {
  let sumOfDeck = 0;
  deck.forEach((card) => {
    if (card.face === "Ace") {
      if (sumOfDeck <= 10) {
        sumOfDeck += 11;
      } else {
        sumOfDeck += 1;
      }
    } else if (["King", "Queen", "Prince"].includes(card.face)) {
      sumOfDeck += 10;
    } else {
      sumOfDeck += card.face;
    }
  });
  return sumOfDeck;
};

// Part 2: initialization of rules before game start
// This statement generates an array of cards which are objects and shuffles them.
const shuffledDeck = shuffleArray(DECK_TEMPLATE);

// Tricky variable but meant to keep track of new cards to pick from shuffledDeck.
let cardToPick = 0;

// 2 variables meant to keep track of scores for each parties (Player and Dealer).
let [playerScore, dealerScore] = [0, 0];

// Part 3: Game start
// Main game loop. Game ends when there are 4 or less cards.
while (cardToPick <= 48) {
  // Displays scores of both parties.
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Player: ${playerScore}, Dealer: ${dealerScore}`,
  );

  // Initialization of rules for each round.
  // Cards that a player holds is held in an array. This variable is reset to empty every round.
  const [playerDeck, dealerDeck] = [[], []];
  // Variables meant to keep track if a party has decided to stay or not.
  let [playerStayed, dealerStayed] = [false, false];
  // Variables meant to keep track of value of deck (cards) each party holds (Player and dealer).
  let [playerValue, dealerValue] = [0, 0];

  // Adds 2 cards to deck of both parties. Mutates and increments cardToPick by 4.
  roundStart(playerDeck, dealerDeck);

  // Evaluate value of deck of party used in argument and store the value in an array.
  playerValue = evaluateDeck(playerDeck);
  // Same as above.
  dealerValue = evaluateDeck(dealerDeck);

  // Part 4: Round start
  // This is a round loop. Ending of this loop means that a round has concluded.
  while (true) {
    // This is a action of the player.
    // Should a player take action is dependant on playerStayed.
    // If stayed then player should stay frozen until end of the round.
    if (!playerStayed) {
      // For user information.
      console.log(
        `You have ${displayDeck(playerDeck)}. Your value is ${playerValue}`,
      );
      console.log(displayDealerFirstDeckAndLength(dealerDeck));

      // Function to prompt user what action they would like to take. Takes input from user,
      // Mutates deck passed in, increments cardToPick and returns true or false.
      playerStayed = userPrompter(playerDeck);

      // To clear up clutter for user.
      console.log();

      // For user information aswell.
      if (playerStayed) {
        console.log("...You stayed");
      } else {
        console.log(
          `...You hit and drew ${playerDeck[playerDeck.length - 1].face} of ${
            playerDeck[playerDeck.length - 1].suit
          }`,
        );
      }

      // Function that will update the overall deck value.
      playerValue = evaluateDeck(playerDeck);

      // If value of player deck exceeds 21. The round concludes instantly (break).
      if (playerValue > 21) {
        // Player busted.
        // For user information again.
        console.log("\x1b[31m%s\x1b[0m", "=> You Lost");
        console.log(
          displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue),
        );
        // Increments score of dealer since player busted.
        dealerScore++;
        break;
      }
    }

    // This is a action of the dealer.
    // Dealer also mimics some of the actions of a player and rules set on them exactly.
    if (!dealerStayed) {
      // Function for computer to decide what action they should take.
      // Mimics userPrompter but doesn't take input from user.
      dealerStayed = computerPrompter(dealerDeck);

      // Actions of dealer for user information.
      if (dealerStayed) {
        console.log("...Dealer stayed");
      } else {
        console.log("...Dealer hit and drew a card");
      }

      // Function that will update the overall deck value.
      dealerValue = evaluateDeck(dealerDeck);

      // If value of dealer deck exceeds 21. The round concludes instantly (break).
      if (dealerValue > 21) {
        // Dealer busted.
        // For user information.
        console.log("\x1b[32m%s\x1b[0m", "=> You Won");
        console.log(
          displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue),
        );
        // Increments score of player since dealer busted.
        playerScore++;
        break;
      }
    }

    // Once both parties have stayed,
    // this is evaluate who is the winner depending on their deck values.
    if (playerStayed && dealerStayed) {
      if (dealerValue > playerValue) {
        // Dealers deck is bigger. For user information.
        console.log("\x1b[31m%s\x1b[0m", "=> You Lost");
        console.log(
          displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue),
        );

        dealerScore++;
      } else if (playerValue > dealerValue) {
        // Players deck is bigger. For user information.
        console.log("\x1b[32m%s\x1b[0m", "=> You Won");
        console.log(
          displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue),
        );

        playerScore++;
      } else {
        // Both deck values are same. Or we reached very bad error. For user information.
        console.log("\x1b[33m%s\x1b[0m", "=> Draw");
        console.log(
          displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue),
        );
      }

      // Conclude round. Both parties stayed
      break;
    }
  }

  // To clear up clutter for user.
  console.log();
  console.log("-----------------------------");
  console.log();
}