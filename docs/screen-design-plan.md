# Screen Design Plan — Fitness App Mobile

## Overview

This document details the step-by-step plan for designing and building all screens for the Fitness App mobile client. The visual design system is derived from `pcash-inventory-v2` (a shadcn/ui Next.js project) and adapted for React Native via NativeWind v4. The backend API is a NestJS service at `fitness_app_backend`.

**Tech stack**: Expo SDK 57, Expo Router (file-based), NativeWind v4, Zustand, TanStack React Query, react-hook-form + zod, lucide-react-native, react-native-reanimated.

**Current state**: Bootstrap only — auth provider wired, API client configured, health-check screen exists. No business-logic screens built yet.

---

## Phase 0 — Design Token Alignment

**Before any screen work**, the `tailwind.config.js` must be updated to match the `pcash-inventory-v2` design system. The current config has a different palette (blue primary, different background, etc.).

### 0.1 Tailwind Config Update

Replace the current `tailwind.config.js` with the full shadcn-compatible color system:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./navigation/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#f8f9fb",
        foreground: "#171717",
        primary: {
          DEFAULT: "#1b1b41",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f4ff",
          foreground: "#1b1b41",
        },
        muted: {
          DEFAULT: "#f1f4f8",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#eef2ff",
          foreground: "#1b1b41",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#171717",
        },
        border: "#e4e7ec",
        input: "#e4e7ec",
        ring: "#1b1b41",
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#22c55e",
        },
        warning: {
          DEFAULT: "#f59e0b",
        },
        // Sidebar colors (used for tab bars in mobile)
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#374151",
          muted: "#6b7280",
          accent: "#1b1b41",
          "accent-foreground": "#ffffff",
          border: "#e2e8f0",
        },
        // Chart colors
        chart: {
          1: "#1b1b41",
          2: "#3b82f6",
          3: "#10b981",
          4: "#f59e0b",
          5: "#ef4444",
          6: "#8b5cf6",
          7: "#06b6d4",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "4xl": "9999px",
      },
    },
  },
  plugins: [],
};
```

### 0.2 Color Token Mapping

| CSS Variable (`pcash-inventory-v2`) | Tailwind Token | Hex | Usage |
|---|---|---|---|
| `--background` | `bg-background` | `#f8f9fb` | Screen background |
| `--foreground` | `text-foreground` | `#171717` | Primary text |
| `--primary` | `bg-primary` / `text-primary-foreground` | `#1b1b41` | Primary actions, active states |
| `--secondary` | `bg-secondary` / `text-secondary-foreground` | `#f0f4ff` | Secondary actions, hover states |
| `--muted` | `bg-muted` | `#f1f4f8` | Subtle backgrounds, skeletons |
| `--muted-foreground` | `text-muted-foreground` | `#64748b` | Secondary text, descriptions |
| `--card` | `bg-card` | `#ffffff` | Card/surface backgrounds |
| `--border` | `border-border` | `#e4e7ec` | Borders, dividers, separators |
| `--input` | `border-input` | `#e4e7ec` | Input field borders |
| `--ring` | `ring-ring` | `#1b1b41` | Focus ring color |
| `--destructive` | `text-destructive` | `#ef4444` | Error states, destructive actions |
| `--success` | `text-success` | `#22c55e` | Success states |
| `--warning` | `text-warning` | `#f59e0b` | Warning states |

### 0.3 Border Radius Scale

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| `--radius-sm` | 4px | `rounded-sm` | Small elements |
| `--radius-md` | 6px | `rounded-md` | Medium elements |
| `--radius-lg` | 8px | `rounded-lg` | Inputs, buttons, selects |
| `--radius-xl` | 12px | `rounded-xl` | Cards, dialogs, sheets |
| `--radius-2xl` | 16px | `rounded-2xl` | Large containers |
| `--radius-4xl` | 9999px | `rounded-4xl` | Badges, pills, avatars |

### 0.4 Typography Scale

No explicit font size tokens — use Tailwind defaults. The project uses the device's system font (San Francisco on iOS, Roboto on Android). No custom font import needed for Phase 1.

| Role | Classes | Where |
|---|---|---|
| Page title | `text-3xl font-bold tracking-tight` | Screen headers |
| Section title | `text-lg font-semibold leading-snug` | Card titles |
| Body text | `text-sm` | Card content, descriptions |
| Muted text | `text-sm text-muted-foreground` | Secondary descriptions, metadata |
| Small labels | `text-xs font-medium text-muted-foreground uppercase tracking-wide` | Section labels, KPI labels |
| Large numbers | `text-2xl font-bold tracking-tight tabular-nums` | KPI values, stats |
| Buttons | `text-sm font-medium` | Button labels |
| Form labels | `text-sm font-medium leading-none` | Input labels |
| Form errors | `text-sm font-medium text-destructive` | Validation messages |
| Badges | `text-xs font-medium` | Status badges |

### 0.5 Spacing Scale (Standard Tailwind)

| Class | Value | Usage |
|---|---|---|
| `p-2` / `gap-2` | 8px | Compact items, icon padding |
| `p-3` / `gap-3` | 12px | Card size "sm" content |
| `p-4` / `gap-4` | 16px | Card content, list items |
| `p-6` / `gap-6` | 24px | Screen padding, section gaps |
| `space-y-2` | 8px | Form item groups |
| `space-y-4` | 16px | Card groups |
| `space-y-6` | 24px | Page section groups |

---

## Phase 1 — UI Component Library

Build these components before any screen work. Each component follows the `pcash-inventory-v2` visual style, adapted for React Native primitives (`View`, `Text`, `Pressable`, `TextInput`) using NativeWind classes and `class-variance-authority` for variants.

### 1.1 Card

**Reference**: `pcash-inventory-v2/components/ui/card.tsx`

The Card is the foundational layout container. Every screen uses cards to group content.

**API**:
```tsx
<Card size="default" | "sm">
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
    <CardAction>{/* icon button */}</CardAction>
  </CardHeader>
  <CardContent>{/* main content */}</CardContent>
  <CardFooter>{/* actions */}</CardFooter>
</Card>
```

**Design spec**:
- Container: `rounded-xl bg-card border border-border/70 px-0 py-4`
- Size `sm`: reduced gap `gap-3 py-3`
- `CardHeader`: `px-4 gap-1` with auto-rows grid for title+action layout
- `CardTitle`: `text-lg leading-snug font-semibold`
- `CardDescription`: `text-sm text-muted-foreground`
- `CardContent`: `px-4`
- `CardFooter`: `flex-row items-center border-t bg-muted/50 p-4`

**Notes for RN**:
- No `gap` support on older RN — use `space-y-*` or margin-based spacing if needed. Expo 57 / RN 0.86 supports `gap` fully.
- No shadows on RN natively — use `shadow-sm`, `shadow-md` classes with `shadow-black/5` for iOS. Android shadows use `elevation`. The Card border serves as the primary visual separator since RN shadows are limited.
- No hover effect on mobile — skip `hover:shadow-[var(--shadow-float)]`.

### 1.2 Button (Enhance Existing)

**Reference**: `pcash-inventory-v2/components/ui/button.tsx`

The existing `Button` at `components/ui/button.tsx` needs enhancement to match the full variant system.

**Current state**: Only `default` and `outline` variants, fixed `h-11`, no size variants.

**Target API**:
```tsx
<Button variant="default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
        size="default" | "sm" | "lg" | "icon"
        label="Click me" | {children}
        loading={boolean}
        disabled={boolean} />
```

