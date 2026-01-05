# Flux GTD Architecture

## 1. Introduction

This document outlines the software architecture for Flux, a Getting Things Done (GTD) application specifically designed for individuals with ADHD. The architecture prioritizes simplicity, performance, and ease of use, aiming to provide a focused and uncluttered user experience.

## 2. Tech Stack

The application will be a client-side single-page application (SPA) with no backend, leveraging browser `localStorage` for all data persistence. This approach ensures simplicity, offline capability, and zero server-side costs.

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
-   **State Management**: Local state management within `script.js`.
-   **Data Persistence**: Browser `localStorage` API.
-   **Testing**:
    -   **Unit Testing**: Jest
    -   **End-to-End (E2E) Testing**: Playwright
-   **Linting/Formatting**: Prettier / ESLint (to be configured)
-   **Build/Dev Tools**: None required for this simple setup. We will serve files directly.

## 3. File Structure

The project will follow a simple, flat structure for now. As complexity grows, we can introduce component-based directories.

```
/
|-- index.html              # Main application HTML
|-- style.css               # All application styles
|-- script.js               # Core application logic
|-- ARCHITECTURE.md         # This document
|-- PRODUCT_REQUIREMENTS.md # Product requirements
|-- tests/                  # Directory for all tests
|   |-- unit/               # Unit tests
|   |   `-- script.spec.js
|   `-- e2e/                # E2E tests
|       `-- app.spec.js
|-- .gitignore
`-- package.json            # Project dependencies and scripts
```

## 4. Component Breakdown

The application UI is composed of several logical components, all managed within `script.js` and rendered into `index.html`.

-   **Sidebar (`<nav class="sidebar">`)**:
    -   Displays the logo and main navigation links (Inbox, Next Actions, etc.).
    -   Contains the Pomodoro Timer component.
    -   Dynamically updates task counts using badges.

-   **Main Content (`<main class="main-content">`)**:
    -   **Header**: Displays the title and description of the current view.
    -   **Quick Add Input**: The primary input field for capturing new tasks.
    -   **Task List (`<ul id="task-list">`)**:
        -   Renders the list of tasks based on the current view (`currentView`).
        -   Each `Task Item` is a sub-component with its own state (done/not done) and actions (move, delete).

-   **Pomodoro Timer (`<div class="timer-section">`)**:
    -   Displays the countdown timer.
    -   Provides controls to start focus/break sessions and to stop the timer.
    -   Handles the timer logic, including sending browser notifications.

## 5. Data Model

All application state is stored in the browser's `localStorage` under the key `flux_tasks`. The data is a single array of "task" objects.

### Task Object

A task object represents a single to-do item and has the following structure:

```json
{
  "id": 1678886400000,       // Unique identifier (timestamp)
  "text": "My new task",     // The content of the task
  "status": "inbox",          // Current status: 'inbox', 'next', 'waiting', or 'done'
  "createdAt": "2023-03-15T12:00:00.000Z" // ISO string of creation date
}
```

This simple, flat data structure is sufficient for the application's needs and avoids the complexity of relational data. All filtering and manipulation will be done on the client-side.
