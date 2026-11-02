# SALVATION HERITAGE FACE ATTENDANCE SYSTEM - COMPLETE UI DOCUMENTATION

## 🎨 DESIGN SYSTEM

### Color Palette
- **Primary Blue**: `#3B82F6` (rgb(59, 130, 246))
- **Primary Emerald**: `#10B981` (rgb(16, 185, 129))
- **Teal Accent**: `#14B8A6` (rgb(20, 184, 166))
- **Background Dark**: `#0f172a` (Slate 950)
- **Card Background**: `#1e293b` (Slate 900)
- **Border Color**: `rgba(59, 130, 246, 0.3)` (Blue 30% opacity)
- **Text White**: `#ffffff`
- **Text Secondary**: `#cbd5e1` (Slate 300)
- **Text Muted**: `#64748b` (Slate 500)
- **Success Green**: `#10b981` (Emerald 500)
- **Warning Amber**: `#f59e0b` (Amber 500)
- **Error Rose**: `#f43f5e` (Rose 500)

### Typography
- **Font Family**: 'Inter', 'Segoe UI', sans-serif
- **Heading Font**: Font Serif for main titles
- **Headings**: 
  - H1: 4xl-7xl (56px-72px), font-black, tracking-tight
  - H2: 2xl-4xl (24px-36px), font-bold
  - H3: xl-2xl (20px-24px), font-bold
- **Body Text**: text-sm to text-base (14px-16px)
- **Small Text**: text-xs (12px)
- **Tiny Text**: text-[10px] to text-[11px]

### Spacing System
- **Mobile padding**: px-4 (16px)
- **Desktop padding**: px-6 (24px)
- **Section gaps**: gap-4 to gap-8 (16px-32px)
- **Border radius**: 
  - Small: rounded-xl (12px)
  - Medium: rounded-2xl (16px)
  - Large: rounded-3xl (24px)

### Animation System
- **Lottie Animations**: 5 custom JSON animations
- **CSS Animations**: 
  - `float`: Floating orbs (translateY oscillation)
  - `pulse`: Breathing glow effect
  - `spin`: Loading spinners
  - `glow-pulse`: Shadow pulsing
- **Transitions**: transition-all duration-300/700
- **Hover Effects**: scale-105, brightness changes

---

## 📱 PAGE 1: HOME PAGE (Attendance Kiosk)
**Route**: `/` (app/page.js)
**Purpose**: Main biometric attendance scanning kiosk for students

### Top Banner
- **Background**: Blue-900 to Emerald-900 gradient
- **Content**: "🏛️ Salvation Heritage Schools • Biometric Student Enrollment"
- **Height**: py-1.5 (6px padding)
- **Text**: text-[11px], font-semibold, white

### Navigation Bar
- **Position**: Sticky top-0, z-50
- **Background**: Slate-950/95 with backdrop-blur-xl
- **Border**: Bottom border slate-800/80
- **Height**: 64px (sm: 80px)

**Left Section**:
- Logo badge: 40x40px (sm: 48x48px), rounded-2xl, gradient blue-to-emerald
- Text: "SH" in white, font-black
- Title: "Salvation Heritage" - font-black, text-base (sm: text-lg)
- Badge: "Kiosk Mode" - emerald-500/20 background, text-[10px]

**Right Section** (Desktop):
- Navigation tabs in slate-900/80 rounded container
- Active: Green gradient background with shadow
- Links: Attendance Kiosk, Register, Faculty Login (with animated icons)

**Mobile Menu**:
- Hamburger icon (top right)
- Slide-in overlay menu with blue/emerald gradient background
- Full-screen mobile navigation with large touch targets

### Hero Section
- **Background**: Gradient from `#0B192C` → `#1E3E62` → `#042f2e`
- **Height**: py-6 to py-16 (responsive)
- **Animated Orbs**: 3 floating blur circles (blue, emerald, teal)
- **Grid Pattern**: Subtle dot grid overlay at 10% opacity

**Left Column (Flex-1)**:

1. **Status Badges**:
   - "Attendance Kiosk" badge: Emerald-300 text, emerald border, pulsing green dot
   - "Salvation Heritage" badge: Blue-to-emerald gradient

2. **Main Headline**:
   - Line 1: "Salvation" - White, 4xl-7xl, font-black, font-serif
   - Line 2: "Heritage" - Gradient text (blue-300 → emerald-200 → white)

3. **Description**:
   - Slate-200 text, 12px-16px
   - "Welcome, students and teachers! Position your face..."

