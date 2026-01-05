# Flux GTD: Product Requirements Document (PRD)

## 1. Vision

To create a simple, intuitive, and visually calming Getting Things Done (GTD) web application that helps individuals with ADHD capture, organize, and execute tasks while minimizing distractions and promoting focus.

## 2. Target Audience & Persona

Our primary user is someone with ADHD who struggles with executive dysfunction. They find traditional productivity apps to be overly complex, visually cluttered, or distracting.

### Persona: Alex, The Creative Professional

-   **Age**: 28
-   **Occupation**: Graphic Designer
-   **Challenges**:
    -   Easily overwhelmed by large to-do lists.
    -   Struggles to start tasks (task initiation).
    -   Prone to distraction and losing track of time.
    -   Forgets ideas or tasks if not captured immediately.
    -   Finds complex interfaces and excessive notifications stressful.
-   **Goals**:
    -   A frictionless way to get thoughts out of their head.
    -   A clear, simple view of what to work on *right now*.
    -   Help with staying focused on a single task for a set period.
    -   A sense of accomplishment and control over their work.

## 3. Core Features & Requirements

### 3.1. Simple & Clean Aesthetic
-   **Requirement**: The UI must be minimalist, with a calm color palette, generous whitespace, and clear, readable typography. Avoid animations, badges, or UI elements that are not essential to the core workflow.
-   **User Story**: As Alex, I want a clean and uncluttered interface so I don't feel overwhelmed when I look at my tasks.

### 3.2. Task Organization (GTD Method)
-   **Requirement**: The application must support the basic GTD workflow with four distinct views:
    -   **Inbox**: A place to quickly capture any and all tasks. This is the default view.
    -   **Next Actions**: A curated list of tasks that are the immediate priority.
    -   **Waiting**: Tasks that are blocked or delegated to others.
    -   **Done**: A view of all completed tasks.
-   **User Story**: As Alex, I want to quickly type a thought into an "Inbox" without thinking about it, so I can process it later and not lose the idea.
-   **User Story**: As Alex, I want to move only a few critical tasks to "Next Actions" so I know exactly what to focus on without seeing my entire backlog.

### 3.3. Browser Notifications
-   **Requirement**: The application must use the native browser Notification API to provide timely, non-intrusive alerts.
    -   A notification must be sent when a Pomodoro timer (focus or break) completes.
    -   Notifications should be optional and require user permission.
    -   (Future) Consider a subtle notification for tasks that have been in the inbox for too long.
-   **User Story**: As Alex, when I'm deep in focus with the timer on, I want a gentle notification to tell me when it's time for a break, so I don't have to keep checking the clock.

### 3.4. Pomodoro Timer
-   **Requirement**: An integrated timer to help users focus in blocks of time.
    -   The timer should have three states: Focus (default 25 mins), Short Break (default 5 mins), and Long Break (default 15 mins - future).
    -   The timer display must be clear and always visible.
    -   When a timer completes, a notification is sent, and a subtle sound should play.
    -   The page `<title>` should reflect the current timer countdown.
-   **User Story**: As Alex, I want to use a built-in "Focus Timer" to commit to working on one "Next Action" for 25 minutes, helping me overcome the hurdle of starting a task.

## 4. Acceptance Criteria Summary

-   A user can add a task to the Inbox.
-   A user can move a task from the Inbox to "Next Actions" or "Waiting".
-   A user can mark a task as "Done" from any view.
-   A user can delete a task.
-   A user can start a 25-minute focus timer.
-   A user can start a 5-minute break timer.
-   A user receives a browser notification when a timer finishes.
-   The UI is clean, simple, and free of visual clutter.
-   All tasks are saved to `localStorage` and persist between sessions.
