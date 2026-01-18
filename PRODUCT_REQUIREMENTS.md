# Flux GTD: Product Requirements Document

## 1. Vision & Target Audience

- **Product Vision:** To create a simple, intuitive, and visually appealing "Getting Things Done" (GTD) application that helps users with ADHD capture, organize, and execute tasks without feeling overwhelmed.
- **Target Audience:** Students, professionals, and creatives with ADHD who need a straightforward tool to manage their daily tasks and improve their focus.

## 2. Core Features

### 2.1. Task Management (CRUD)
- **Description:** Users can add, view, update, and delete tasks.
- **User Stories:**
    - As a user, I want to quickly add a task to my inbox so I can capture ideas without breaking my flow.
    - As a user, I want to edit a task to correct typos or add more detail.
    - As a user, I want to delete tasks that are no longer relevant.
    - As a user, I want to mark a task as complete to track my progress.

### 2.2. GTD Task Organization
- **Description:** Tasks can be organized into four standard GTD categories: Inbox, Next Actions, Waiting, and Done.
- **User Stories:**
    - As a user, I want to move a task from the Inbox to "Next Actions" to prioritize what I need to do now.
    - As a user, I want to move a task to "Waiting" if I'm blocked or have delegated it.
    - As a user, I want to view all my completed tasks in a "Done" list for a sense of accomplishment.

### 2.3. Projects
- **Description:** Users can group tasks into projects.
- **User Stories:**
    - As a user, I want to create a new project to organize my tasks.
    - As a user, I want to assign a task to a project.
    - As a user, I want to view all tasks in a project.
    - As a user, I want to rename a project to better reflect its content.
    - As a user, I want to delete a project to remove it from my list.

### 2.4. Task Priorities
- **Description:** Users can assign a priority level to each task.
- **User Stories:**
    - As a user, I want to set a priority for a task (low, medium, high) to indicate its importance.
    - As a user, I want to see a visual indicator of a task's priority.

### 2.5. Due Dates
- **Description:** Users can add a due date to a task.
- **User Stories:**
    - As a user, I want to assign a due date to a task to keep track of deadlines.
    - As a user, I want to be notified when a task is approaching its due date.

### 2.6. Subtasks
- **Description:** Users can break down a task into smaller, more manageable subtasks.
- **User Stories:**
    - As a user, I want to add subtasks to a task to break it down into smaller steps.
    - As a user, I want to mark a subtask as complete.
    - As a user, I want to see the progress of a task based on its completed subtasks.

### 2.7. Search & Filtering
- **Description:** Users can search for tasks and filter them by various criteria.
- **User Stories:**
    - As a user, I want to search for a task by its title.
    - As a user, I want to filter tasks by their status, priority, or due date.

### 2.8. Pomodoro Timer
- **Description:** A built-in timer to help users focus on a single task for a set period.
- **User Stories:**
    - As a user, I want to start a 25-minute "focus" timer to work on a task without interruption.
    - As a user, I want to start a 5-minute "break" timer to rest between focus sessions.
    - As a user, I want to be able to stop or reset the timer at any time.

### 2.9. Browser Notifications
- **Description:** The application will use browser notifications to alert the user when a timer session is complete or a task is due.
- **User Stories:**
    - As a user, I want to receive a notification when my Pomodoro timer finishes so I know when to take a break.
    - As a user, I want to be asked for permission to send notifications when I first use the app.

### 2.10. Data Persistence
- **Description:** All tasks are saved in the browser's `localStorage`.
- **User Stories:**
    - As a user, I want my tasks to be saved automatically so I don't lose my work if I close the browser.
    - As a user, I want my tasks to be available immediately when I reopen the application.

## 3. Design & UI/UX

- **Aesthetic:** Clean, modern, and minimalist, with a dark theme to reduce eye strain.
- **Layout:** A two-column layout with navigation on the left and the main content on the right.
- **Interactivity:** Smooth animations and transitions to provide a responsive and engaging user experience.
- **Accessibility:** Adherence to WCAG 2.1 guidelines to ensure the application is usable for people with disabilities. This includes proper color contrast, keyboard navigation, and screen reader support.
- **Theming:**
    - As a user, I want to be able to switch between a light and dark theme to suit my preferences.

## 4. Non-Functional Requirements

- **Performance:** The application must be fast and responsive, with UI updates happening in real-time.
- **Security:** Since all data is stored client-side, there are no server-side security concerns.
- **Compatibility:** The application must be fully functional on the latest versions of modern web browsers (Chrome, Firefox, Safari, Edge).
- **Scalability:** While the application is designed to be simple, the codebase should be well-structured to allow for future feature additions.
