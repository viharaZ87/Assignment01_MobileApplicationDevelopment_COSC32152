## Campus Tech Event & Workshop Explorer 🚀

Student Name: N. V. Aberathna  
Student ID : PS/2022/172  
Course: COST 32152 / COSC 32152 / BECS 32272 - Mobile Application Development  
Department: Department of Statistics & Computer Science, University of Kelaniya  



## 1. Project Overview & Problem Statement

### What is the application?

"Campus Tech Event & Workshop Explorer" is a high-performance cross-platform mobile application designed and built using "React Native" and "Expo Router". The application serves as a centralized hub for university students, faculty members, and tech enthusiasts to discover, filter, and bookmark upcoming hackathons, AI conferences, and hands-on developer workshops.

### What problem does it solve?
In university environments, event information is often scattered across social media groups, noticeboards, and messaging channels. Students frequently miss registration deadlines or workshops due to lack of a unified schedule. This application solves that problem by:
- Presenting all campus tech events in an engaging, categorized visual feed.
- Allowing instant category filtering through a customized Modal.
- Providing persistent bookmarking via shared global state.
- Triggering native Local Notifications as reminders when an event is bookmarked.
- Leveraging the native `AppState` API to monitor app activity and refresh data upon returning to the foreground.



## 2. Screen Architecture & Purpose
The application comprises "3 distinct functional screens" structured seamlessly using Expo Router:

1. Campus Events Feed (Home Tab) — src/app/(tabs)/index.js
   - Purpose: The primary landing feed displaying curated campus events using an optimized 'FlatList'.
   - Key Features: Shows event image banners, titles, dates, locations, category badges, and includes a category filter button triggering a slide-up Modal.

2. My Bookmarks (Favorites Tab) — src/app/(tabs)/favorites.js
   - Purpose: Displays all events the user has bookmarked for quick offline reference.
   - Key Features: Uses shared state to dynamically reflect additions/removals in real-time. Features an interactive **Empty State** view when no events are saved.

3. Event Details Screen (Nested Stack) — src/app/details/[id].js
   - Purpose: Deep-dive screen displaying comprehensive event information, speaker bios, timings, and action controls.
   - Key Features: Contains full back/dismiss navigation ('router.back()' and 'router.dismiss()'), interactive bookmark toggle button, and triggers 'expo-notifications'.


## 3. Core React Native Components Used

| Component | Implementation Location | Purpose & UX Consideration |
| :--- | :--- | :--- |
| **View** | Across all screens & layouts | Structural container implementing Flexbox styling and responsive UI boundaries. |
| **Text** | Across all screens | Typography rendering for titles, metadata, badges, and body descriptions. |
| **Image** | `index.js`, `favorites.js`, `[id].js` | Remote image rendering with caching and aspect ratio management. |
| **Pressable** | Cards, buttons, dismiss triggers | Touch responder providing state feedback upon tap (Laws of UX: Instant Feedback). |
| **FlatList** | `index.js`, `favorites.js` | Performance-optimized scrolling list rendering realistic hardcoded datasets. |
| **Modal** | `src/app/(tabs)/index.js` | Slide-up dialog overlay for category selection, demonstrating user control and error prevention. |
| **ScrollView** | `src/app/details/[id].js` | Vertical scroll container for in-depth event documentation and speaker bios. |

---

## 4. Expo Router & Navigation Structure

The app utilizes Expo Router's modern file-based routing architecture with nested layouts:

```text
src/
├── data/
│   └── events.js            # Hard-coded realistic event dataset
├── context/
│   └── FavoritesContext.js  # Global shared state provider (React Context + useState)
└── app/
    ├── _layout.tsx          # Root Stack navigator + AppState listener
    ├── (tabs)/
    │   ├── _layout.js       # Bottom Tab Navigator (Events & Bookmarks)
    │   ├── index.js         # Main Events feed + Filter Modal
    │   └── favorites.js     # Saved Bookmarks tab
    └── details/
        └── [id].js          # Nested Stack screen with dynamic route and back navigation
```


## 5. State Management Approach
Interactive state is managed globally using the **React Context API** ('createContext', 'useContext', and 'useState') in 'src/context/FavoritesContext.js':
- Wrapped at the root level ('src/app/_layout.tsx') so that bookmarking an event anywhere in the app immediately updates the badge count and list in the "Bookmarks Tab".
- Avoids prop drilling and adheres to standard React state management best practices.



## 6. AppState API Integration
Implemented in 'src/app/_layout.tsx' using React Native's 'AppState' API:

const subscription = AppState.addEventListener('change', (nextAppState) => {
  if (appState.current?.match(/inactive|background/) && nextAppState === 'active') {
    console.log('App has come to the FOREGROUND! Refreshing event feeds...');
  }
  appState.current = nextAppState;
});

- Listens for transitions between 'background'/'inactive' states and the 'active (foreground) state.
- Ensures the app is aware of user focus to refresh live event statuses and reminders.



## 7. Local Notifications Research & Implementation

Research Approach:
- Consulted the official Expo documentation for [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/).
- Analyzed permissions handling across Android and iOS platforms to ensure compliant notification dispatch.
- Implemented `Notifications.setNotificationHandler` to configure in-app presentation behavior (audio and banner alerts).

 Trigger Implementation:
When a user taps "Bookmark Event" in 'src/app/details/[id].js', the app verifies permissions and immediately schedules a notification:

await Notifications.scheduleNotificationAsync({
  content: {
    title: '🎉 Event Bookmarked!',
    body: 'You saved "${event.title}". We will remind you before it starts!,
    sound: true,
  },
  trigger: null, // Dispatched immediately
});

(In addition, an in-app visual notification banner renders on-screen to provide immediate positive feedback across all platforms).




## 8. Demonstration Video
- Video Link: "https://drive.google.com/file/d/1G6fFB5sO_kls-0xv8cum4i_Ee6EPgwRw/view?usp=sharing"
- Coverage in Video:
  - Walkthrough of hardcoded events with realistic data.
  - Tab navigation switching (Events Tab <-> Bookmarks Tab).
  - Opening the Category Filter Modal and filtering events.
  - Navigating to Event Details (Nested Stack) and testing Back/Dismiss buttons.
  - Adding/Removing an event from Bookmarks and demonstrating real-time state sync.
  - Local Notification triggering upon bookmarking.
  - AppState foreground/background event demonstration in terminal/console.