4. **Faculty Portal Box**:
   - Slate-950/70 background with blue-400/30 border
   - Animated faculty icon (24px)
   - Title: "Faculty & Lecturer Portal" or "Welcome back, [Name]"
   - Button: Blue-to-emerald gradient with shadow
   - Sign out button (if logged in): Rose color scheme

5. **Live Clock Card**:
   - Slate-950/60 background with white/15 border
   - Time: 3xl-4xl font, tabular-nums, white
   - Date: Emerald-300, text-[10px], uppercase tracking

6. **Stats Grid** (3 cards):
   - Card 1: "[Count] Present Today" - Emerald theme, animated check icon
   - Card 2: "[%] Attendance Rate" - Blue theme, animated dashboard icon
   - Card 3: "[Count] Enrolled" - White theme, animated users icon
   - Each: Slate-950/60 background, colored borders, animated icons (24px)

**Right Column (Scanner Visual)**:
- Width: 256px to 448px (responsive)
- Outer glow: Blue→Emerald→Teal gradient blur with pulse animation
- Border: 2px white/30
- **Background Image**: /scanner.jpg with brightness(0.85)
- **Lottie Animation Overlay**: face-scan.json (248x248px, centered)
  - Animated scanning line moving vertically
  - Corner brackets in emerald
  - Pulsing scan effect with drop-shadow
- **"KIOSK LIVE" badge**: Top-left, pulsing green dot, emerald-300 text
- **Success checkmark**: Bottom-right, emerald-to-teal gradient, pulsing

### Main Content Section
- **Container**: max-w-7xl, px-4 to px-6
- **Grid**: 1 column (lg: 5 columns with 3-2 split)

**Camera Scanner Panel (Left - 3/5)**:
- **Header Bar**:
  - Pulsing emerald dot (12px)
  - Title: "Biometric Face Scanner"
  - Subtitle: "Salvation Heritage High-Precision AI"
  - Status badge: "Active" with animated icon
- **Camera Container**:
  - Video element: Full width, rounded-2xl
  - Emerald border glow when active
  - Real-time video feed from device camera
- **Action Button**:
  - "📸 Capture & Mark Attendance"
  - Full width, large touch target (py-3.5 to py-4)
  - Blue-to-emerald gradient with shadow
  - Loading state: Spinning icon + "Verifying biometric..."
  - Disabled state: Slate-700, cursor-not-allowed

**Results Panel (Right - 2/5)**:

*When No Attendance (Initial State)*:
- Card with blue-500/20 border
- "SH" badge icon (40px)
- Title: "Salvation Heritage Kiosk"
- 3 numbered instructions:
  1. "Look straight into the camera lens with good lighting"
  2. "Keep a neutral facial expression inside the emerald frame"
  3. "Click Capture & Mark Attendance to register your record"
- Each instruction in slate-950/60 cards with emerald number badges
- Call-to-action link: "Not yet enrolled? Register your face →" (emerald theme)

*When Attendance Marked (Success State)*:
- Emerald-950/80 background with gradient (emerald-500/40 border)
- **Success Animation**: Lottie animation (attendance-success.json, 96-128px)
  - Animated checkmark with pulse rings
  - Green celebration effect
- **Success Banner**:
  - "Attendance Marked!" or "Welcome Back!" heading (xl-2xl, font-black)
  - Subtext: "Successfully verified and logged" (emerald-300)
- **Student Photo**: 64-80px rounded square, emerald-500/50 border, shadow
- **Student Details**:
  - Full name: font-black, text-lg-xl, white
  - Student ID: Emerald-400, font-mono, tracking-wider
  - Department: Slate-300, text-xs
- **Details Grid** (2x2):
  - Student ID, Class, Term, Year Intake
  - Each in slate-950/70 cards
  - Labels: Slate-400, uppercase, text-[10px]
  - Values: White/Emerald, font-bold
- **Status Banner**:
  - Success: Emerald-500/10 bg, emerald-500/30 border, emerald-300 text
  - Already marked: Amber colors with "👋 Welcome back!" message

### Navigation Footer (Mobile)
- Bottom navigation with large touch icons
- Active state: Emerald gradient
- Icons: Home, Register, Admin, Students
- Badge counters on relevant icons

---

## 📝 PAGE 2: REGISTER PAGE (Student Enrollment)
**Route**: `/register` (app/register/page.js)
**Purpose**: Biometric face registration for new students

### Top Banner
- Same as home page: Blue-emerald gradient with school name

### Navigation Bar
- Same structure as home page
- "Registration" badge instead of "Kiosk Mode"
- Active state on "Register" tab

