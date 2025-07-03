
# NextGenAI Application Prompts

This file contains all the key prompts used to create the NextGenAI application, from the initial setup to the final features. This serves as a blueprint of the development process.

---

### 1. Initial Project Setup

**Prompt:** "Create a new Next.js project with Tailwind CSS and ShadCN UI components. The app should have a futuristic, AI-themed design with a dark mode default. Set up the basic layout with a header and footer."

**Context:** This laid the foundation of the project, establishing the technology stack and the overall aesthetic.

---

### 2. Building the Homepage

**Prompt:** "Create a stunning hero section for the homepage. It should have a 3D animated orb, a glowing title 'Welcome to NextGenAI by Parul', a typewriter effect for the subtitle 'Futuristic AI for the New Generation', and two call-to-action buttons: 'Try Now' and 'Join Us'."

**Context:** This prompt was used to build the most visually striking part of the application, designed to immediately capture user attention.

---

### 3. Showcasing Features

**Prompt:** "Add a section to the homepage that showcases the app's features. Use cards to display each feature with an icon, title, and description. The features are: Art Generator, AI Chatbot, Voice Generator, Smart Summarizer, AI Detector, and Auto-Coder Tool."

**Context:** This was to clearly communicate the app's core functionalities to the users right on the landing page.

---

### 4. Creating Plans & Pricing

**Prompt:** "Create a 'Plans & Pricing' section. It should have three plans: Free, Premium (₹499), and Ultra Premium (₹999). Each plan should be in a card showing its price and a list of features. The Premium and Ultra Premium cards should have a special border to make them stand out."

**Context:** This established the monetization model for the application.

---

### 5. Adding Navigation and Core Layout

**Prompt:** "Set up the main layout with a functional header and footer. The header should have navigation links, a theme toggle (dark/light mode), and user authentication buttons (Login/Sign Up/Profile). The footer should have company links and social media icons."

**Context:** This built the core navigation structure, making the app easy to browse.

---

### 6. Implementing the Payment & User System

**Prompt:** "Implement a user and payment system. Users should be able to sign up and log in using a mock system. On the plans page, the upgrade button should open a payment modal with a UPI QR code and ID. After payment, users can go to their profile page to submit a transaction ID for approval. Also, create a password-protected admin panel at `/admin` where I can view pending approvals and approve them."

**Context:** This was a complex prompt to create a full, end-to-end (though mock) user registration, payment, and admin verification flow.

---

### 7. Building a Functional User Dashboard

**Prompt:** "The user dashboard is empty. Populate it with useful information like a welcome message, usage statistics (e.g., 'Creations Made', 'Credits Remaining'), a monthly usage chart, and a gallery of the user's recent creations. Use mock data for now."

**Context:** This prompt was to make the logged-in experience valuable for the user by giving them a personalized and informative dashboard.

---

### 8. Creating the AI Feature Pages

**Prompt:** "Create separate pages for all the AI tools like Art Generator, Voice Generator, Chatbot, etc. For the Art Generator, build a form where users can input a prompt, select a style, and generate an image. For the other features, create 'Coming Soon' placeholder pages for now."

**Context:** This focused on building out the primary tool of the application—the Image Generator—while setting up the routes and placeholders for future features.

---

### 9. Fixing Technical Errors & Bugs

**Prompt:** "My app is crashing because of a missing Google API key. Please fix it. The app should not crash if the key is absent. Instead, it should use a placeholder for image generation and show a clear message to the user on other AI pages. Also, fix any Firebase configuration errors by making auth optional for now."

**Context:** This was a crucial debugging prompt to handle external service dependencies gracefully, ensuring the app remains stable even if keys are not configured.

---

### 10. Generating This Prompt File

**Prompt:** "Ab mujhe ye website banane ke liya jitna prompt dena chahiye wo prompt de a to z banane ke liye jesa prompt mujhe zarurat hoga bas wo prompt de" (Now, give me all the prompts that would be needed to build this website from A to Z, just the prompts I would need).

**Context:** This final prompt was to document the entire creation process by generating this very `PROMPTS.md` file.