**Variant specs**:
| Variant | Background | Text | Border |
|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | none |
| `outline` | `bg-transparent` | `text-foreground` | `border border-border` |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | none |
| `ghost` | `bg-transparent` | `text-foreground` | none |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | none |
| `link` | `bg-transparent` | `text-primary underline` | none |

**Size specs**:
| Size | Height | Padding | Font |
|---|---|---|---|
| `default` | `h-10` | `px-4` | `text-sm font-medium` |
| `sm` | `h-8` | `px-3` | `text-xs font-medium` |
| `lg` | `h-12` | `px-6` | `text-base font-medium` |
| `icon` | `size-10` | `p-0` | — |

**Behavior**:
- `active:opacity-80` for press feedback
- `disabled:opacity-50` for disabled state
- Loading state: show `ActivityIndicator` + keep width stable

### 1.3 Input

**Reference**: `pcash-inventory-v2/components/ui/input.tsx`

**API**:
```tsx
<Input
  placeholder="Enter value"
  value={value}
  onChangeText={setValue}
  leftIcon={<Search size={16} />}
  rightIcon={<X size={16} onPress={clear} />}
  error="Error message"
  disabled={boolean}
/>
```

**Design spec**:
- Container: `h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2`
- Text: `text-base text-foreground`
- Placeholder: `text-muted-foreground`
- Focus: `border-ring` (handled via `focusVisible` prop in RN)
- Error: `border-destructive`
- Disabled: `opacity-50 bg-muted/50`
- Icon slots: left icon `ml-2 text-muted-foreground`, right icon `mr-2`

**Notes for RN**: React Native `TextInput` maps directly. Use a wrapper `View` for icon slots since RN `TextInput` doesn't support inline icons natively.

### 1.4 Badge

**Reference**: `pcash-inventory-v2/components/ui/badge.tsx`

**API**:
```tsx
<Badge variant="default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info">
  Active
</Badge>
```

**Design spec**:
- Container: `h-5 rounded-4xl px-2 py-0.5 inline-flex items-center justify-center`
- Text: `text-xs font-medium`
- No icon support initially — add later if needed.

**Variant specs**:
| Variant | Background | Text | Border |
|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | none |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | none |
| `destructive` | `bg-destructive/10` | `text-destructive` | none |
| `outline` | `bg-transparent` | `text-foreground` | `border border-border` |
| `success` | `bg-green-100` | `text-green-800` | `border border-green-200` |
| `warning` | `bg-amber-100` | `text-amber-800` | `border border-amber-200` |
| `info` | `bg-blue-100` | `text-blue-800` | `border border-blue-200` |

**Use cases in the app**:
- `MembershipStatus`: ACTIVE (success), SUSPENDED (warning), REVOKED (destructive)
- `RegistrationStatus`: PROFILE_INCOMPLETE (warning), NEEDS_ORGANIZATION (info), ACTIVE (success)
- `InvitationStatus`: PENDING (warning), ACCEPTED (success), EXPIRED (muted), REVOKED (destructive)
- `WorkoutLogStatus`: SCHEDULED (secondary), IN_PROGRESS (info), COMPLETED (success), MISSED (destructive)
- `OrganizationRole`: OWNER (default), COACH (info), ATHLETE (secondary), etc.

### 1.5 Avatar

**API**:
```tsx
<Avatar size="default" | "sm" | "lg">
  <AvatarImage source={{ uri: url }} />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Design spec**:
| Size | Dimensions | Fallback Font |
|---|---|---|
| `sm` | `size-6` (24px) | `text-xs` |
| `default` | `size-8` (32px) | `text-sm` |
| `lg` | `size-10` (40px) | `text-base` |

- Shape: `rounded-full`
- Background: `bg-primary`
- Text: `text-primary-foreground font-medium`
- Image: `rounded-full` with `resizeMode="cover"`

### 1.6 Separator

**API**:
```tsx
<Separator orientation="horizontal" | "vertical" />
```

**Design spec**:
- Horizontal: `h-px w-full bg-border`
- Vertical: `w-px h-full bg-border`

### 1.7 Skeleton

**API**:
```tsx
<Skeleton className="h-4 w-full rounded-md" />
```

**Design spec**:
- `bg-muted rounded-md animate-pulse`
- Common patterns: `h-4 w-3/4` (text line), `h-8 w-full rounded-lg` (input), `h-10 w-10 rounded-full` (avatar), `h-32 w-full rounded-xl` (card)

### 1.8 PageHeader

**Reference**: `pcash-inventory-v2/components/ui/page-header.tsx`

**API**:
```tsx
<PageHeader
  title="Members"
  description="Manage organization members and their roles"
  actions={<Button label="Invite" />}
/>
```

**Design spec**:
- Container: `border-b border-border px-6 pt-6 pb-3`
- Title: `text-3xl font-bold tracking-tight text-foreground`
- Description: `text-sm text-muted-foreground mt-1`
- Actions: right-aligned, vertically centered with title

**Note for mobile**: Not sticky (no `sticky top-0` in RN). Screens scroll naturally. The header scrolls with content. For tab headers that should remain visible, use a separate `View` outside the `ScrollView`.

### 1.9 Select / Picker

**API**:
```tsx
<Select
  value={value}
  onValueChange={setValue}
  options={[
    { label: "Owner", value: "OWNER" },
    { label: "Coach", value: "COACH" },
  ]}
  placeholder="Select role"
/>
```

**Design spec**:
- Trigger: `h-10 rounded-lg border border-input bg-transparent px-3 flex-row items-center justify-between`
- Text: `text-base text-foreground` (or `text-muted-foreground` for placeholder)
- Chevron: `ChevronDown size={16} text-muted-foreground`
- Options: `ActionSheet` on iOS, `Modal` on Android with list items

### 1.10 Tabs

**API**:
```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="info">Info</TabsTrigger>
    <TabsTrigger value="members">Members</TabsTrigger>
  </TabsList>
  <TabsContent value="info">{/* content */}</TabsContent>
  <TabsContent value="members">{/* content */}</TabsContent>
</Tabs>
```

**Design spec**:
- `TabsList`: `flex-row bg-muted rounded-lg p-1 gap-1`
- `TabsTrigger`: `flex-1 h-9 items-center justify-center rounded-md px-3 text-sm font-medium`
  - Active: `bg-card text-foreground shadow-sm`
  - Inactive: `text-muted-foreground`

### 1.11 Form Components

**Wrapper for react-hook-form + zod**:

```tsx
<Form {...form}>
  <FormField control={form.control} name="fullName" render={({ field }) => (
    <FormItem>
      <FormLabel>Full Name</FormLabel>
      <FormControl>
        <Input placeholder="John Doe" {...field} />
      </FormControl>
      <FormDescription>Your full legal name</FormDescription>
      <FormMessage />
    </FormItem>
  )} />
</Form>
```

**Design spec**:
- `FormItem`: `space-y-2` (gap between label, input, message)
- `FormLabel`: `text-sm font-medium leading-none`
- `FormDescription`: `text-xs text-muted-foreground`
- `FormMessage`: `text-sm font-medium text-destructive`

### 1.12 Empty State

**API**:
```tsx
<EmptyState
  icon={Users}
  title="No members yet"
  description="Invite members to your organization to get started."
  action={<Button label="Invite Member" />}
/>
```

**Design spec**:
- Container: `flex-1 items-center justify-center py-12 px-6`
- Icon: `size-12 text-muted-foreground/50 mb-4`
- Title: `text-lg font-semibold text-foreground text-center`
- Description: `text-sm text-muted-foreground text-center mt-2 max-w-xs`
- Action: `mt-6`

### 1.13 Loading / Full-Screen Loader

```tsx
<LoadingScreen />
// or
<View className="flex-1 items-center justify-center bg-background gap-4">
  <ActivityIndicator size="large" color="#1b1b41" />
  <Text className="text-sm text-muted-foreground">Loading...</Text>
