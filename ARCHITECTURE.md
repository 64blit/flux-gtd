# Flux GTD: System Architecture

## 1. Core Philosophy & Constraints

- **Focus:** ADHD-friendly, minimalist, and distraction-free.
- **Platform:** Client-side only single-page application (SPA).
- **Persistence:** All data is stored in the browser's `localStorage`. No backend or database is required.
- **Simplicity:** Built with vanilla HTML, CSS, and modern JavaScript (ES6+). No frameworks are to be used to keep the codebase lightweight and maintainable.

## 2. Technology Stack

- **Frontend:**
    - **HTML5:** For semantic structure.
    - **CSS3:** For styling, using custom properties (variables) for theming.
    - **JavaScript (ES6+):** For all application logic.
- **Testing:**
    - **Jest:** For unit and integration testing of individual functions and components.
    - **Playwright:** For end-to-end testing to simulate user interactions and verify application flow.
- **Tooling:**
    - **Prettier:** For consistent code formatting.
    - **ESLint:** For identifying and fixing code quality issues.

## 3. Application Components

The application is divided into logical components, each managed within `script.js`.

- **State Management (`state.js`):**
    - A single source of truth for application state, including tasks, projects, and user settings.
    - Functions for initializing, saving, and loading state from `localStorage`.
- **UI Rendering (`ui.js`):**
    - Handles all DOM manipulation.
    - `renderTasks()`: Renders the task list based on the current view, filters, and search queries.
    - `renderProjects()`: Renders the list of projects in the navigation.
    - `updateCounts()`: Updates the task counts in the navigation sidebar.
    - `updateTimerDisplay()`: Updates the Pomodoro timer display.
- **Event Handling (`events.js`):**
    - Contains all event listeners and handlers for user interactions.
    - `handleTaskInput()`: Manages the "Enter" key press to add a new task.
    - `handleNavClick()`: Switches between different views (Inbox, Next, etc.).
    - `handleProjectClick()`: Filters tasks by the selected project.
    - `handleProjectAction()`: Manages rename/delete actions for projects.
    - `handleSearchInput()`: Filters tasks based on user input.
- **Core Logic (`main.js`):**
    - `addTask()`: Creates a new task object and adds it to the state.
    - `addProject()`: Creates a new project and adds it to the state.
    - `renameProject()`: Updates the name of an existing project.
    - `deleteProject()`: Removes a project and handles its tasks (e.g., delete or move to inbox).
    - `moveTask()`: Changes the status of a task.
    - `deleteTask()`: Removes a task from the state.
    - `startTimer()`, `resetTimer()`: Controls the Pomodoro timer.
    - `notify()`: Handles browser notifications.
- **Theming (`theme.js`):**
    - Manages the application's theme, including switching between light and dark modes.
    - `setTheme()`: Applies the selected theme to the application.
    - `loadTheme()`: Loads the user's preferred theme from `localStorage`.

## 4. Data Model

All data is stored in `localStorage` under two keys: `flux_tasks` and `flux_projects`.

### Task Object Structure

```json
{
  "id": 1672532400000,
  "text": "Design the application architecture",
  "status": "inbox",
  "priority": "medium",
  "dueDate": "2023-01-15T00:00:00.000Z",
  "projectId": 1,
  "subtasks": [
    { "id": 1, "text": "Define the data model", "done": false },
    { "id": 2, "text": "Create component diagram", "done": true }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

- **id:** `number` (timestamp) - Unique identifier for the task.
- **text:** `string` - The content of the task.
- **status:** `string` - The current state of the task (`inbox`, `next`, `waiting`, `done`).
- **priority:** `string` - The priority of the task (`low`, `medium`, `high`).
- **dueDate:** `string` (ISO 8601) - The date and time the task is due.
- **projectId:** `number` - The ID of the project the task belongs to.
- **subtasks:** `array` - A list of subtasks associated with the main task.
- **createdAt:** `string` (ISO 8601) - The date and time the task was created.

### Project Object Structure

```json
{
  "id": 1,
  "name": "Q1 Sprint",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

- **id:** `number` - Unique identifier for the project.
- **name:** `string` - The name of the project.
- **createdAt:** `string` (ISO 8601) - The date and time the project was created.

## 5. Development Workflow

The development process will follow a feature-driven approach.

1. **Architecture & PRD:** Define the system architecture and product requirements.
2. **Feature Implementation:** Each feature will be developed on a separate branch (e.g., `feature/task-organization`).
3. **Testing:** After a feature is implemented, a corresponding testing phase will be initiated on a new branch (e.g., `test/task-organization`).
4. **Pull Request & Review:** Once tests are complete and passing, a pull request will be opened for review.
5. **Merge:** After approval, the feature and its tests will be merged into the `main` branch.
6. **Iteration:** The process will repeat for the next feature until the application is complete.
