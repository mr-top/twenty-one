const DECK_TEMPLATE = [];
const READER = require('readline-sync');


// template generator. NOT SHUFFLED. MUTATES
function populateTemplate(arr) {
  let specialFaces = ['King', 'Queen', 'Prince'];
  let suitFaces = ['Heart', 'Club', 'Diamond', 'Spades'];


  for (let numbereds = 2; numbereds <= 10; numbereds++) {
    for (let suits = 0; suits < 4; suits++) {
      switch (suits) {
        case 0:
          arr.push({ suit: suitFaces[suits], face: numbereds });
          break;
        case 1:
          arr.push({ suit: suitFaces[suits], face: numbereds });
          break;
        case 2:
          arr.push({ suit: suitFaces[suits], face: numbereds });
          break;
        case 3:
          arr.push({ suit: suitFaces[suits], face: numbereds });
          break;
      }
    }
  }

  for (let specials = 0; specials < 3; specials++) {

    for (let suits = 0; suits < 4; suits++) {
      switch (suits) {
        case 0:
          arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
          break;
        case 1:
          arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
          break;
        case 2:
          arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
          break;
        case 3:
          arr.push({ suit: suitFaces[suits], face: specialFaces[specials] });
          break;
      }
    }
  }

  suitFaces.forEach(function (currentSuit) {
    arr.push({ suit: currentSuit, face: 'Ace' });
  });
}

populateTemplate(DECK_TEMPLATE);

// shuffler. non-MUTATES. returns shuffled arr.
function shuffleArray(arr) {
  let deepCopyArrString = JSON.stringify(arr);
  let deepCopyArr = JSON.parse(deepCopyArrString);

  for (var i = deepCopyArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = deepCopyArr[i];
    deepCopyArr[i] = deepCopyArr[j];
    deepCopyArr[j] = temp;
  }

  return deepCopyArr;
}

function displayDeck(deck) {
  let message = `${deck[0].face} of ${deck[0].suit} and ${deck[1].face} of ${deck[1].suit}`;
  if (deck.length > 2) {
    for (let extraCard = 2; extraCard < deck.length; extraCard++) {
      message = message + `, ${deck[extraCard].face} of ${deck[extraCard].suit}`;
    }
  }

  return message;
}

function displayDealerFirstDeckAndLength(deck) {
  let message = `First card of the dealer is ${deck[0].face} of ${deck[0].suit} of ${deck.length - 1} other cards.`;
  return message;
}

function displayBothResults(playerDeck, dealerDeck, playerScore, dealerScore) {
  return `You had deck of ${displayDeck(playerDeck)} with total value of ${playerScore}\nDealer had deck of ${displayDeck(dealerDeck)} with total value of ${dealerScore}`;
}

// Mutates
let roundStart = function (playerDeck, dealerDeck) {
  playerDeck.push(shuffledDeck[cardToPick]);
  playerDeck.push(shuffledDeck[cardToPick + 1]);
  dealerDeck.push(shuffledDeck[cardToPick + 2]);
  dealerDeck.push(shuffledDeck[cardToPick + 3]);
  cardToPick = cardToPick + 4;
}

// returns a boolean and mutates argument and changes global variable
let userPrompter = function (playerDeck) {

  while (true) {
    console.log('\x1b[34m%s\x1b[0m', 'What would you like to do? HIT OR STAY: ');
    let userInput = READER.prompt().trim().toUpperCase();
    if (userInput === 'HIT') {
      playerDeck.push(shuffledDeck[cardToPick]);
      cardToPick++;
      return false;
    }
    else if (userInput === 'STAY') {
      return true;
    }
    else {
      console.log('Invalid Input');
    }
  }

}

// returns a boolean and mutates argument and changes global variable
let computerPrompter = function (dealerDeck) {
  if (evaluateDeck(dealerDeck) >= 17) {
    return true;
  }
  else {
    dealerDeck.push(shuffledDeck[cardToPick]);
    cardToPick++;
    return false;
  }
}

// Doesn't mutate, returns sum of value deck passed in
let evaluateDeck = function (deck) {
  let sumOfDeck = 0;
  deck.forEach(function (card) {
    if (card.face === 'Ace') {
      if (sumOfDeck <= 10) {
        sumOfDeck = sumOfDeck + 11;
      }
      else {
        sumOfDeck = sumOfDeck + 1;
      }
    }
    else if (['King', 'Queen', 'Prince'].includes(card.face)) {
      sumOfDeck = sumOfDeck + 10;
    }
    else {
      sumOfDeck = sumOfDeck + card.face;
    }
  });
  return sumOfDeck;
}



