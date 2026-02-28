# Oil Workshop Management System - Project Instructions

## Project Overview

A cloud-based (local-storage) accounting and management system for a car oil change workshop. The entire UI is in Arabic with RTL (Right-to-Left) layout support.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with Slate and Orange accents
- **Database**: LocalStorage (local persistence)
- **State Management**: React Context + Hooks
- **Icons**: Lucide-React
- **Font**: Cairo (Google Fonts)
- **Forms**: React Hook Form + Zod validation

---

## Critical Instructions for AI Assistant

### Git Workflow - MANDATORY

**ALWAYS commit your work to Git and push to GitHub after completing any significant changes.**

#### Commit Rules:

1. **Before starting work**, ensure your working tree is clean
   ```bash
   git status
   ```

2. **After completing work**, always:
   ```bash
   git add .
   git commit -m "conventional commit message here"
   git push
   ```

3. **Use conventional commit messages**:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `refactor:` - Code refactoring
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

   Examples:
   - `feat: add product search and filter functionality`
   - `fix: resolve RTL layout issue on mobile devices`
   - `refactor: simplify inventory context state management`

4. **Commit frequently** - Don't batch unrelated changes. Group related changes into logical commits.

5. **Never skip pushing** - After every commit, push to GitHub immediately.

### Example Workflow

```bash
# Check status before starting
git status

# After making changes to inventory feature
git add .
git commit -m "feat: add batch inventory update functionality"
git push

# After fixing a bug
git add .
git commit -m "fix: correct price calculation in POS form"
git push
```

---

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

---

## Project Structure

```
/src
├── app/
│   ├── layout.tsx          # Root layout with RTL & Cairo font
│   ├── page.tsx            # Redirect to dashboard
│   ├── dashboard/page.tsx  # Dashboard with stats
│   ├── pos/page.tsx        # Point of Sale
│   ├── inventory/page.tsx  # Inventory management
│   ├── reports/page.tsx    # Sales reports
│   └── settings/page.tsx   # App settings
├── components/
│   ├── Sidebar.tsx         # Arabic RTL navigation
│   ├── MainLayout.tsx      # Layout wrapper
│   ├── StatsCard.tsx       # Dashboard stat card
│   ├── StockAlertList.tsx  # Low stock alerts
│   ├── POSForm.tsx         # POS form
│   ├── POSReceipt.tsx      # Receipt modal
│   ├── InventoryTable.tsx  # Inventory table
│   ├── ProductForm.tsx     # Add/Edit product modal
│   ├── SalesTable.tsx      # Sales history table
│   ├── SalesSummary.tsx    # Revenue/profit summary
│   └── DateRangePicker.tsx # Date range picker
├── contexts/
│   ├── InventoryContext.tsx
│   ├── SalesContext.tsx
│   └── SettingsContext.tsx
└── lib/
    ├── storage.ts          # LocalStorage utilities
    └── types.ts            # TypeScript interfaces
```

---

## Key Features

- **Full Arabic RTL support** with Cairo font
- **LocalStorage persistence** - all data saved locally
- **Dashboard** - Today's sales, cars served, stock alerts
- **POS** - Create services with auto-calculated pricing and receipt generation
- **Inventory** - Manage products with low stock alerts
- **Reports** - Date-filtered sales history with profit calculations
- **Settings** - Company info and tax rate configuration

---

## GitHub Repository

- **URL**: https://github.com/mohammed5355/oil-workshop
- **Branch**: `main`

---

## Notes

- All text must be in Arabic
- The entire UI uses RTL (Right-to-Left) layout
- Data persists in browser LocalStorage
- The app uses a dark theme with Slate colors and Orange accents
