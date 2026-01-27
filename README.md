# PAVE – Internship Roadmap Tracker

PAVE is a full-stack web application designed to plan, assign, track, and monitor internship learning roadmaps with clear role separation for Admins, Mentors, and Interns.

## What is PAVE?

PAVE helps organizations and mentors _pave a clear learning path for interns_ by:

- Structuring learning into roadmaps
- Breaking roadmaps into weekly modules
- Defining daily tasks
- Tracking intern progress in real time
- Enforcing strict role-based permissions

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios
- Context API (Authentication State)
- Deployed on Vercel

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Role-Based Access Control (RBAC)
- Deployed on Render

---

## Roles & Capabilities

### Admin

- Separate Admin login
- View all registered users
- Promote interns to mentors
- Full system-level control
- Admin role cannot be self-assigned

---

### Mentor

- Create learning roadmaps
- Edit & delete their own roadmaps
- Add, update, and delete modules (weeks)
- Add, update, and delete tasks (daily learning items)
- View & manage only roadmaps they created
- Secure mentor-only access with ownership validation

---

### Intern

- Register & login
- View available roadmaps
- Start a roadmap
- Track daily progress using checkboxes
- Dashboard sections:
  - Available Roadmaps
  - My Learning (In Progress)
  - Completed Roadmaps

---

## Security & Architecture

- JWT-based authentication
- Backend-enforced RBAC (Admin / Mentor / Intern)
- Ownership validation for roadmap operations
- Admin routes fully locked
- Environment variables for secrets
- SPA routing handled correctly in production

---

## Database Models

- **User** – name, email, password, role
- **Roadmap** – title, description, createdBy
- **Module** – roadmapId, title, order
- **Task** – moduleId, dayNumber, title, description
- **Progress** – userId, taskId, status

---

## Future Enhancements

- Progress analytics & visual charts
- Certificates on roadmap completion
- Mentor analytics dashboard
- Notifications & reminders
- UI/UX improvements & accessibility
- Admin-level roadmap moderation

---

## Author

**Jefson Jacob**  
GitHub: https://github.com/JJTK780
LinkedIn: https://www.linkedin.com/in/jefsonjacob/