</View>
```

### 1.14 Alert / Toast

Use `react-native` `Alert.alert()` for destructive confirmations. For non-blocking toasts, install `sonner-native` or build a simple toast context.

---

## Phase 2 — Navigation Architecture

### 2.1 Route Structure

```
app/
├── _layout.tsx                          # Root layout (AppProviders + Theme)
├── index.tsx                            # Entry — redirects based on auth state
│
├── (auth)/                              # Auth group (no tab bar)
│   ├── _layout.tsx                      # Stack layout for auth screens
│   ├── login.tsx                        # Login screen
│   ├── register.tsx                     # Registration (redirect to Supabase)
│   ├── onboarding/
│   │   ├── profile.tsx                  # Complete profile (fullName, avatar, acceptTerms)
│   │   ├── create-org.tsx               # Create first organization
│   │   └── join-org.tsx                 # Join via invitation code
│   └── invite/
│       └── [token].tsx                  # Accept invitation by token
│
├── (app)/                               # Authenticated group (with tab bar)
│   ├── _layout.tsx                      # Tab layout (dashboard, members, programs, profile)
│   │
│   ├── dashboard.tsx                    # Home dashboard (KPI cards, upcoming workouts, announcements)
│   │
│   ├── members/                         # Member management
│   │   ├── index.tsx                    # Member list with filters
│   │   ├── [id].tsx                     # Member detail (profile, teams, coach assignments)
│   │   ├── invite.tsx                   # Invite new member form
│   │   └── teams/
│   │       ├── index.tsx                # Team list
│   │       ├── [id].tsx                 # Team detail (members, settings)
│   │       └── create.tsx               # Create team
│   │
│   ├── programs/                        # Training programs
│   │   ├── index.tsx                    # Program list
│   │   ├── [id].tsx                     # Program detail (weeks, sessions)
│   │   ├── [id]/week/
│   │   │   └── [weekId].tsx             # Week detail (sessions)
│   │   ├── [id]/session/
│   │   │   └── [sessionId].tsx          # Session detail (segments, exercises)
│   │   └── create.tsx                   # Create program (future)
│   │
│   ├── athletes/                        # Athlete management (for coaches)
│   │   ├── index.tsx                    # Athlete list
│   │   ├── [id].tsx                     # Athlete detail (assignments, workout logs)
│   │   └── [id]/workout/
│   │       └── [logId].tsx              # Workout log detail (set data)
│   │
│   ├── workouts/                        # Workout logging (for athletes)
│   │   ├── index.tsx                    # Scheduled workouts list
│   │   ├── [id].tsx                     # Active workout session
│   │   └── history.tsx                  # Workout history
│   │
│   ├── org/                             # Organization settings
│   │   ├── settings.tsx                 # General settings (name, slug, timezone)
│   │   ├── audit-log.tsx                # Audit event log (OWNER only)
│   │   └── invite/
│   │       └── manage.tsx               # Manage pending invitations
│   │
│   └── profile/                         # User profile
│       ├── index.tsx                    # Own profile + settings
│       └── edit.tsx                     # Edit profile form
│
└── +not-found.tsx                       # 404 fallback
```

### 2.2 Navigation Patterns

**Auth redirect logic** (in `index.tsx`):
```
if loading → show splash/loader
if no session → redirect to /(auth)/login
if session + nextAction === "PROFILE_INCOMPLETE" → redirect to /(auth)/onboarding/profile
if session + nextAction === "NEEDS_ORGANIZATION" → redirect to /(auth)/onboarding/create-org
if session + registrationStatus === "ACTIVE" → redirect to /(app)/dashboard
```

**Tab bar** (in `(app)/_layout.tsx`):
- 4 or 5 tabs depending on role
- Coach sees: Dashboard, Members, Programs, Profile
- Athlete sees: Dashboard, Workouts, Programs, Profile
- Active tab: `text-primary`, inactive: `text-muted-foreground`
- Tab bar styling: `bg-card border-t border-border`

**Stack navigation** within each tab for detail screens.

### 2.3 Auth Guards

**Route protection**: Use Expo Router's `Screen` / `Redirect` in layout files:
- `(auth)/` group: redirect to dashboard if already authenticated
- `(app)/` group: redirect to login if not authenticated + registrationStatus check

---

## Phase 3 — Screen Designs

Each screen below includes: purpose, components used, layout structure, data dependencies, and states (loading, empty, error, edge cases).

### 3.1 Auth Screens

#### 3.1.1 Login Screen

**Route**: `app/(auth)/login.tsx`

**Purpose**: Email-based authentication via Supabase magic link or OAuth.

**Layout**:
```
┌──────────────────────────────────┐
│                                  │
│         [App Logo]               │
│      Fitness Coaching            │
│                                  │
│  ┌────────────────────────────┐  │
│  │  Email                     │  │
│  │  placeholder@email.com     │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  Password                  │  │
│  │  ••••••••                  │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │       Sign In       │  │
│  └────────────────────────────┘  │
│                                  │
│  ────── or continue with ────── │
│                                  │
│  [Google]  [Apple]              │
│                                  │
│  Don't have an account? Sign up │
│                                  │
└──────────────────────────────────┘
```

**Components**: Input, Button, Separator
**States**: idle, loading (button spinner), error (Alert or inline message), success (redirect)
**Data**: None — Supabase handles auth. On success, `AuthProvider` picks up session.

#### 3.1.2 Onboarding — Profile Completion

**Route**: `app/(auth)/onboarding/profile.tsx`

**Purpose**: Complete profile after first login. Required fields: fullName, acceptTerms.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Back                         │
│                                  │
│  Complete Your Profile           │
│  Tell us a bit about yourself   │
│                                  │
│  Full Name                       │
│  ┌────────────────────────────┐  │
│  │  John Doe                  │  │
│  └────────────────────────────┘  │
│                                  │
│  Avatar (optional)               │
│  ┌────┐                          │
│  │ +  │  Tap to upload           │
│  └────┘                          │
│                                  │
│  ☐ I accept the Terms of Service│
│    and Privacy Policy            │
│                                  │
│  ┌────────────────────────────┐  │
│  │    Complete Profile        │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `PATCH /v1/auth/profile` — `{ fullName, avatarUrl?, acceptTerms }`
**Components**: Input, Button, Avatar, Checkbox
**States**: loading, validation errors (inline FormMessage), submit error (toast)

#### 3.1.3 Onboarding — Create Organization

**Route**: `app/(auth)/onboarding/create-org.tsx`

**Purpose**: Create first organization after profile completion.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Back                         │
│                                  │
│  Create Your Organization        │
│  Set up your coaching workspace  │
│                                  │
│  Organization Name               │
│  ┌────────────────────────────┐  │
│  │  My Fitness Team           │  │
│  └────────────────────────────┘  │
│                                  │
│  URL Slug                        │
│  ┌────────────────────────────┐  │
│  │  my-fitness-team           │  │
│  └────────────────────────────┘  │
│  Auto-generated from name       │
│                                  │
│  Timezone                        │
│  ┌────────────────────────────┐  │
│  │  Africa/Nairobi        ▼  │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │   Create Organization      │  │
│  └────────────────────────────┘  │
│                                  │
│  ────── or ──────               │
│                                  │
│  Have an invitation code?       │
│  ┌────────────────────────────┐  │
│  │  Enter code                │  │
│  └────────────────────────────┘  │
│  [Join Organization]            │
│                                  │
└──────────────────────────────────┘
```

