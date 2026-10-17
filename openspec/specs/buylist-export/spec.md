## Purpose

Turn the user's kept cards into a copyable, TCGplayer-compatible list and hand
off to TCGplayer's "Create a Buylist" tool so the user can create the buylist.

## Requirements

### Requirement: TCGplayer-compatible copyable list
The system SHALL present the kept cards as a plain-text list formatted so it can
be pasted into TCGplayer's "Create a Buylist" tool.

#### Scenario: Copyable format rendered
- **WHEN** the buylist is non-empty
- **THEN** the system shows a plain-text list of kept cards including name and
  quantity, formatted for TCGplayer's buylist input

### Requirement: Copy to clipboard
The system SHALL let the user copy the formatted list to the clipboard in one
action.

#### Scenario: Successful copy
- **WHEN** the user triggers copy and the clipboard is available
- **THEN** the list is copied and the user is shown confirmation

#### Scenario: Clipboard unavailable
- **WHEN** the user triggers copy but the clipboard is unavailable or denied
- **THEN** the system falls back to a selectable text the user can copy manually

### Requirement: Link out to TCGplayer
The system SHALL provide a link/CTA that takes the user to TCGplayer's
"Create a Buylist" tool so they can paste the list and create the buylist.

#### Scenario: Proceed to TCGplayer
- **WHEN** the user chooses to proceed
- **THEN** the system opens the TCGplayer buylist creation page in a new tab

### Requirement: Empty buylist export is guarded
The system SHALL prevent exporting and show guidance when no cards have been
kept.

#### Scenario: No cards kept
- **WHEN** the user attempts to export with an empty buylist
- **THEN** the system does not produce a list and prompts the user to keep cards
