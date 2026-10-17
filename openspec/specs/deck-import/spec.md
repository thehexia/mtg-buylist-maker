## Purpose

Fetch a Moxfield deck by URL through a backend proxy and parse it into a
structured, normalized list of card entries the rest of the app can operate on.

## Requirements

### Requirement: Users can submit a Moxfield deck URL
The system SHALL let the user submit a Moxfield deck URL and request that the
deck be loaded into the app.

#### Scenario: Valid deck URL submitted
- **WHEN** the user submits a URL that points to a public Moxfield deck
- **THEN** the system fetches the deck from the backend and proceeds to card selection

#### Scenario: Invalid URL format
- **WHEN** the user submits a string that is not a Moxfield deck URL
- **THEN** the system rejects it with a clear client-side error and does not call the backend

### Requirement: Backend fetches and parses the decklist
The system SHALL fetch the Moxfield deck via a backend proxy and parse it into
a list of card entries, each containing at minimum the card name and quantity.
When identified, the entry SHALL also include the card's edition/set.

#### Scenario: Successful parse
- **WHEN** the backend successfully retrieves and parses the deck
- **THEN** the system returns a structured list of card entries with name,
  quantity, and (when available) set/edition

#### Scenario: Duplicate cards collapse
- **WHEN** the same card appears in multiple sections of the deck
- **THEN** the system returns a single entry per card with the summed quantity

### Requirement: Fetch and parse failures surface a clear error
When a deck cannot be fetched or parsed, the system SHALL present a clear error
to the user and allow them to try another URL.

#### Scenario: Deck not found
- **WHEN** the submitted URL does not resolve to a deck the backend can fetch
- **THEN** the system shows a "deck not found or unavailable" error and lets the
  user submit a different URL

#### Scenario: Parse failure
- **WHEN** the backend retrieves a page but cannot extract a decklist
- **THEN** the system shows a "could not parse this deck" error and lets the user
  submit a different URL

### Requirement: Fetch must avoid browser CORS
The system SHALL perform the Moxfield HTTP request server-side so the browser
never fetches Moxfield directly.

#### Scenario: Browser does not call Moxfield
- **WHEN** a deck is loaded
- **THEN** the request to Moxfield originates from the backend, not the browser
