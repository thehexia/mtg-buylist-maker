## Purpose

Drive the user through a parsed decklist one card at a time, capturing a
keep/skip decision per card and maintaining a running buylist of kept cards,
with a swipe interface on mobile and buttons on desktop.

## Requirements

### Requirement: Cards are presented one at a time
The system SHALL present the parsed cards one at a time, showing the card's
name, quantity, and (when available) set/edition before the user decides.

#### Scenario: Next card shown after a decision
- **WHEN** the user records a yes/no decision for the current card
- **THEN** the system advances to the next undecided card

#### Scenario: Deck fully reviewed
- **WHEN** the user has recorded a decision for every card
- **THEN** the system stops the one-at-a-time flow and presents the buylist

### Requirement: Each card has an explicit yes/no decision
The system SHALL record a yes (keep) or no (skip) decision for each card.

#### Scenario: Mobile swipe-to-decide
- **WHEN** the user is on a mobile device and swipes the current card right
- **THEN** the system records a yes (keep) decision for that card
- **WHEN** the user is on a mobile device and swipes the current card left
- **THEN** the system records a no (skip) decision for that card

#### Scenario: Desktop buttons
- **WHEN** the user is on a non-mobile device
- **THEN** the system shows explicit Yes and No buttons and records the decision
  from the button the user presses

### Requirement: Running buylist of kept cards
The system SHALL maintain a live buylist containing every card the user
decided to keep, with the card's name, quantity, and set/edition.

#### Scenario: Kept card added to buylist
- **WHEN** the user records a yes decision for a card
- **THEN** that card appears in the running buylist

#### Scenario: Skipped card excluded from buylist
- **WHEN** the user records a no decision for a card
- **THEN** that card does not appear in the running buylist

### Requirement: Selections persist across reloads
The system SHALL persist the in-progress card-by-card location and the running
buylist locally in the browser so a page reload resumes where the user left off.

#### Scenario: Reload resumes progress
- **WHEN** the user reloads the page mid-review
- **THEN** the system restores the current card position and the running buylist

### Requirement: User can reset the review
The system SHALL allow the user to discard the current review and buylist and
start over with a new deck.

#### Scenario: Reset clears state
- **WHEN** the user chooses to reset
- **THEN** the current card position, decisions, and buylist are cleared