// Part 2: initialization of rules before game start
// This statement generates an array of cards which are objects and shuffles them. 
let shuffledDeck = shuffleArray(DECK_TEMPLATE);

// Tricky variable but meant to keep track of new cards to pick from shuffledDeck. 
let cardToPick = 0;

// 2 variables meant to keep track of scores for each parties (Player and Dealer).
let [playerScore, dealerScore] = [0, 0];

// Part 3: Game start
// Main game loop. Each iteration of this loop is a game ROUND. Game ends when there are 4 or less cards.
while (cardToPick <= 48) {

  // Initialization of rules for each round.
  console.log('\x1b[36m%s\x1b[0m', `Player: ${playerScore}, Dealer: ${dealerScore}`); // Displays scores of both parties.
  let [playerDeck, dealerDeck] = [[], []]; // Cards that a player holds is held in an array. This variable is reset to empty every round.
  let [playerStayed, dealerStayed] = [false, false]; // Variables meant to keep track if a party has decided to stay or not. 
  let [playerValue, dealerValue] = [0, 0]; // Variables meant to keep track of value of deck (cards) each party holds (Player and dealer).

  roundStart(playerDeck, dealerDeck); // Adds 2 cards to deck of both parties. Mutates and increments cardToPick by 4.

  playerValue = evaluateDeck(playerDeck); // Evaluate value of deck of party used in argument and store the value in an array. 
  dealerValue = evaluateDeck(dealerDeck); // Same as above.

  // Part 4: Round start
  // This is a round loop. Ending of this loop means that a round has concluded.
  while (true) {

    // This is a action of the player.
    // Should a player take action is dependant on playerStayed. If stayed then player should stay frozen until end of the round.
    if (!playerStayed) {
      console.log('You have ' + displayDeck(playerDeck) + '. Your value is ' + playerValue);
      console.log(displayDealerFirstDeckAndLength(dealerDeck));

      // Function to prompt user what action they would like to take. Takes input from user,
      // Mutates deck passed in, increments cardToPick and returns true or false depending if they stayed.
      playerStayed = userPrompter(playerDeck);

      console.log();

      if (playerStayed) {
        console.log('...You stayed');
      }
      else {
        console.log(`...You hit and drew ${playerDeck[playerDeck.length - 1].face} of ${playerDeck[playerDeck.length - 1].suit}`);
      }

      // Function that will update the overall deck value.
      playerValue = evaluateDeck(playerDeck);

      // If value of player deck exceeds 21. The round concludes instantly (break)
      if (playerValue > 21) {
        // Player busted.
        console.log('\x1b[31m%s\x1b[0m', '=> You Lost');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));
        // Increments score of dealer since player busted.
        dealerScore++;
        break;
      }
    }

    // This is a action of the dealer.
    // Dealer also mimics some of the actions of a player and rules set on them exactly.
    if (!dealerStayed) {

      // Function for computer to decide what action they should take. Mimics userPrompter but doesn't take input from user.
      dealerStayed = computerPrompter(dealerDeck);

      if (dealerStayed) {
        console.log('...Dealer stayed');
      }
      else {
        console.log(`...Dealer hit and drew a card`);
      }

      // Mimics player
      dealerValue = evaluateDeck(dealerDeck);

      // If value of dealer deck exceeds 21. The round concludes instantly (break)
      if (dealerValue > 21) {
        // Dealer busted
        console.log('\x1b[32m%s\x1b[0m', '=> You Won');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));
        // Increments score of player since dealer busted.
        playerScore++;
        break;
      }
    }

    // Once both parties have stayed, this is evaluate who is the winner depending on their deck values.
    if (playerStayed && dealerStayed) {

      if (dealerValue > playerValue) {
        // Dealers deck is bigger.
        console.log('\x1b[31m%s\x1b[0m', '=> You Lost');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));

        dealerScore++;
      }
      else if (playerValue > dealerValue) {
        // Players deck is bigger.
        console.log('\x1b[32m%s\x1b[0m', '=> You Won');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));

        playerScore++;
      }
      else {
        // Both deck values are same. Or we reached very bad error. 
        console.log('\x1b[33m%s\x1b[0m', '=> Draw');
        console.log(displayBothResults(playerDeck, dealerDeck, playerValue, dealerValue));
      }

      // Conclude round. Both parties stayed
      break;
    }
  }

  console.log();
  console.log('-----------------------------');
  console.log();

}