### Hero Section
- **Background**: Same gradient and animated orbs as home
- **Grid pattern overlay**: 48px grid with white/10 lines

**Left Column**:

1. **Status Badges**:
   - "Student Onboarding" badge with pulsing emerald dot
   - "Salvation Heritage" gradient badge

2. **Headline**:
   - "Student" - White, 4xl-7xl, font-serif
   - "Enrollment" - Blue-emerald gradient text

3. **Description**:
   - "Register your profile and biometric face token with Salvation Heritage security"
   - Slate-200, text-base-lg

4. **Feature Pills** (3 cards):
   - "🔐 Bank-Grade | Biometric AI"
   - "⚡ Instant | 3 Simple Steps"
   - "🛡️ Verified | Duplicate Guard"
   - Each: Slate-950/60, white/15 border, hover scale-105

**Right Column (Visual)**:
- Same size container as home page
- **Lottie Animation**: student-register.json
  - Animated student character with floating books
  - Sparkles and success checkmark animations
  - Golden/blue color scheme
  - 340px minimum height
- Gradient glow: Blue→Emerald→Teal with pulse
- Emerald corner brackets (8x8px each corner)
- "ENROLLMENT" badge: Top-left, pulsing
- Success badge: Bottom-right, bouncing checkmark

### Main Content (3-Column Layout on Desktop)

**Left Sidebar (1/3)**:

1. **Progress Card**:
   - "Enrollment Progress" heading
   - **Step Indicator** (3 steps):
     - Step 1: "Details" - Active: emerald gradient circle, Done: checkmark
     - Step 2: "Face" - Active during capture
     - Step 3: "Done" - Success state
   - Connecting lines between steps (slate-700)

2. **Guidelines Card**:
   - "Guidelines for Best Results" heading with 💡 icon
   - Bullet points in emerald-300:
     - "Ensure good lighting conditions"
     - "Look directly at the camera"
     - "Keep a neutral expression"
     - "Remove glasses if possible"
   - Each guideline in slate-900 rounded cards

3. **Security Badge Card**:
   - "🔐 Secure Enrollment" heading
   - Description of biometric protection
   - Slate-950/80 background

**Main Form Area (2/3)**:

*Step 1: Student Details Form*:

1. **Student ID Field**:
   - Auto-generated: SAL-[4 digits]
   - Read-only, blue-400 text
   - Lock icon
   - Format: SAL-XXXX
   - Hint: "Auto-generated unique Salvation Heritage ID"

2. **Full Name Field**:
   - Text input, white text on dark background
   - Validation: Min 3 letters, letters/spaces/'/-only
   - Error state: Rose border with warning icon
   - Placeholder: "Enter your full name"

3. **Class Dropdown**:
   - Options: JSS1, JSS2, JSS3, SS1, SS2, SS3
   - Blue-400 background on focus
   - Emerald checkmark when selected

4. **Year Intake Dropdown**:
   - Current year pre-selected
   - Options: 2020-2027
   - Blue theme

5. **Intake Month Dropdown**:
   - January pre-selected
   - All 12 months
   - Slate-950 background

6. **Term Dropdown**:
   - Options: 1st Term, 2nd Term, 3rd Term
   - Emerald theme when selected

**Field Styling**:
- Background: rgba(2, 6, 23, 0.8)
- Border: Blue-500/30
- Focus: Emerald glow with shadow
- Height: py-3 (48px touch target)
- Text: White, text-sm
- Labels: Slate-400, text-xs, uppercase, tracking-wider

**Validation Messages**:
- Error: Rose-400 with ⚠ icon
- Hint: Slate-500, text-xs

**Next Button**:
- "Continue to Face Capture →"
- Full width, emerald gradient
- Shadow with emerald-600/30
- Disabled: Slate-700 when form invalid

*Step 2: Face Capture*:

1. **Camera Panel**:
   - Title: "Capture Your Face"
   - Subtitle: "Position your face within the emerald frame"
   - CameraCapture component (full width)
   - Emerald overlay frame with corner brackets
   - Real-time video preview

2. **Capture Instructions**:
   - "Position Checklist" heading
   - ✓ "Face clearly visible"
   - ✓ "Good lighting"
   - ✓ "Neutral expression"
   - ✓ "No glasses/hats"

3. **Action Buttons**:
   - "📸 Capture Face Photo": Blue-emerald gradient, large
   - "← Back to Details": Slate outline button
   - "Retake Photo": Rose theme (if photo captured)

