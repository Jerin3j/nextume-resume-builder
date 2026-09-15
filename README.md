# Nextume 🚀

Nextume is a full-stack AI career platform designed to help job seekers, engineers, and professionals build ATS-optimized resumes, calculate ATS compatibility scores, generate tailored cover letters, and launch online developer portfolios in minutes.

**Live Link**: [https://nextume-resume-builder.vercel.app/](https://nextume-resume-builder.vercel.app/)

---

## 🌟 Key Features

### 1. Resume Builder
* **Dynamic Builder**: Build ATS-friendly resumes with a powerful and easy-to-use interface.
* **Real-time Preview**: See changes instantly as you type and format your resume.
* **Export Options**: Download as PDF or DOCX format.

### 2. ATS Score Check
* **AI Analysis**: Calculate your ATS compatibility score against specific job descriptions.
* **Actionable Feedback**: Get insights and recommendations to improve your resume's match rate.

### 3. AI Cover Letter Creation (`/cover-letter`)
* **Resume-Aligned Personalization**: Creates tailored cover letters directly from your saved resume profiles or uploaded PDF resumes.
* **Customizations**: Customize tone and document depth, and personalize against pasted job descriptions.
* **Uploads**: Upload existing cover letters from your device in PDF, DOC, and DOCX formats.

### 4. Portfolio Creation
* **Developer Portfolios**: Launch stunning online portfolios generated automatically from your resume data.
* **Shareable Links**: Connect and share your portfolio with a unique link.

### 5. Secure Payments & Pro Features
* **Razorpay Integration**: Seamless payment processing using Razorpay for upgrading to Pro plans.
* **Pro Benefits**: Unlock additional AI generations, premium templates, and advanced customizations.

### 6. Authentication & Security
* **JWT Authentication**: Secure user authentication and authorization using JSON Web Tokens.
* **Email Setup**: Integrated email notifications and verification workflows.
* **ImageKit**: Cloud-based image management for profile pictures and portfolio assets.

### 7. Modern Pages & Community Hub
* **Community Hub (`/community`)**: Discussion channels and community stats.
* **Help & Support Center (`/support`)**: Searchable FAQ and interactive support tickets.
* **Legal Policies**: Comprehensive Privacy Policy (`/privacy`) and Terms & Conditions (`/terms`).

---

## 🛠️ Technology Stack

* **Frontend**: Next.js (App Router), React, TypeScript, Redux Toolkit, Tailwind CSS.
* **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL / MySQL / SQLite.
* **Third-Party Integrations**: OpenAI API, Razorpay, ImageKit, JWT, Email Integration.
* **Deployment**: Frontend deployed on **Vercel**, Backend deployed on **Render**.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* PostgreSQL / database configured via Prisma
* API Keys for OpenAI, Razorpay, ImageKit, and SMTP for Emails.

### 1. Server Setup (Backend)
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Client Setup (Frontend)
```bash
cd client
npm install
npm run dev
```

The application will be accessible locally at `http://localhost:3000`.

---

## 📄 License
MIT License. Built with ❤️ for professionals worldwide.
