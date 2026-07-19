# BLR Picnic Registration Portal

A modern, highly responsive, and full-featured web application designed for Bengaluru Mahatmas to register for the
upcoming picnic with Aptaputra Bhaiyo. The system provides a seamless multi-step registration flow, dynamic UPI/QR
payment generation with QR download capabilities, partial submission tracking, receipt upload, printable official
receipts, and a robust administrative control panel with analytical insights.

---

## 🌟 Key Features

### 1. Mahatma Registration & Flow

* **Multi-Step Stepper & Timeline Navigation:** Clear visual timeline tracking registration progress (**Attendee Details
  ** ➔ **Review Details** ➔ **Payment & QR** ➔ **Upload Receipt / Success**).
* **Smart Fields & Formatting:**
    * **Dynamic Alphabetic Validation:** Strict input filtering on names (blocks non-alphabet characters dynamically).
    * **Auto-Formatting:** Auto-converts attendee names to **Title Case** on field blur.
    * **Required Indicators:** Visual asterisk markers highlighting mandatory fields.
    * **Primary Contact Guidance:** The primary attendee is explicitly labeled with `(Primary Contact)` for clear
      registration guidance.
    * **Optional Family Phone Numbers:** Mobile numbers for subsequent attendees are optional, enabling easy family
      group registrations under one phone contact.
* **Age Group Selection & Fare Calculation:**
    * Per-attendee age group selection (`Under 8 Years` half fare vs `8 Years & Above` full fare).
    * Dynamic fare sum calculation based on individual attendee age categories.
    * Clear messaging indicating that the fare includes transportation and food (non-refundable).
* **Pickup Point Selection:**
    * Dropdown selector for bus pickup points across Bengaluru, sorted alphabetically (includes a "Self" travel option).
* **Form Persistence & History Navigation:**
    * Automatic form state caching via `sessionStorage` (`blr_picnic_registration_form`).
    * Custom browser history state integration (`pushState`/`popstate`) allowing seamless back/forward navigation
      between registration steps without page reloads or state loss.
* **Partial Submission Management:**
    * Automatically creates a draft registration record upon reaching the Payment step.
    * Smart deduplication: Prevents duplicate record creation when navigating back to the payment step without modifying
      details.
    * Auto-cleanup: Automatically removes outdated partial submissions if attendee details are updated.

---

### 2. Payment Section & QR Integration

* **Dynamic Amount Summing:** Automatically calculates total fare using per-attendee age-group rates.
* **UPI ID Direct Copy:** One-click copy button for configured UPI ID, optimized as a space-saving trigger for mobile
  viewports.
* **Enlarged QR Code Popup Modal:**
    * Interactive clickable scanning card launching a high-contrast `240px` QR code modal.
    * Includes payment instructions and contextual notes (`"Picnic Registration by {Primary Attendee Name}"`).
* **Download QR Code Image:**
    * Built-in button within the QR modal allowing users to download the QR code image directly.
* **Keyboard & Smooth Scroll UX:**
    * Press `ESC` key to instantly dismiss any open modal.
    * Auto-scrolls smoothly to the payment section / bottom of the page when advancing steps or closing popups.

---

### 3. Submission Confirmation & Receipt Upload

* **Receipt Upload Checklist:** Clean drag-and-drop or file browser trigger for uploading payment screenshots.
* **Visual Summary & Print Mode:** Displays a completion summary showing registered attendee names, contact details,
  selected pickup point, total amount paid, and unique registration ID, supported by a print-friendly layout.

---

### 4. Admin Control Panel (`/admin`)

* **Password Protected Access:** Secure session access control for administrators.
* **Stat Counters:** Live counter badges for Total Registrations, Verified count, Pending Verification count, and Total
  Collected Amount (hiding zero-count cards dynamically).
* **Visual Analytics & Breakdown Cards:**
    * **Gender Distribution Statistics:** Visual gender composition breakdown panel.
    * **Age Group Breakdown Statistics:** Visual distribution of attendees by age category.
    * **Pickup Point Analytics:** Location-wise attendee count breakdown.
* **Search & Multi-Column Sorting:**
    * Search registrations instantly by attendee name or mobile number with a quick clear search (`x`) button.
    * Multi-column sorting options (Sort by Submission Date or Mahatma Name).
* **Status Filtering:** Filter submissions by status tabs (*All*, *Pending*, *Verified*, *Cancelled*).
* **Official Printable Receipt Generator:**
    * Built-in printable receipt engine (`lib/receipt.ts`) reachable from the Admin Submission Details modal.
    * Generates clean, formatted official payment receipts ready for printing or saving as PDF.
* **Direct Call Action:** Click-to-call `tel:` link (styled as a green phone receiver icon) next to any attendee phone
  number for fast follow-ups.
* **Details Viewer & CSV Export:**
    * Modal details viewer with screenshot lightbox preview and keyboard `ESC` dismissal.
    * Export complete registration records and metadata to formatted CSV files.

---

### 5. Performance & Monitoring