4. **Preview**:
   - Captured image preview (rounded-2xl, emerald border)
   - "Preview looks good?" text
   - Confirmation checkboxes

**Register Button**:
- "✅ Complete Registration"
- Full width, emerald-to-teal gradient
- Glow effect with shadow-emerald-600/40
- Loading state: "Processing biometric..." with spinner

*Step 3: Success State*:

1. **Success Animation**:
   - Large checkmark with pulse effect
   - Confetti or celebration animation
   - "Registration Complete!" heading (3xl, font-black)

2. **Student Card**:
   - Shows captured photo (128px)
   - Student ID in emerald-400
   - Full name in white
   - Class and term details
   - "Profile Active" badge

3. **Next Steps Card**:
   - "Visit the attendance kiosk to mark your first attendance"
   - "Your face is now enrolled in the system"
   - Button: "Go to Attendance Kiosk →"

4. **New Registration Link**:
   - "Register Another Student" button
   - Slate theme

### Duplicate Face Modal (Overlay)
*Appears if face already registered*:

- **Backdrop**: Slate-950/85 with backdrop-blur-md
- **Modal**: Slate-900, rounded-3xl, max-w-md
- **Header**: Blue-900/30 to Emerald-900/30 gradient
  - "🛡️" icon (text-5xl)
  - "Duplicate Face Detected!" heading
  - "Salvation Heritage Biometric Protection" subtitle
- **Content**:
  - "This face is already registered to:"
  - Existing student name (font-black, text-lg)
  - Student ID (font-mono, slate-400)
  - Match percentage: "[XX]% Biometric Match" (emerald-400)
  - Info box: Blue-500/10 background
    - "Each student may only be registered once"
- **Button**: "Understood" - Blue-to-emerald gradient, full width

---

## 👨‍🏫 PAGE 3: LECTURER PAGE (Faculty Portal)
**Route**: `/lecturer` (app/lecturer/page.js)
**Purpose**: Faculty attendance session management

### Authentication Flow

*Login Screen (Not Authenticated)*:
- **Hero Section**: Same gradient background with orbs
- **Centered Login Card**: max-w-md
  - "👨‍🏫" icon (text-6xl)
  - "Faculty Portal Login" heading (2xl, font-black)
  - "Salvation Heritage Academic Staff" subtitle (emerald-300)
  
  **Form Fields**:
  - Email: Text input, blue theme
  - Password: Password input with eye icon toggle
  - Both: Slate-950 background, blue-400/30 border
  
  **Login Button**:
  - "Sign In to Faculty Portal"
  - Blue-to-emerald gradient
  - Full width, py-3.5
  - Loading: Spinner + "Authenticating..."
  
  **Quick Login** (Development):
  - "Or test with: [faculty name]" buttons
  - Slate-800 background, hover: emerald theme
  - One-click faculty selection

### Main Dashboard (Authenticated)

**Top Bar**:
- Welcome message: "Welcome, [Faculty Name]"
- Department badge: Emerald-500/20 background
- Sign out button: Rose theme, top-right

**Faculty Info Card**:
- Profile display
- Name: font-black, xl
- Department and email
- "Active Session" badge if session running

### Tabs Navigation
- **Tab 1**: "📊 Attendance Session" (Active: emerald gradient)
- **Tab 2**: "📜 History & Reports" (Inactive: slate-800)
- Rounded-2xl container, p-1, slate-900/80 background

**Tab 1 Content: Attendance Session**

*Session Not Started State*:

1. **Create Session Card**:
   - "Start New Attendance Session" heading
   - Date picker: Today's date (read-only, blue theme)
   
   **Time Inputs**:
   - Start Time: Native time input, blue-400 text
   - End Time: Native time input, blue-400 text
   - Validation: End time must be after start time
   
   **Session Type Dropdown**:
   - Options: "Lecture", "Tutorial", "Lab", "Exam"
   - Blue-400 focus glow
   
   **Notes Textarea**:
   - Placeholder: "Optional session notes..."
   - Slate-950 background, white text
   - Rows: 3, rounded-xl
   
   **Start Button**:
   - "▶️ Start Attendance Session"
   - Blue-to-emerald gradient
   - Full width, py-4
   - Shadow with glow effect

*Session Active State*:

1. **Session Header**:
   - "Active Session" badge (emerald, pulsing dot)
   - Session date and time range
   - Session type badge
   - Elapsed time counter (updates every second)

2. **Quick Stats Row** (3 cards):
   - Card 1: "[X] Students Present" - Emerald theme
   - Card 2: "[X] Total Enrolled" - Blue theme
   - Card 3: "[XX]% Attendance Rate" - White theme
   - Each: Animated icons, large numbers (2xl, font-black)