**API**: `POST /v1/organizations` — `{ name, slug, timezone }`
**Slug generation**: Auto-generate from name (lowercase, replace spaces with hyphens, remove special chars). Allow manual override.
**Edge case**: If user has invitation token in deep link, skip this screen and go to invite accept flow.

#### 3.1.4 Accept Invitation

**Route**: `app/(auth)/invite/[token].tsx`

**Purpose**: Preview invitation and accept it.

**Layout**:
```
┌──────────────────────────────────┐
│                                  │
│       [Organization Logo]        │
│                                  │
│  You've been invited to join     │
│                                  │
│  Acme Fitness                    │
│  as Coach                        │
│                                  │
│  Team: Elite Squad               │
│                                  │
│  Invited by: coach@acme.com      │
│                                  │
│  ┌────────────────────────────┐  │
│  │    Accept Invitation       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │    Decline                 │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/invitations/:token/preview` (public), `POST /v1/invitations/:token/accept`
**Components**: Card, Button, Badge (for role), Avatar (for org)
**Edge cases**:
- Token expired: show "This invitation has expired" with sad icon
- Token already accepted: show "You're already a member" with link to dashboard
- Token invalid: show error
- Email mismatch: prompt user to confirm (`acceptEmailMismatch`)

---

### 3.2 App Shell

#### 3.2.1 Tab Layout

**Route**: `app/(app)/_layout.tsx`

**Purpose**: Main authenticated shell with bottom tab bar.

```
┌──────────────────────────────────┐
│  Organization: Acme Fitness  ▼  │ ← Org switcher (if multiple orgs)
├──────────────────────────────────┤
│                                  │
│        [Active Screen]           │
│                                  │
├──────────────────────────────────┤
│  🏠       👥       📋       👤   │
│ Home   Members  Programs  Profile│
└──────────────────────────────────┘
```

**Tabs vary by role**:

**Coach / Owner**:
| Tab | Icon | Label | Route |
|---|---|---|---|
| Dashboard | `LayoutDashboard` | Home | `dashboard` |
| Members | `Users` | Members | `members` |
| Programs | `Dumbbell` | Programs | `programs` |
| Profile | `CircleUser` | Profile | `profile` |

**Athlete**:
| Tab | Icon | Label | Route |
|---|---|---|---|
| Dashboard | `LayoutDashboard` | Home | `dashboard` |
| Workouts | `Timer` | Workouts | `workouts` |
| Programs | `Dumbbell` | Programs | `programs` |
| Profile | `CircleUser` | Profile | `profile` |

**Tab bar design**:
- `bg-card border-t border-border h-16` (includes safe area for devices with home indicator)
- Active tab: `text-primary` + bold label
- Inactive tab: `text-muted-foreground`
- Icons: `size={20}` from lucide-react-native
- Labels: `text-[10px]` below icon

#### 3.2.2 Org Switcher

If user has multiple organizations, show a tappable org selector in the header:

```
┌──────────────────────────────────┐
│  ┌──────────────────────────┐   │
│  │ Acme Fitness         ▼  │   │
│  └──────────────────────────┘   │
├──────────────────────────────────┤
```

Tap opens a bottom sheet listing all orgs with active highlight. Selecting triggers `PUT /v1/auth/default-organization` and sets `x-organization-id` header for all subsequent API calls.

---

### 3.3 Dashboard Screen

**Route**: `app/(app)/dashboard.tsx`

**Purpose**: Landing screen after login. Shows key metrics, upcoming workouts, and quick actions.

**Layout**:
```
┌──────────────────────────────────┐
│  Dashboard                       │
│  Welcome back, Coach Jane!       │
├──────────────────────────────────┤
│                                  │
│  ┌────────┐  ┌────────┐         │
│  │ 12     │  │ 5      │         │
│  │Athletes│  │Coaches │         │
│  └────────┘  └────────┘         │
│  ┌────────┐  ┌────────┐         │
│  │ 3      │  │ 85%    │         │
│  │Active  │  │Attend. │         │
│  │Programs│  │Rate    │         │
│  └────────┘  └────────┘         │
│                                  │
│  Upcoming Workouts          See All│
│  ┌────────────────────────────┐  │
│  │ Mon, Jul 8                 │  │
│  │ John Doe — Upper Body       │  │
│  │ 6:00 AM                    │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Mon, Jul 8                 │  │
│  │ Sarah Smith — Lower Body   │  │
│  │ 7:30 AM                    │  │
│  └────────────────────────────┘  │
│                                  │
│  Recent Activity                │
│  ┌────────────────────────────┐  │
│  │ John completed Upper Body  │  │
│  │ 2 hours ago                │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Sarah invited to team      │  │
│  │ Yesterday                  │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**KPI Cards** (using Card component):
```
┌─────────────────────┐
│ Total Athletes      │
│ 12              👤   │
│ ↑ 2 from last month │
└─────────────────────┘
```
- Title: `text-xs font-medium text-muted-foreground uppercase tracking-wide`
- Value: `text-2xl font-bold tracking-tight tabular-nums`
- Subtitle: `text-xs text-muted-foreground`
- Icon: `rounded-lg p-2 bg-blue-100` with colored icon

**Data dependencies**:
- KPI data: `GET /v1/members` (counts by role), `GET /v1/programs` (active count)
- Upcoming: `GET /v1/athletes` (stubbed — will return upcoming workouts)
- Activity: `GET /v1/audit-events` (last 5 events)

**States**:
- Loading: 4 skeleton cards + skeleton list items
- Empty (new org, no members): EmptyState with "Invite your first athlete"
- Error: toast + retry button

---

### 3.4 Member Management Screens

#### 3.4.1 Member List

**Route**: `app/(app)/members/index.tsx`

**Purpose**: View, search, and filter all organization members. Manage roles.

**Layout**:
```
┌──────────────────────────────────┐
│  Members                   [Invite]│
│  Manage your team members        │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │ 🔍 Search members...      │  │
│  └────────────────────────────┘  │
│  [All] [Coach] [Athlete] [Suspended]│ ← Filter chips / tabs
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │ ● Jane Doe         OWNER   │  │
│  │   jane@email.com           │  │
│  │   2 teams                  │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ ● John Smith        COACH  │  │
│  │   john@email.com           │  │
│  │   5 athletes assigned      │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ ● Sarah Connor    ATHLETE  │  │
│  │   sarah@email.com          │  │
│  │   Active program: Strength │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**List item design**:
- Avatar + name + email stacked
- Role badge on the right (color-coded by role type)
- Subtitle line: team count, assignments, or program name
- Tap → navigate to member detail

**API**: `GET /v1/members` — `{ role?, status?, q?, page, pageSize }`
**Components**: PageHeader, Input (search), Badge (role chips), Card (list items), FlatList, Avatar
**States**: loading (skeleton list), empty ("No members found"), error, pagination (infinite scroll)

**Filter chips**:
```
[All] [Owners] [Coaches] [Athletes] [Suspended]
```
Horizontal `ScrollView` of Badge/Pressable components. Active chip: `bg-primary text-primary-foreground`. Inactive: `bg-muted text-muted-foreground`.

#### 3.4.2 Member Detail

**Route**: `app/(app)/members/[id].tsx`

**Purpose**: View member profile, assigned teams, coach assignments, workout history. Manage role, suspend, or remove.

