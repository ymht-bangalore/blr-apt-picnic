# BLR Picnic Registration Portal

A modern, highly responsive, and full-featured web application designed for Bengaluru Mahatmas to confirm their
registration for the upcoming picnic with Aptaputra Bhaiyo. The system provides a seamless step-by-step registration
flow, dynamic UPI/QR payment generation, receipt upload, and a robust administrative control panel.

---

## 🌟 Key Features

### 1. Mahatma Registration Flow

* **Multi-Step Stepper Navigation:** A clean visual timeline tracking registration progress (Attendee Details ➔ Payment
  ➔ Upload Receipt ➔ Success).
* **Smart Fields & Formatting:**
    * Strict alphabetic validation on names (blocks non-alphabet keys dynamically).
    * Auto-formatting to **Title Case** on field blur.
    * Asterisk markers indicating mandatory fields.
    * "Primary Contact" (first attendee) is labeled with `(You)` to guide the registrant.
    * Subsequent attendees' mobile numbers are **optional**, allowing families to register with a single phone contact.
* **Navigation validations:** Allows users to jump to the Payment step by clicking the circle stepper nodes, provided
  the input details are valid.

### 2. Payment Section & QR Integration

* **Dynamic Amount Calculation:** Automatically calculates the total fare using the fare-per-person rate times the
  number of attendees.
* **UPI ID Copy block:** Copy the configured UPI ID directly. The copy button is optimized as a space-saving icon-only
  trigger to keep the layout single-line on mobile views.
* **Scan QR Code card:** The card row is structured as a clickable settings-style button with a chevron `❯`. Clicking it
  opens a beautiful popup modal.
* **Enlarged QR Code Modal:** Displays a `240px` high-contrast scanning code (generated dynamically based on total
  amount and payee settings), featuring instructions and dismissing on outside/backdrop clicks.
* **Context-Specific Payment Note:** The generated UPI link embeds a custom transaction description matching
  `"Picnic Registration by {Primary Attendee Name}"` for easy payment matching.
* **Smooth Page Transitions:** Automatically smooth-scrolls directly to the payment section when moving to Step 2.

### 3. Submission Confirmation

* **File Upload Checklist:** Simple drag-and-drop or file selector to attach the transaction receipt.
* **Visual Success Page:** Displays confirmation message, auto-scrolls the window to the top on load, and provides a
  clear breakdown of registered names, contact numbers, total amount paid, and unique registration ID, with a print
  friendly stylesheet.

### 4. Admin Dashboard (`/admin`)

* **Password Protected:** Secure session access control.
* **Dynamic Stat counters:** Total registrations, confirmed count, pending verification count, and total collected
  amount.
* **Interactive Filter Options:** Filter submissions instantly by status: *All*, *Pending*, *Verified*, or *Cancelled*.
* **Live Search with Dismiss Option:** Search by attendee name or mobile number with an instant "Clear Search" (`x`)
  button.
* **Call Button:** Direct click-to-call `tel:` link (styled as a green phone receiver icon) next to any attendee who
  provided a phone number, allowing quick follow-ups.
* **Details Popup:** A spacious modal details viewer (with increased scroll limits of `320px` for attendee rows and
  `550px` minimum height) that closes on outside click.
* **CSV Export:** Generate and download a formatted CSV list of registrations including all attendee metadata.

---

## 🛠️ Technical Stack

* **Core Framework:** Next.js 16.2 (App Router)
* **Programming Language:** TypeScript
* **Styling System:** Tailwind CSS v4 (with custom vanilla themes and CSS variables)
* **Icons Library:** Microsoft `@fluentui/react-icons` (Fluid/Fluent design guidelines)
* **Database & Auth:** Supabase (PostgreSQL client) & fallback Mock LocalStorage for offline development
* **QR Generation:** `qrcode.react` (SVG implementation)

---

## 📁 Project Structure

```bash
├── app/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminLogin.tsx             # Admin sign-in screen
│   │   │   ├── AdminStats.tsx             # Stats counter panel
│   │   │   ├── ScreenshotModal.tsx        # Receipt viewer lightbox
│   │   │   └── SubmissionDetailsModal.tsx # Full submission sheet & call launcher
│   │   ├── layout.tsx                     # Layout setting route metadata
│   │   └── page.tsx                       # Admin control panel main sheet
│   ├── components/
│   │   ├── MahatmasForm.tsx               # Details input form (fields, Title Case, etc.)
│   │   ├── NotFoundClient.tsx             # Interactive 404 error component
│   │   ├── PaymentSection.tsx             # UPI & QR Popup modal launcher
│   │   ├── RegistrationHeader.tsx         # Neutral banner and picnic description
│   │   ├── Stepper.tsx                    # Top timeline indicator
│   │   └── SuccessView.tsx                # Completion print summary & auto-scroll
│   ├── layout.tsx                         # Global layout wrapper
│   ├── globals.css                        # Tailwind v4 imports & color theme tokens
│   ├── page.tsx                           # Registration wizard controller
│   └── not-found.tsx                      # Server-side 404 metadata page wrapper
├── lib/
│   ├── db.ts                              # Supabase database & mock storage wrapper
│   ├── privateConfig.ts                   # Server-side UPI configs
│   └── publicConfig.ts                    # Public pricing and dates configurations
├── public/                                # Banner images & branding icons
└── supabase_schema.sql                    # Production Postgres database schema setup
```

---

## ⚙️ Configuration & Setup

Create a `.env.local` file in the root of the project:

```env
# Public configurations
NEXT_PUBLIC_PICNIC_FARE=300
NEXT_PUBLIC_PICNIC_DATE="Sunday, July 26, 2026"
NEXT_PUBLIC_UPI_ID="mahatma@upi"
NEXT_PUBLIC_PAYEE_NAME="Bangalore Mahatma Picnic Fund"

# Database Configuration
# Set to true to bypass Supabase and write to browser LocalStorage instead
NEXT_PUBLIC_MOCK_DB=false
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Admin Access Credentials
ADMIN_PASSWORD="your-secure-admin-password"
```

### Database Schema Setup

If connecting to a production Supabase instance, execute the contents
of [supabase_schema.sql](file:///Users/divyanshgemini/playground/blr-picnic/supabase_schema.sql) in your Supabase SQL
Editor. This initializes:

1. The `registrations` table.
2. Row-Level Security (RLS) policies allowing public anonymous submissions but restricting read/update operations to
   authenticated/authorized views.

---

## 🚀 Running Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ymht-bangalore/blr-apt-picnic.git
   cd blr-picnic
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the registration portal.
   Visit [http://localhost:3000/admin](http://localhost:3000/admin) to view the administration panel.

4. **Verify Build:**
   ```bash
   npm run build
   ```