3. **Live Attendance Roster**:
   - **Header**: "Real-Time Attendance Roster" with 🎯 icon
   - **Student List** (scrollable):
     Each student row:
     - Photo: 48px rounded square
     - Name: font-bold, white
     - Student ID: emerald-400, font-mono
     - Time marked: slate-400, text-xs
     - Status badge: "✓ Present" (emerald) or "⏱ Pending" (slate)
   - **Empty State**: "No attendance marked yet. Students can scan at the kiosk."
   
4. **End Session Button**:
   - "⏹ End Attendance Session"
   - Rose-to-red gradient
   - Confirmation modal before ending

**Tab 2 Content: History & Reports**

1. **Filters Bar**:
   - Date range picker
   - Session type filter
   - Class filter
   - Search box for student names
   - Apply button: Blue gradient

2. **Session Cards List**:
   Each past session card:
   - Date and time (font-bold, white)
   - Session type badge
   - Attendance summary: "X/Y students present (XX%)"
   - Progress bar: Emerald fill showing percentage
   - "View Details →" link (emerald-400)

3. **Session Detail Modal**:
   - Full session information
   - Complete student list with checkmarks
   - Export button: "Download Report (CSV)"
   - Print button: "Print Attendance Sheet"

---

## 🎛️ PAGE 4: DASHBOARD (Admin Panel)
**Route**: `/dashboard` (app/dashboard/page.js)
**Purpose**: Administrative overview and management

### Admin Guard
- **Login Required**: Redirects to /lecturer if not authenticated
- **Password Prompt**: "Enter admin password" modal

### Dashboard Layout

**Header Bar**:
- "🎯 Admin Dashboard" heading
- "Salvation Heritage Analytics" subtitle
- Date range selector: Last 7 days / 30 days / All time
- Export button: "📥 Export Data"

### Stats Grid (4 Cards)

1. **Total Students Card**:
   - Large number: "[XXX] Students" (3xl, font-black)
   - Animated dashboard icon (dashboard-stats.json, 64px)
   - Change indicator: "+X this month" (emerald or rose)
   - Background: Slate-900 with blue-500/20 border
   - Hover: Scale-105, glow effect

2. **Today's Attendance Card**:
   - Number and percentage
   - Animated check icon
   - "X/Y Present Today" subtext
   - Progress ring or bar
   - Emerald theme

3. **Weekly Average Card**:
   - "XX% Average" (large, font-black)
   - Line graph visualization
   - Trend arrow (up/down)
   - Blue theme

4. **Active Sessions Card**:
   - Number of active faculty sessions
   - Clock icon with pulse
   - "X Sessions Running" subtext
   - Teal theme

### Charts Section (2 Columns)

**Left: Attendance Trend Chart**:
- Line chart: Last 7/30 days
- X-axis: Dates
- Y-axis: Attendance percentage
- Blue-emerald gradient fill
- Gridlines: Slate-800
- Tooltip on hover with exact values

**Right: Class Distribution**:
- Bar chart or pie chart
- Each class with percentage
- Color-coded bars (blue spectrum)
- Labels with student counts

### Tables Section

**Recent Registrations Table**:
- Headers: Photo | Name | Student ID | Class | Date Registered
- Rows: 50px height, hover: slate-800
- Photo: 40px thumbnail
- Pagination: 10 per page
- Sort by: Date, Name, Class

**Attendance Records Table**:
- Headers: Date | Student | Time | Session | Faculty
- Rows with zebra striping
- Status badges: Present (emerald), Absent (rose)
- Filter dropdowns above table
- Search box: Real-time filtering

### Action Buttons Bar

- "➕ Add Student Manually": Blue gradient
- "📊 Generate Report": Emerald gradient
- "⚙️ System Settings": Slate-700
- "🗑️ Bulk Operations": Rose theme (dangerous)

### System Health Panel

- **API Status**: Green dot + "Backend Connected"
- **AWS Rekognition**: Green/Red status
- **Database**: Connection status
- **Last Sync**: Timestamp
- Refresh button

---

## 📊 PAGE 5: STUDENTS PAGE (Student Directory)
**Route**: `/students` (app/students/page.js)
**Purpose**: Browse and search all registered students

### Header
- "👥 Student Directory" heading (2xl, font-black)
- Total count: "XXX Students Enrolled" (emerald-400)

### Search and Filters Bar