**Layout** (scrollable):
```
┌──────────────────────────────────┐
│  ← Members                      │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │  ┌────┐                    │  │
│  │  │ JD │  John Doe          │  │
│  │  └────┘  john@email.com    │  │
│  │          Joined Jan 2025   │  │
│  └────────────────────────────┘  │
│                                  │
│  [Info] [Teams] [Workouts]       │ ← Tabs
│                                  │
│  ── Info Tab ──                  │
│  ┌────────────────────────────┐  │
│  │ Role                       │  │
│  │ Coach                      │  │
│  │ [Change Role]              │  │
│  ├────────────────────────────┤  │
│  │ Status                     │  │
│  │ Active  ●                  │  │
│  ├────────────────────────────┤  │
│  │ Assigned Athletes          │  │
│  │ 5 athletes                 │  │
│  │ ┌────┐ ┌────┐ ┌────┐       │  │
│  │ │ AS │ │ BK │ │ CM │ +2    │  │
│  │ └────┘ └────┘ └────┘       │  │
│  ├────────────────────────────┤  │
│  │ [Suspend Member]           │  │
│  │ [Remove Member]  (danger)  │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Teams Tab ──                 │
│  ┌────────────────────────────┐  │
│  │ Elite Squad    TEAM COACH  │  │
│  │ 8 members                  │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Beginners      ASSISTANT   │  │
│  │ 15 members                 │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Workouts Tab ──              │
│  ┌────────────────────────────┐  │
│  │ Jul 8 — Upper Body          │  │
│  │ Completed ●                 │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Jul 10 — Lower Body         │  │
│  │ Scheduled ○                 │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/members/:membershipId`
**Components**: Avatar, Card, Tabs, Badge, Button, Separator
**Actions** (role-gated):
- `PATCH /v1/members/:id/role` — Change role (modal/action sheet with role picker)
- `POST /v1/members/:id/suspend` — Suspend (Alert confirmation)
- `POST /v1/members/:id/reactivate` — Reactivate
- `DELETE /v1/members/:id` — Remove (Alert confirmation with reason field)
- `POST /v1/members/:athleteId/coach-assignments` — Assign coach (if viewing athlete)
- `DELETE /v1/members/:athleteId/coach-assignments/:id` — Remove coach assignment

**Edge cases**:
- Viewing own profile: hide suspend/remove actions
- OWNER viewing another OWNER: hide role change (or show but disable)
- Suspended member: show reactivate button instead of suspend

#### 3.4.3 Invite Member

**Route**: `app/(app)/members/invite.tsx`

**Purpose**: Invite new members to the organization via email.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Cancel              Invite    │
├──────────────────────────────────┤
│                                  │
│  Invite New Member               │
│  Send an invitation to join your │
│  organization                    │
│                                  │
│  Email                           │
│  ┌────────────────────────────┐  │
│  │  athlete@email.com         │  │
│  └────────────────────────────┘  │
│                                  │
│  Role                            │
│  ┌────────────────────────────┐  │
│  │  Athlete               ▼  │  │
│  └────────────────────────────┘  │
│                                  │
│  Team (optional)                 │
│  ┌────────────────────────────┐  │
│  │  Elite Squad           ▼  │  │
│  └────────────────────────────┘  │
│                                  │
│  Personal Message (optional)     │
│  ┌────────────────────────────┐  │
│  │  Hey! Join our fitness     │  │
│  │  team on this platform...   │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Expires in                      │
│  ┌────────────────────────────┐  │
│  │  7 days                 ▼  │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `POST /v1/invitations` — `{ email, role, teamId?, expiresInDays?, message? }`
**Components**: Input, Select, Textarea, Button, Form
**Role options filtered by inviter's permissions**: COACH can only invite ATHLETE/TRIAL_USER roles.
**States**: loading (send button spinner), success (toast + navigate back), validation errors, duplicate email error.

#### 3.4.4 Team List

**Route**: `app/(app)/members/teams/index.tsx`

**Purpose**: View and manage teams within the organization.

**Layout**:
```
┌──────────────────────────────────┐
│  Teams               [Create Team]│
│  Organize members into groups    │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │ 🔍 Search teams...        │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Elite Squad                │  │
│  │ 8 members                  │  │
│  │ Coaches: Jane, Mike        │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Beginners                  │  │
│  │ 15 members                 │  │
│  │ Coaches: Sarah             │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Competition Prep (Archived)│  │
│  │ 5 members                  │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/teams` — `{ status?, q? }`
**Components**: PageHeader, Input, Card, FlatList, Badge (status)
**Empty state**: "No teams yet" with create button.

#### 3.4.5 Team Detail / Create Team

**Route**: `app/(app)/members/teams/[id].tsx`, `app/(app)/members/teams/create.tsx`

**Team Detail Layout**:
```
┌──────────────────────────────────┐
│  ← Teams                        │
├──────────────────────────────────┤
│  Elite Squad                     │
│  Active                          │
│                                  │
│  Members (8)              [Add]  │
│  ┌────┐ ┌────┐ ┌────┐           │
│  │ JD │ │ AS │ │ BK │ +5 more   │
│  └────┘ └────┘ └────┘           │
│                                  │
│  ── Member List ──               │
│  ┌────────────────────────────┐  │
│  │ ● Jane Doe    TEAM COACH   │  │
│  │   jane@email.com           │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ ● John Smith  TEAM ATHLETE │  │
│  │   john@email.com           │  │
│  └────────────────────────────┘  │
│                                  │
│  Settings                        │
│  ┌────────────────────────────┐  │
│  │ Team Name                  │  │
│  │ Elite Squad                │  │
│  │ [Edit]                     │  │
│  ├────────────────────────────┤  │
│  │ Description                │  │
│  │ Advanced training group    │  │
│  │ [Edit]                     │  │
│  ├────────────────────────────┤  │
│  │ [Archive Team]             │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**:
- Detail: `GET /v1/teams/:teamId`
- Update: `PATCH /v1/teams/:teamId` — `{ name?, description? }`
- Add member: `POST /v1/teams/:teamId/members` — `{ membershipId, teamRole }`
- Update member role: `PATCH /v1/teams/:teamId/members/:id` — `{ teamRole }`
- Remove member: `DELETE /v1/teams/:teamId/members/:id`
- Archive: `POST /v1/teams/:teamId/archive`

**Create Team**: Simple form — name (required), description (optional).

---

### 3.5 Training Program Screens

**Note**: Backend endpoints for programs are currently stubbed (return `[]`). These screens can be built with mock data initially.

#### 3.5.1 Program List

**Route**: `app/(app)/programs/index.tsx`

**Purpose**: Browse training programs. Coaches see all org programs + can create. Athletes see assigned programs.

**Layout**:
```
┌──────────────────────────────────┐
│  Programs             [Create]   │ ← Coach only
│  Training program library        │
├──────────────────────────────────┤
│  [All] [Active] [Draft] [Archived]│
│                                  │
│  ┌────────────────────────────┐  │
│  │ Strength Foundation        │  │
│  │ 12 weeks · 4 sessions/week│  │
│  │ 5 athletes assigned   ACTIVE│  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Hypertrophy Block          │  │
│  │ 8 weeks · 5 sessions/week │  │
│  │ 3 athletes assigned   ACTIVE│  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Endurance Base             │  │
│  │ 6 weeks · 3 sessions/week │  │
│  │ 0 athletes assigned  DRAFT │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/programs` (stubbed — will eventually filter by org + status)
**Components**: PageHeader, Input (search), Badge (status filter chips), Card, FlatList
**Program card**: Title + duration + session frequency + assigned count + status badge.
**States**: loading skeleton cards, empty ("No programs yet"), error.

#### 3.5.2 Program Detail

**Route**: `app/(app)/programs/[id].tsx`

**Purpose**: View program structure — all weeks and sessions in an accordion/collapsible view.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Programs                     │
├──────────────────────────────────┤
│  Strength Foundation             │
│  DRAFT                           │
│                                  │
│  12 weeks · 4 sessions/week      │
│  Description text here...        │
│                                  │
│  [Edit] [Publish] [Archive]      │
│                                  │
│  ── Weeks ──                     │
│                                  │
│  ▼ Week 1: Foundation            │
│  │  ┌────────────────────────┐  │
│  │  │ Day 1 — Upper Body Push │  │
│  │  │ 5 exercises            │  │
│  │  └────────────────────────┘  │
│  │  ┌────────────────────────┐  │
│  │  │ Day 2 — Lower Body      │  │
│  │  │ 4 exercises            │  │
│  │  └────────────────────────┘  │
│  │  ┌────────────────────────┐  │
│  │  │ Day 3 — Upper Body Pull │  │
│  │  │ 5 exercises            │  │
│  │  └────────────────────────┘  │
│  │  ┌────────────────────────┐  │
│  │  │ Day 4 — Full Body       │  │
│  │  │ 6 exercises            │  │
│  │  └────────────────────────┘  │
│                                  │
│  ▶ Week 2: Progression          │
│                                  │
│  ▶ Week 3: Intensity Build      │
│                                  │
└──────────────────────────────────┘
```

