# Mobile UI Standards

This app should feel like a polished production iOS/Android app.

## UI quality bar

Do not create vibecoded UI.

Avoid:
- random gradients
- excessive shadows
- inconsistent spacing
- inconsistent border radii
- generic SaaS dashboard layouts
- decorative elements with no function
- crowded screens
- tiny touch targets
- web-first layouts

Prefer:
- clean mobile-native layouts
- strong hierarchy
- generous spacing
- readable typography
- restrained color usage
- consistent component variants
- clear primary actions
- useful empty/loading/error states

## Tech stack

Use:
- Expo
- React Native
- TypeScript
- NativeWind
- React Native Reusables

## Design behavior

Before building a new screen:
1. Inspect existing screens and components.
2. Reuse existing design patterns.
3. Propose the screen structure.
4. Then implement.

## Components

Prefer existing components before creating new ones.

Only extract reusable components when:
- the pattern appears more than once
- it improves readability
- it does not create unnecessary abstraction

## Mobile rules

- Touch targets should be at least 44px high.
- Important actions should be thumb-accessible where possible.
- Forms should be easy to complete on mobile.
- Use safe area handling.
- Handle loading, empty, error, and disabled states.
- Avoid layout jumps.
- Keep screens readable on small Android phones.