**Search Box**:
- Placeholder: "Search by name or student ID..."
- White text on slate-950 background
- Magnifying glass icon (left)
- Clear button (right, appears when typing)
- Real-time filtering as you type

**Filter Dropdowns**:
- Class filter: All / JSS1 / JSS2 / etc.
- Term filter: All / 1st / 2nd / 3rd
- Year intake filter: All / 2020-2027
- Active/Inactive filter

**Sort Dropdown**:
- "Sort by: Name (A-Z)"
- Options: Name, Student ID, Recent, Class
- Blue-400 on hover

### Student Grid (Responsive)

**Layout**: Grid of cards
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Gap: gap-4 to gap-6

**Student Card**:
- **Photo**: 
  - 120px square at top
  - Rounded-2xl
  - Border: blue-500/30
  - Fallback: SVG with "?" if no photo
  
- **Content**:
  - Name: font-bold, text-base, white, truncate
  - Student ID: emerald-400, font-mono, text-sm
  - Class badge: Blue-500/20 background, text-xs
  - Term badge: Slate-700, text-xs
  
- **Footer**:
  - "Enrolled: [Date]" (slate-400, text-[10px])
  - Status dot: Green (active) or Gray (inactive)
  
- **Hover Effect**:
  - Scale-105
  - Glow shadow
  - Cursor pointer
  
- **Click Action**:
  - Opens student detail modal

### Student Detail Modal

**Modal Structure**:
- Backdrop: Slate-950/85 with blur
- Container: max-w-2xl, rounded-3xl
- Border: Blue-500/40

**Header**:
- Large photo: 160px rounded-2xl
- Name: 2xl, font-black
- Student ID: xl, emerald-400, font-mono
- Close button: Top-right, slate-600

**Tabs**:
- "Profile" (active by default)
- "Attendance History"
- "Sessions"

**Profile Tab**:
- Personal details grid:
  - Full Name
  - Student ID
  - Class
  - Term
  - Year Intake
  - Enrollment Date
  - Face Registered: ✓ Yes / ✗ No
- Each field in slate-900 rounded card

**Attendance History Tab**:
- Calendar view or list view toggle
- List of all attendance records:
  - Date
  - Time
  - Session type
  - Faculty name
  - Status (present/absent)
- Pagination: 20 per page
- Stats summary at top:
  - Total present: XX days
  - Total absent: XX days
  - Attendance rate: XX%

**Sessions Tab**:
- List of all sessions attended
- Grouped by month
- Each session shows date, faculty, type

**Action Buttons** (Bottom):
- "📊 Generate Report": Blue gradient
- "✏️ Edit Profile": Emerald gradient
- "🗑️ Delete Student": Rose theme (requires confirmation)

### Empty State
*When no students or no search results*:
- Centered message: "No students found"
- Illustration or icon
- "Register your first student →" button (if empty)
- "Try a different search" (if filtered)

---

## 🧩 SHARED COMPONENTS

### CameraCapture Component
**Location**: components/CameraCapture.js

**Structure**:
- Video element (mirrored for selfie view)
- Canvas (hidden, for capturing frames)
- Overlay frame (emerald border with corner brackets)

**States**:
- Loading: "Requesting camera access..." with spinner
- Ready: Live video feed
- Captured: Shows still image
- Error: Red border with error message

**Controls**:
- Capture button: Blue gradient, camera icon
- Retake button: Slate theme
- Switch camera button (if multiple cameras)

**Styling**:
- Rounded-2xl
- Aspect ratio: 4:3 or 16:9
- Max width: 640px
- Border: Emerald-500 when active

### AnimatedIcon Component
**Location**: components/AnimatedIcon.js

**Props**:
- `type`: Icon name (check, dashboard, users, faculty, live, etc.)
- `size`: 16px to 64px
- `className`: Additional Tailwind classes

**Available Icons**:
- Check: Animated checkmark
- Dashboard: Animated stats bars
- Users: Group of people
- Faculty: Teacher icon
- Live: Pulsing dot
- Camera: Camera with lens
- Clock: Animated clock hands
- Chart: Line graph animation

**Styling**:
- Inline display
- Vertical align: middle
- Smooth transitions

### LottieAnimation Component
**Location**: components/LottieAnimation.js

**Props**:
- `animationPath`: Path to JSON file
- `loop`: true/false
- `autoplay`: true/false
- `style`: Custom styles
- `className`: Tailwind classes

**Features**:
- Dynamic import (no SSR)
- Lazy loading
- Error handling
- Loading spinner while fetching