**Design notes**:
- Use `Collapsible` component for week expansion
- Session cards show: day number, title, exercise count
- Tap session → navigate to session detail

**States**: loading (skeleton program header + skeleton session cards), empty (no weeks yet), error.

#### 3.5.3 Session Detail

**Route**: `app/(app)/programs/[id]/session/[sessionId].tsx`

**Purpose**: View a training session's segments and exercises.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Week 1                       │
├──────────────────────────────────┤
│  Day 1 — Upper Body Push         │
│                                  │
│  ── Warm-Up ──                   │
│  ┌────────────────────────────┐  │
│  │ Band Pull-Aparts           │  │
│  │ 2 × 15 · RPE 5 · Rest 60s │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Arm Circles                │  │
│  │ 1 × 20 each direction     │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Main Work ──                 │
│  ┌────────────────────────────┐  │
│  │ Barbell Bench Press        │  │
│  │ 4 × 8 · 80kg · RPE 8      │  │
│  │ Rest 120s                  │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Incline Dumbbell Press     │  │
│  │ 3 × 10 · 30kg · RPE 7     │  │
│  │ Rest 90s                   │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Accessory ──                 │
│  ┌────────────────────────────┐  │
│  │ Tricep Pushdowns           │  │
│  │ 3 × 12 · RPE 6 · Rest 60s │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Cooldown ──                  │
│  ┌────────────────────────────┐  │
│  │ Chest Stretch              │  │
│  │ 2 × 30s hold              │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**Segment color coding**:
| Segment Type | Left Border Color | Label Color |
|---|---|---|
| WARM_UP | `border-l-orange-400` | `text-orange-600` |
| MAIN_WORK | `border-l-blue-400` | `text-blue-600` |
| ACCESSORY | `border-l-purple-400` | `text-purple-600` |
| CONDITIONING | `border-l-green-400` | `text-green-600` |
| COOLDOWN | `border-l-teal-400` | `text-teal-600` |

**Exercise card**: Exercise name (bold), sets × reps, load (if specified), RPE, RIR, rest time, notes.

---

### 3.6 Workout Screens (Athlete-Facing)

#### 3.6.1 Workout List

**Route**: `app/(app)/workouts/index.tsx`

**Purpose**: View scheduled, in-progress, and completed workouts.

