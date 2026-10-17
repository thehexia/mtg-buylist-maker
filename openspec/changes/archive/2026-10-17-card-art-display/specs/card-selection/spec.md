## MODIFIED Requirements

### Requirement: Cards are presented one at a time
The system SHALL present the parsed cards one at a time, showing the card's
art image, name, quantity, and (when available) set/edition before the user
decides. Art is loaded asynchronously and displayed when available.

#### Scenario: Next card shown after a decision
- **WHEN** the user records a yes/no decision for the current card
- **THEN** the system advances to the next undecided card

#### Scenario: Deck fully reviewed
- **WHEN** the user has recorded a decision for every card
- **THEN** the system stops the one-at-a-time flow and presents the buylist

#### Scenario: Card art displayed
- **WHEN** the card art has successfully loaded for the current card
- **THEN** the art image is shown prominently as part of the card panel

## ADDED Requirements

### Requirement: Card art degrades gracefully when unavailable
The system SHALL display the card panel without a broken image when art
cannot be loaded, preserving the full keep/skip interaction.

#### Scenario: Art fails to load
- **WHEN** the card art cannot be fetched or the image errors
- **THEN** the card panel is shown without an image and all interaction
  controls remain functional

#### Scenario: Art is loading
- **WHEN** the card art fetch is in flight
- **THEN** the card panel is shown with a placeholder in the art area so
  layout does not shift when art arrives
