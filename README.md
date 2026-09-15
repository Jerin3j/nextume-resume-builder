# Nextume 🚀

Nextume is a full-stack AI career platform designed to help job seekers, engineers, and professionals build ATS-optimized resumes, calculate ATS compatibility scores, generate tailored cover letters, and launch online developer portfolios in minutes.

---

## 🌟 Key Features

### 1. AI Cover Letter Generator & Manager (`/cover-letter`)
* **Resume-Aligned Personalization**: Creates tailored cover letters directly from your saved resume profiles or uploaded PDF resumes.
* **Optional Job Information**: Company Name, Job Title, and Hiring Manager are completely optional. The platform gracefully applies smart defaults (`"Hiring Company"`, `"Job Position"`, `"Hiring Manager"`) if left blank.
* **Single Salutation Guarantee**: Eliminates duplicate greetings ("Dear Hiring Manager") across generations, preview canvases, PDF printouts, and DOCX downloads.
* **Pro Customizations**: Pro users can customize tone (*Professional*, *Friendly*, *Confident*, *Enthusiastic*, *Formal*, *Startup Style*), document depth (*Short*, *Medium*, *Detailed*), and personalize against pasted job descriptions.
* **Generation Limits**:
  * **Free Plan**: Up to 2 AI-generated cover letters in total (1 cover letter per resume).
  * **Pro Plan**: Up to 3 AI-generated cover letters per resume.
  * Clear UI indicators, disabled states, and upgrade prompts when limits are reached.
* **Unlimited External Cover Letter Uploads**:
  * Upload existing cover letters from your device in **PDF, DOC, and DOCX** formats.
  * Unlimited uploads available on **both Free and Pro plans**.
  * External uploads do **not** count towards the AI generation limit.
  * AI automatically parses and extracts Company Name, Job Title, and Hiring Manager from uploaded documents.

---

### 2. Modern Pages & Community Hub

* **Community Hub (`/community`)**:
  * Discussion channels (Resume Reviews, ATS Hacks, Interview Prep, Feature Requests).
  * Community stats, Discord & LinkedIn community integration, member testimonials, and participation guidelines.
* **Help & Support Center (`/support`)**:
  * Searchable FAQ accordion filtered by feature categories (Resume Builder, ATS Checker, Cover Letters, Portfolios, Billing & Pro).
  * Interactive contact support ticket form and direct support channels (`support@nextume.com`).
  * System operational status indicator.
* **Privacy Policy (`/privacy`)**:
  * Structured legal information layout covering data collection, GDPR & CCPA rights, and data encryption.
  * Strict AI privacy guarantees (no public model training on personal resumes).
* **Terms & Conditions (`/terms`)**:
  * Clean legal agreement covering account terms, intellectual property ownership of user content, Pro lifetime access terms, and liability disclaimers.

---

### 3. Navigation & Footer

* Global responsive footer linking to all core product areas (`/`, `/support`, `/pricing`, `/ats-score`, `/cover-letter`), resources (`/community`), and legal policies (`/privacy`, `/terms`).
* Optimized client-side routing via Next.js `Link` components.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, Tailwind CSS, Lucide Icons, React Hot Toast, Mammoth (DOCX parsing), react-pdftotext (PDF extraction).
* **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL / MySQL / SQLite, OpenAI API, Razorpay Payment Gateway.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* PostgreSQL / database configured via Prisma
* OpenAI API key

### 1. Server Setup
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📄 License
MIT License. Built with ❤️ for professionals worldwide.