**Layout**:
```
┌──────────────────────────────────┐
│  My Workouts                     │
│  This week's training            │
├──────────────────────────────────┤
│  [All] [Scheduled] [Completed]   │
│                                  │
│  ── Today, Mon Jul 8 ──          │
│  ┌────────────────────────────┐  │
│  │ Upper Body Push     SCHEDULED│
│  │ Strength Foundation        │  │
│  │ 5 exercises · Est. 60 min  │  │
│  │                    [Start] │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Wed, Jul 10 ──               │
│  ┌────────────────────────────┐  │
│  │ Lower Body          SCHEDULED│
│  │ Strength Foundation        │  │
│  │ 4 exercises · Est. 45 min  │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Completed ──                 │
│  ┌────────────────────────────┐  │
│  │ Full Body            COMPLETED│
│  │ Jul 6 · RPE 7 · 55 min     │  │
│  │ Notes: Felt strong today   │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/athletes` (stubbed — will return athlete's workout logs)
**Components**: PageHeader, Badge (status filter), Card, FlatList
**Status badges**: SCHEDULED (secondary), IN_PROGRESS (info + pulsing dot), COMPLETED (success + checkmark icon), MISSED (destructive + x icon)

#### 3.6.2 Active Workout Session

**Route**: `app/(app)/workouts/[id].tsx`

**Purpose**: In-session workout logging UI. Athlete logs sets as they complete them.

**Layout**:
```
┌══════════════════════════════════╗
║  ⏱ 32:15                        ║ ← Timer bar (sticky)
║  Upper Body Push                ║
╠══════════════════════════════════╣
║                                  ║
║  ── Warm-Up ──                   ║
║  ☑ Band Pull-Aparts             ║
║    2 × 15 ✓                     ║
║  ☑ Arm Circles                  ║
║    1 × 20 ✓                     ║
║                                  ║
║  ── Main Work ──                 ║
║  ▶ Barbell Bench Press          ║ ← Current exercise (highlighted)
║  ┌────────────────────────────┐ ║
║  │ Set 1: 80kg × 8  RPE 8  ✓ │ ║
║  │ Set 2: 80kg × 8  RPE 8  ✓ │ ║
║  │ Set 3: 80kg × 7  RPE 9  ✓ │ ║
║  │ Set 4: ▢▢▢               │ ║
║  │                             │ ║
║  │ [Log Set]                   │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ○ Incline Dumbbell Press       ║
║  ○ Tricep Pushdowns             ║
║  ○ Chest Stretch                ║
║                                  ║
╠══════════════════════════════════╣
║  Session RPE: [ 7 ]             ║ ← Bottom bar
║  Notes: ___________________     ║
║  ┌────────────────────────────┐ ║
║  │     Complete Workout       │ ║
║  └────────────────────────────┘ ║
╚══════════════════════════════════╝
```

**Timer feature**: Elapsed time since session start, auto-started when screen opens. Uses `setInterval` with seconds counter.

**Set logging**:
- Quick log: tap exercise → pre-filled with prescribed load/reps/RPE
- Edit log: tap a logged set to modify
- Add set: button below existing sets
- Mark complete: checkmark per exercise

**Completion**:
- Bottom bar: session RPE (1-10 slider or picker) + notes textarea
- Complete button: triggers `PATCH` to mark workout COMPLETED, saves `sessionRpe` and `notes`
- Confirmation: summary screen showing total sets, volume, duration

**States**:
- Loading session data (skeleton)
- Empty session (no exercises — error state)
- All exercises completed (show "All done!" with summary)

#### 3.6.3 Workout History

**Route**: `app/(app)/workouts/history.tsx`

**Purpose**: Calendar-based or list-based view of past workouts with stats.

**Layout**:
```
┌──────────────────────────────────┐
│  Workout History                 │
├──────────────────────────────────┤
│  ← Jul 2026                 →   │ ← Month selector
│  M  T  W  T  F  S  S            │
│           1  2  3  4  5         │
│  6  7  8  9  10 11 12          │
│  ●  ·  ●  ·  ●  ·  ·           │ ← Dots = workout days
│                                  │
│  ── Jul 8, 2026 ──               │
│  ┌────────────────────────────┐  │
│  │ Upper Body Push     COMPLETED│
│  │ RPE 7 · 55 min             │  │
│  │ Volume: 12,450 kg           │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Jul 6, 2026 ──               │
│  ┌────────────────────────────┐  │
│  │ Full Body            COMPLETED│
│  │ RPE 8 · 62 min             │  │
│  │ Volume: 14,200 kg           │  │
│  └────────────────────────────┘  │
│                                  │
│  ── Jul 3, 2026 ──               │
│  ┌────────────────────────────┐  │
│  │ Lower Body           MISSED │
│  │ Scheduled for 6:00 AM      │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**Components**: Calendar (custom simple calendar or install `react-native-calendars`), Card, Badge

---

### 3.7 Organization Settings Screens

#### 3.7.1 Organization Settings

**Route**: `app/(app)/org/settings.tsx`

**Purpose**: Edit organization name, slug, timezone, and advanced settings. OWNER or `org:update` permission required.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Profile                      │
├──────────────────────────────────┤
│  Organization Settings           │
│  Acme Fitness                   │
│                                  │
│  General                         │
│  ┌────────────────────────────┐  │
│  │ Name                       │  │
│  │ Acme Fitness               │  │
│  │ [Edit]                     │  │
│  ├────────────────────────────┤  │
│  │ Slug                       │  │
│  │ acme-fitness               │  │
│  │ [Edit]                     │  │
│  └────────────────────────────┘  │
│                                  │
│  Preferences                     │
│  ┌────────────────────────────┐  │
│  │ Timezone                   │  │
│  │ Africa/Nairobi        [Edit]│  │
│  ├────────────────────────────┤  │
│  │ Default Invite Role        │  │
│  │ Athlete               [Edit]│  │
│  ├────────────────────────────┤  │
│  │ Allow self-join            │  │
│  │ [========○========]  OFF   │  │ ← Switch
│  ├────────────────────────────┤  │
│  │ Require coach approval     │  │
│  │ [========○========]  OFF   │  │
│  └────────────────────────────┘  │
│                                  │
│  Danger Zone                     │
│  ┌────────────────────────────┐  │
│  │ Archive this organization  │  │
│  │ This action is irreversible│  │
│  │ [Archive Organization]     │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**:
- `PATCH /v1/organizations/current` — `{ name?, slug? }`
- `PATCH /v1/organizations/current/settings` — `{ timezone?, defaultInviteRole?, allowAthleteSelfJoin?, requireCoachApproval? }`
- `POST /v1/organizations/current/archive`
**Components**: Card, Input, Select, Switch, Button, Separator
**Permission**: Only visible to OWNER role. Hide for others (or show read-only).

**Editing pattern**: Tap "Edit" → inline field becomes editable or opens a modal/action sheet. Save on blur or explicit save button.

#### 3.7.2 Audit Log

**Route**: `app/(app)/org/audit-log.tsx`

**Purpose**: View all organization activity. OWNER only.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Settings                     │
├──────────────────────────────────┤
│  Audit Log                       │
│  Track all organization changes │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │ 🔍 Filter by action...     │  │
│  └────────────────────────────┘  │
│  [All] [Members] [Teams] [Settings]│
│                                  │
│  ┌────────────────────────────┐  │
│  │ member.role_changed        │  │
│  │ John Doe → Coach           │  │
│  │ by Jane (Owner)            │  │
│  │ 2 hours ago                │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ member.invited             │  │
│  │ sarah@email.com → Athlete  │  │
│  │ by Jane (Owner)            │  │
│  │ Yesterday                  │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/audit-events` — `{ action?, from?, to?, page, pageSize }`
**Components**: PageHeader, Input, Badge (action filter), Card, FlatList

---

### 3.8 Profile Screens

#### 3.8.1 Profile

**Route**: `app/(app)/profile/index.tsx`

**Purpose**: View own profile, switch organizations, access settings, sign out.

**Layout**:
```
┌──────────────────────────────────┐
│  Profile                         │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │       ┌────┐               │  │
│  │       │ JD │               │  │
│  │    Jane Doe                 │  │
│  │    jane@email.com          │  │
│  │    [Edit Profile]          │  │
│  └────────────────────────────┘  │
│                                  │
│  Organizations                   │
│  ┌────────────────────────────┐  │
│  │ Acme Fitness        OWNER  │  │
│  │ 12 members           ✓    │  │ ← Checkmark = active
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Side Project        COACH  │  │
│  │ 5 members                  │  │
│  └────────────────────────────┘  │
│                                  │
│  Settings                        │
│  ┌────────────────────────────┐  │
│  │ ⚙  Organization Settings   │  │
│  │ 📋 Audit Log (Owner)        │  │
│  │ 🔔 Notifications           │  │
│  │ 🎨 Appearance              │  │
│  │ ❓ Help & Support           │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │       Sign Out             │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `GET /v1/users/me`, `GET /v1/organizations`
**Components**: Avatar, Card, Badge, Button, Separator
**Org list**: Shows all org memberships. Tap to switch active org.
**Settings items**: Each is a tappable row with icon + label + chevron.

#### 3.8.2 Edit Profile

**Route**: `app/(app)/profile/edit.tsx`

**Purpose**: Edit own name and avatar.

**Layout**:
```
┌──────────────────────────────────┐
│  ← Cancel                 Save  │
├──────────────────────────────────┤
│  Edit Profile                    │
│                                  │
│          ┌────┐                  │
│          │ JD │                  │
│          └────┘                  │
│       [Change Photo]            │
│                                  │
│  Full Name                       │
│  ┌────────────────────────────┐  │
│  │  Jane Doe                  │  │
│  └────────────────────────────┘  │
│                                  │
│  Email                           │
│  ┌────────────────────────────┐  │
│  │  jane@email.com  (readonly)│  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

**API**: `PATCH /v1/users/me` — `{ fullName?, avatarUrl? }`
**Components**: Avatar, Input, Button

---

## Phase 4 — State Management & Data Flow

### 4.1 Zustand Stores

**Organization store** (`store/modules/organization.ts`):
```ts
interface OrganizationState {
  activeOrganizationId: string | null;
  organizations: Organization[];
  setActiveOrganization: (id: string) => void;
  setOrganizations: (orgs: Organization[]) => void;
}
```

**Auth store** (already partially handled by `AuthProvider` context — augment with registration state):
```ts
// Extend AuthProvider to expose:
// - registrationStatus
// - nextAction
// - memberships
// - permissions
```

### 4.2 React Query Keys

```
["health"]                                     → GET /v1/health
["session"]                                    → GET /v1/auth/me
["organizations"]                              → GET /v1/organizations
["organization", orgId]                        → GET /v1/organizations/current
["members", orgId, filters]                    → GET /v1/members
["member", orgId, membershipId]                → GET /v1/members/:id
["teams", orgId, filters]                      → GET /v1/teams
["team", orgId, teamId]                        → GET /v1/teams/:id
["programs", orgId]                            → GET /v1/programs
["program", orgId, programId]                  → GET /v1/programs/:id
["invitations", orgId, filters]                → GET /v1/invitations
["invitation", token]                          → GET /v1/invitations/:token/preview
["audit-events", orgId, filters]               → GET /v1/audit-events
```

### 4.3 API Client

Already configured at `http/client.ts`. Ensure it:
- Reads org ID from Zustand store and sends `x-organization-id` header
- Handles 401 responses (session expired → redirect to login)
- Handles 403 responses (permission denied → show error toast)
- Handles network errors gracefully

---

## Phase 5 — Implementation Order

### Week 1: Foundation
1. **Update tailwind.config.js** with full color system (Phase 0)
2. **Build Card component** (1.1)
3. **Enhance Button component** (1.2)
4. **Build Input component** (1.3)
5. **Build Badge component** (1.4)
6. **Build Avatar component** (1.5)
7. **Build Separator component** (1.6)
8. **Build Skeleton component** (1.7)
9. **Build PageHeader component** (1.8)
10. **Build Select component** (1.9)
11. **Build Tabs component** (1.10)
12. **Build Form components** (1.11)
13. **Build EmptyState component** (1.12)

### Week 2: Navigation + Auth
14. **Set up navigation structure** (Phase 2)
15. **Auth redirect logic** in `index.tsx`
16. **Login screen** (3.1.1)
17. **Onboarding — Profile** (3.1.2)
18. **Onboarding — Create Org** (3.1.3)
19. **Accept Invitation** (3.1.4)
20. **App shell / Tab layout** (3.2.1)
21. **Org switcher** (3.2.2)

### Week 3: Core Features
22. **Dashboard** (3.3)
23. **Member list** (3.4.1)
24. **Member detail** (3.4.2)
25. **Invite member** (3.4.3)
26. **Team list + detail + create** (3.4.4, 3.4.5)
27. **Profile screen** (3.8.1)
28. **Edit profile** (3.8.2)

### Week 4: Training + Settings
29. **Program list** (3.5.1)
30. **Program detail** (3.5.2)
31. **Session detail** (3.5.3)
32. **Workout list** (3.6.1)
33. **Active workout session** (3.6.2)
34. **Workout history** (3.6.3)
35. **Organization settings** (3.7.1)
36. **Audit log** (3.7.2)

---

## Appendix A — Icon Map

Mapping of UI concepts to `lucide-react-native` icons:

| Concept | Icon | Component |
|---|---|---|
| Dashboard/Home | `LayoutDashboard` | Tab bar |
| Members/Users | `Users` | Tab bar, member list |
| Programs/Training | `Dumbbell` | Tab bar, program list |
| Profile/Settings | `CircleUser` | Tab bar |
| Workouts | `Timer` | Tab bar, workout list |
| Add/Create | `Plus` | Buttons, FAB |
| Search | `Search` | Search inputs |
| Filter | `SlidersHorizontal` | Filter buttons |
| Edit | `Pencil` | Edit actions |
| Delete | `Trash2` | Delete actions |
| More options | `MoreHorizontal` or `Ellipsis` | Context menus |
| Close/Cancel | `X` | Modals, inputs |
| Back | `ArrowLeft` or `ChevronLeft` | Navigation |
| Forward | `ChevronRight` | List items |
| Check/Done | `Check` | Completion, success |
| Warning | `AlertTriangle` | Warnings, destructive |
| Info | `Info` | Information |
| Settings/Gear | `Settings` | Settings menu |
| Logout | `LogOut` | Sign out |
| Calendar | `Calendar` | Date pickers, history |
| Clock/Time | `Clock` | Timestamps |
| Mail/Email | `Mail` | Email fields |
| Organization/Building | `Building2` | Organization |
| Team/Group | `UsersRound` | Teams |
| Role/Badge | `Shield` | Roles, permissions |
| Invite | `UserPlus` | Invite member |
| Suspend | `UserX` | Suspend member |
| Archive | `Archive` | Archive actions |
| Upload | `Upload` | Image upload |
| Chevron Down | `ChevronDown` | Select dropdowns |
| Chevron Up | `ChevronUp` | Collapsible toggle |

---

## Appendix B — Color Reference for Statuses

**Membership Status**:
| Status | Badge Variant | Color |
|---|---|---|
| ACTIVE | `success` | `#22c55e` green |
| SUSPENDED | `warning` | `#f59e0b` amber |
| REVOKED | `destructive` | `#ef4444` red |

**Registration Status**:
| Status | Badge Variant | Color |
|---|---|---|
| PROFILE_INCOMPLETE | `warning` | `#f59e0b` amber |
| NEEDS_ORGANIZATION | `info` | `#3b82f6` blue |
| ACTIVE | `success` | `#22c55e` green |
| SUSPENDED | `destructive` | `#ef4444` red |

**Invitation Status**:
| Status | Badge Variant | Color |
|---|---|---|
| PENDING | `warning` | `#f59e0b` amber |
| ACCEPTED | `success` | `#22c55e` green |
| EXPIRED | `secondary` | `#f1f4f8` gray |
| REVOKED | `destructive` | `#ef4444` red |

**Workout Log Status**:
| Status | Badge Variant | Color |
|---|---|---|
| SCHEDULED | `secondary` | `#f0f4ff` light blue |
| IN_PROGRESS | `info` | `#3b82f6` blue, pulsing |
| COMPLETED | `success` | `#22c55e` green |
| MISSED | `destructive` | `#ef4444` red |

**Program Template Status**:
| Status | Badge Variant | Color |
|---|---|---|
| DRAFT | `secondary` | `#f1f4f8` gray |
| PUBLISHED | `success` | `#22c55e` green |
| ARCHIVED | `outline` | border, muted text |

**Organization Roles (color-coded for quick visual identification)**:
| Role | Badge Variant | Color |
|---|---|---|
| OWNER | `default` | `#1b1b41` navy |
| COACH | `info` | `#3b82f6` blue |
| ASSISTANT_COACH | `info` | `#60a5fa` lighter blue |
| ATHLETE | `secondary` | `#64748b` slate |
| TRIAL_USER | `warning` | `#f59e0b` amber |
| APPLICANT | `outline` | border |

---

## Appendix C — Responsive Considerations

Since this is a React Native app targeting phones primarily:

1. **No tablet-optimized layouts in Phase 1**. Default to single-column, full-width layouts.
2. **Use `SafeAreaView`** for all screens to handle notch/dynamic island and home indicator.
3. **Keyboard avoidance**: Use `KeyboardAvoidingView` with `behavior="padding"` on iOS for form screens.
4. **ScrollView vs FlatList**: Use `FlatList` for lists with >20 items (members, teams, programs). Use `ScrollView` for form screens and detail views.
5. **Pull-to-refresh**: Enable on all list screens via `refreshControl`.
6. **Infinite scroll**: Enable on member list and audit log via `onEndReached`.

---

## Appendix D — Error Handling Patterns

### API Errors
```tsx
// Pattern for mutation errors
const mutation = useMutation({
  mutationFn: (data) => apiClient.post("/v1/members/invite", data),
  onError: (error) => {
    if (error.status === 409) {
      toast.error("This email has already been invited.");
    } else if (error.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  },
  onSuccess: () => {
    toast.success("Invitation sent!");
    router.back();
  },
});
```

### Form Validation
```tsx
// Use zod schemas for all forms
const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["ATHLETE", "COACH", "ASSISTANT_COACH"]),
  teamId: z.string().uuid().optional(),
});

// Errors shown inline via FormMessage component
```

### Network Errors
- Show a persistent banner when offline (detect via `NetInfo`)
- Queue mutations locally if critical (future enhancement)
- Auto-retry GET queries (React Query handles this via `retry` config)

### Empty States
Always show EmptyState component instead of blank screen when a list is empty. Provide a contextual action button.

### Loading States
Always show skeletons that match the layout shape, not just a spinner. Use the Skeleton component for text lines, cards, avatars, and inputs.