* **Vercel Analytics & Speed Insights:** Integrated `@vercel/analytics` and `@vercel/speed-insights` for real-time web
  performance monitoring.

---

## 🛠️ Technical Stack

* **Core Framework:** Next.js 16.2 (App Router)
* **UI Library:** React 19
* **Programming Language:** TypeScript 5
* **Styling System:** Tailwind CSS v4 (with custom CSS tokens)
* **Icons Library:** Microsoft `@fluentui/react-icons` (Fluid/Fluent design guidelines)
* **Database & Auth:** Supabase (`@supabase/supabase-js`) with fallback Mock LocalStorage for offline development
* **QR Code Engine:** `qrcode.react` (SVG implementation)
* **Analytics:** `@vercel/analytics` & `@vercel/speed-insights`

---

## 📁 Project Structure

```bash
├── app/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminLogin.tsx             # Admin sign-in screen
│   │   │   ├── AdminStats.tsx             # Stat counters panel
│   │   │   ├── AgeStats.tsx               # Age group distribution analytics
│   │   │   ├── GenderStats.tsx            # Gender distribution analytics
│   │   │   ├── PickupPointStats.tsx       # Pickup point distribution analytics
│   │   │   ├── ScreenshotModal.tsx        # Receipt screenshot lightbox modal
│   │   │   └── SubmissionDetailsModal.tsx # Submission sheet, print receipt & phone launcher
│   │   ├── layout.tsx                     # Admin layout wrapper
│   │   └── page.tsx                       # Admin control panel main sheet
│   ├── api/
│   │   ├── admin/
│   │   │   └── submissions/
│   │   │       └── route.ts               # Admin API endpoints for status updates & queries
│   │   └── submissions/
│   │       └── route.ts                   # Public registration API endpoint (drafts & uploads)
│   ├── components/
│   │   ├── Alert.tsx                      # Toast & notification alert banner
│   │   ├── MahatmasForm.tsx               # Attendee input form (Title Case, age groups, rules)
│   │   ├── NotFoundClient.tsx             # Interactive 404 error page
│   │   ├── PaymentSection.tsx             # UPI & QR Code popup launcher (with QR download)
│   │   ├── PickupPointSelector.tsx        # Pickup point selection component
│   │   ├── RegistrationHeader.tsx         # Header banner & event information
│   │   ├── Stepper.tsx                    # Top timeline indicator
│   │   ├── SuccessView.tsx                # Completion summary & printable view
│   │   └── UploadSection.tsx               # Screenshot upload box
│   ├── layout.tsx                         # Global layout & Vercel Analytics integration
│   ├── globals.css                        # Tailwind v4 imports & color theme tokens
│   ├── page.tsx                           # Main registration wizard controller
│   └── not-found.tsx                      # 404 metadata page wrapper
├── lib/
│   ├── db.ts                              # Database abstraction (Supabase & Mock LocalStorage)
│   ├── privateConfig.ts                   # Contact list parser & private UPI configs
│   ├── publicConfig.ts                    # Public pricing, pickup points & date settings
│   ├── receipt.ts                         # Printable official receipt HTML generator
│   ├── supabase.ts                        # Supabase client initializer
│   └── supabaseAdmin.ts                   # Supabase admin/service role client
├── public/                                # Event banners & branding icons
└── supabase_schema.sql                    # Production Postgres database schema & RLS policies
```

---

## ⚙️ Configuration & Setup

Create a `.env.local` file in the root of the project:

```env
# Public Event Configurations
NEXT_PUBLIC_PICNIC_FARE=700
NEXT_PUBLIC_PICNIC_DATE="Saturday, July 25, 2026"
NEXT_PUBLIC_UPI_ID="name@upi"
NEXT_PUBLIC_UPI_NAME="Full Name"

# Contact Helpline List (Format: Name:Phone,Name:Phone)
NEXT_PUBLIC_CONTACTS="POC Name:9876543210"

# Database Configuration
# Set to true to bypass Supabase and write to browser LocalStorage instead
NEXT_PUBLIC_MOCK_DB=false
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Admin Access Credentials
ADMIN_PASSWORD="your-secure-admin-password"
```

### Database Schema Setup

If connecting to a production Supabase instance, execute the contents
of [supabase_schema.sql](file:///Users/divyanshgemini/playground/blr-picnic/supabase_schema.sql) in your Supabase SQL
Editor. This sets up:

1. The `registrations` table (including `pickup_point`, `people` JSON, `amount`, `screenshot_url`, and `status`).
2. Row-Level Security (RLS) policies allowing public anonymous submissions/updates for pending registrations and
   restricting full read/update permissions to authorized sessions.
3. Storage bucket `screenshots` with public read permissions and upload policies.

---

## 🚀 Running Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ymht-bangalore/blr-apt-picnic.git
   cd blr-apt-picnic
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
    * Open [http://localhost:3000](http://localhost:3000) to view the registration portal.
    * Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the administrative control panel.

4. **Verify Build:**
   ```bash
   npm run build
   ```