**Animations**:
- face-scan.json: Scanner with moving line
- student-register.json: Student with books
- attendance-success.json: Checkmark celebration
- dashboard-stats.json: Animated bar charts
- camera-scan.json: Camera focus frame

### LoadingSpinner Component
**States**:
- Small: 16px spinner
- Medium: 24px spinner (default)
- Large: 32px spinner
- Full screen overlay

**Styling**:
- Border: blue-500/30
- Border-top: blue-500
- Rounded-full
- Animate-spin

### DebugConsole Component
**Purpose**: Development debugging (hidden in production)

**Display**:
- Floating bottom-right
- Slate-950 background, 40% opacity
- Rounded-2xl
- Collapsible
- Shows API responses, errors, warnings

### Navbar Component
**Structure**:
- Sticky positioning
- Backdrop blur
- Mobile: Hamburger menu
- Desktop: Horizontal tabs

**Links**:
- Home (📸)
- Register (📝)
- Faculty (👨‍🏫)
- Dashboard (📊 🔒)
- Students (👥)

### ThemeWrapper Component
**Purpose**: Dark theme provider

**Features**:
- Context provider for theme
- Dark mode enforced
- Color scheme: dark

---

## 🎨 RESPONSIVE BREAKPOINTS

### Mobile First Design
- **xs**: 0-375px (iPhone SE, small phones)
- **sm**: 640px+ (Larger phones, phablets)
- **md**: 768px+ (Tablets portrait)
- **lg**: 1024px+ (Tablets landscape, small laptops)
- **xl**: 1280px+ (Desktops)
- **2xl**: 1536px+ (Large desktops)

### Mobile-Specific Classes
- `mobile-px-safe`: Padding with safe areas
- `mobile-hero-title`: Responsive hero text (2.5rem to 4rem)
- `xs-hero-title`: Extra small screens (2rem)
- `mobile-button`: 48px min height, large text
- `mobile-camera-container`: Full width, rounded corners
- `mobile-stats-grid`: 1 column grid
- `mobile-stats-item`: Compact stat display

### Touch Targets
- Minimum: 44x44px (iOS guidelines)
- Buttons: 48px height minimum
- Interactive elements: py-2.5 to py-4 (40-64px)

---

## 🌈 VISUAL EFFECTS

### Gradient Backgrounds
1. **Hero Gradient**: from-[#0B192C] via-[#1E3E62] to-[#042f2e]
2. **Button Gradient**: from-blue-600 via-blue-700 to-emerald-600
3. **Success Gradient**: from-emerald-600 to-teal-500
4. **Card Gradient**: from-slate-900 via-slate-800 to-slate-900

### Shadow Effects
- **Card Shadow**: shadow-2xl
- **Glow Shadow**: shadow-lg shadow-[color]/40
- **Hover Glow**: shadow-xl shadow-[color]/60

### Blur Effects
- **Backdrop Blur**: backdrop-blur-xl (24px)
- **Orb Blur**: blur-3xl (64px)
- **Glass Effect**: bg-[color]/60 backdrop-blur-md

### Border Effects
- **Primary Border**: border border-blue-500/30
- **Success Border**: border border-emerald-500/30
- **Glow Border**: border-2 border-white/30 with shadow

---

## 📱 MOBILE UX FEATURES

### Camera Permissions
- Request on mount
- Fallback message if denied
- Instructions for enabling in settings

### Touch Gestures
- Swipe to navigate tabs
- Pull to refresh (on lists)
- Long press for context menu (student cards)

### Native Inputs
- Date: Native date picker
- Time: Native time picker (not dropdown)
- File: Native file picker for photo upload

### Performance
- Lazy load animations (dynamic import)
- Image optimization with Next.js Image
- Debounced search inputs (300ms)
- Virtual scrolling for long lists

### Accessibility
- ARIA labels on all interactive elements
- Focus indicators (emerald ring)
- High contrast ratios (WCAG AA compliant)
- Keyboard navigation support

---

## 🎯 KEY USER FLOWS

### Student Attendance Flow
1. Home page loads → camera activates
2. Student positions face in frame
3. Clicks "Capture & Mark Attendance"
4. Backend verifies face (2-3 seconds)
5. Success screen with student details
6. Auto-reset after 5 seconds

### Registration Flow
1. Register page → Fill form (Step 1)
2. Click "Continue to Face Capture"
3. Capture face photo (Step 2)
4. Preview and confirm
5. Click "Complete Registration"
6. Success screen (Step 3)
7. Option to go to kiosk or register another

### Faculty Session Flow
1. Login to faculty portal
2. Create new session (date, times, type)
3. Click "Start Attendance Session"
4. Students mark attendance at kiosk
5. View live roster updating in real-time
6. Click "End Session" when done
7. View session in history

---

## 🔧 TECHNICAL NOTES

### State Management
- React hooks (useState, useEffect, useCallback)
- No Redux (component-level state only)
- Context API for theme

### API Integration
- lib/api.js handles all backend calls
- Base URL: process.env.NEXT_PUBLIC_API_URL
- Endpoints: recognizeFace, registerStudent, getStats, etc.
- Error handling with toast notifications

### Data Flow
- Client → PHP Backend → AWS Rekognition → MySQL
- Real-time updates via polling (every 5s for stats)
- No WebSockets (using REST API only)

### Environment Variables
- NEXT_PUBLIC_API_URL: Backend API URL
- Other configs in .env.local

### Build & Deploy
- Framework: Next.js 16.2.2 with Turbopack
- Deployment: Vercel (auto-deploy from GitHub)
- Production URL: https://ont-end-face-models.vercel.app
- Node version: Latest LTS

---

## 📋 ANIMATION DETAILS

### face-scan.json
- **Size**: 11.5 KB
- **Duration**: 3 seconds (90 frames at 30fps)
- **Colors**: Blue (#3B82F6), Emerald (#10B981)
- **Elements**:
  - Face circle outline (pulsing scale)
  - Scanning line (vertical movement)
  - 4 corner brackets (emerald)
  - Breathing animation (scale 0.8 to 1.0)

### student-register.json
- **Size**: 13.4 KB
- **Duration**: 4 seconds (120 frames at 30fps)
- **Colors**: Blue, Emerald, Gold
- **Elements**:
  - Student avatar (floating up/down)
  - Book (rotating slightly)
  - Checkmark (pop-in at 60 frames)
  - Sparkles (fading in/out)

### attendance-success.json
- **Size**: 10.3 KB
- **Duration**: 2 seconds (60 frames at 30fps)
- **Colors**: Emerald (#10B981)
- **Elements**:
  - Circle background (scale from 0)
  - Checkmark path (draw animation)
  - 2 pulse rings (expanding fade)

### dashboard-stats.json
- **Size**: 7.2 KB
- **Duration**: 3 seconds (90 frames at 30fps)
- **Colors**: Blue, Emerald, Blue-light
- **Elements**:
  - 3 bar charts (growing from 0)
  - Trend arrow (slide in + rotate)
  - Grid background

### camera-scan.json
- **Size**: 11.1 KB
- **Duration**: 2 seconds (60 frames at 30fps)
- **Colors**: Blue body, Emerald lens
- **Elements**:
  - Camera body (breathing pulse)
  - Lens (emerald glow)
  - Flash indicator (top)
  - Focus frame corners (appearing)

---

## 🎨 COMPLETE COLOR REFERENCE

```css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-emerald: #10B981;
--primary-teal: #14B8A6;

/* Background Colors */
--bg-darkest: #020617;    /* Slate 950 */
--bg-darker: #0f172a;     /* Slate 950 */
--bg-dark: #1e293b;       /* Slate 900 */
--bg-card: #334155;       /* Slate 700 */

/* Text Colors */
--text-white: #ffffff;
--text-light: #f1f5f9;    /* Slate 100 */
--text-secondary: #cbd5e1;/* Slate 300 */
--text-muted: #94a3b8;    /* Slate 400 */
--text-dim: #64748b;      /* Slate 500 */

/* Status Colors */
--success: #10b981;       /* Emerald 500 */
--warning: #f59e0b;       /* Amber 500 */
--error: #f43f5e;         /* Rose 500 */
--info: #3b82f6;          /* Blue 500 */

/* Border Colors */
--border-blue: rgba(59, 130, 246, 0.3);
--border-emerald: rgba(16, 185, 129, 0.3);
--border-white: rgba(255, 255, 255, 0.15);

/* Shadow Colors */
--shadow-blue: rgba(59, 130, 246, 0.3);
--shadow-emerald: rgba(16, 185, 129, 0.4);
--shadow-dark: rgba(0, 0, 0, 0.5);
```

---

## END OF DOCUMENTATION

This comprehensive UI documentation covers all pages, components, animations, colors, and interactions in the Salvation Heritage Face Attendance System. Use this as a complete reference for AI agents, developers, or designers working on the project.

**Last Updated**: November 1, 2026
**System Version**: 2.0 (with Lottie Animations)
**Framework**: Next.js 16.2.2
