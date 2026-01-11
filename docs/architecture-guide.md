# SIMPKES Architecture & Implementation Guide

## 1. Tech Stack Recommendation

Based on your current workspace configuration (Next.js 16, React 19, Tailwind v4) and the requirement for a cost-effective, maintainable system for a small team, here is the recommended stack:

| Component | Recommendation | Reasoning |
|-----------|----------------|-----------|
| **Framework** | **Next.js 16 (App Router)** | Already in use. Provides unified frontend/backend, Server Actions for mutations, and excellent performance. |
| **Language** | **TypeScript** | Type safety is critical for preserving "budget" and "status" logic integrity. |
| **UI Library** | **Shadcn/ui + Tailwind CSS** | Already in use. Best-in-class for accessibility and rapid development. |
| **Database** | **PostgreSQL (via Supabase)** | Robust relational DB. Supabase offers a generous free tier, built-in backups, and easy management. |
| **ORM** | **Prisma** | Excellent developer experience for defining schemas and type-safe queries. Works great with Next.js specific patterns. |
| **Authentication** | **NextAuth.js (Auth.js) v5** | Seamless integration with Next.js 16. Can use simple credentials or OAuth providers. Flexible role management. |
| **File Storage** | **Supabase Storage** | (Or UploadThing). Simplifies the "Image Upload" requirement for damage details and receipts. |
| **Forms** | **React Hook Form + Zod** | Already in use. Standard for validating complex inputs like "Maintenance Requests". |

### Why this stack?
- **Speed**: You don't need a separate backend API (Node/Express/Python). Next.js Server Actions handle the API logic directly.
- **Cost**: Vercel (hosting) + Supabase (DB/Storage) have free tiers sufficient for internal hospital tools.
- **Maintenance**: Prisma ensures your database changes are tracked and safe.

---

## 2. Database Schema (ERD Concept)

This schema links Users, Assets, Requests, and Budget tracking.

### Tables Overview

#### `User`
*System actors (Employees, Admins, Approvers).*
- `id` (PK, UUID)
- `email` (Unique)
- `name`
- `role` (Enum: EMPLOYEE, ADMIN, APPROVER, VIEWER)
- `createdAt`

#### `Asset`
*The equipment being tracked.*
- `id` (PK, UUID)
- `code` (String, Unique) - e.g., "AST-001"
- `name` (String)
- `category` (String) - e.g., "Medical", "Office", "IT"
- `location` (String)
- `purchaseDate` (DateTime)
- `condition` (Enum: GOOD, DAMAGED, REPAIRING, RETIRED)
- `imageUrl` (String, Optional)
- `createdAt`

#### `BudgetPeriod`
*Fiscal year budgets to track total spend.*
- `id` (PK, UUID)
- `name` (String) - e.g., "Fiscal Year 2024"
- `startDate` (DateTime)
- `endDate` (DateTime)
- `totalAmount` (Decimal) - The max budget.
- `status` (Enum: ACTIVE, CLOSED)

#### `MaintenanceRequest`
*The core transactional record.*
- `id` (PK, UUID)
- `requesterId` (FK -> User)
- `assetId` (FK -> Asset)
- `budgetPeriodId` (FK -> BudgetPeriod) - Optional, linked on approval.
- `description` (Text)
- `urgency` (Enum: LOW, MEDIUM, HIGH, CRITICAL)
- `status` (Enum: PENDING, VERIFIED, APPROVED, REJECTED, IN_PROGRESS, COMPLETED)
- `reportPhotoUrl` (String) - Photo user uploads of damage.
- `submittedAt` (DateTime)
- `estimatedCost` (Decimal, Nullable) - Filled by Admin during Verify.
- `technicalNote` (Text, Nullable) - Filled by Admin during Verify.
- `approvedByUserId` (FK -> User, Nullable)
- `approvedAt` (DateTime, Nullable)
- `realizedCost` (Decimal, Nullable) - Filled by Admin during Execution.
- `completionProofUrl` (String, Nullable) - Receipt/Photo of repair.
- `completedAt` (DateTime, Nullable)

---

## 3. Key API / Server Action Structures

Since we are using Next.js 16, we will primarily use **Server Actions** for mutations and **Data Fetching** functions for reading, rather than traditional REST endpoints. However, conceptually, these are the operations:

### 1. Asset Management
- **GET** `/assets` - List all assets (Search/Filter by location, category).
- **GET** `/assets/:id` - View details + Maintenance history.
- **POST** `/assets` - Create new asset.
- **PATCH** `/assets/:id` - Update details/condition.

### 2. Maintenance Workflow (The Core Loop)

- **Submission (Step 1)**
  - `createMaintenanceRequest(data)`:
    - Input: `assetId`, `description`, `urgency`, `photo`.
    - Logic: Validate, Upload Image, entry in DB with status `PENDING`.

- **Verification (Step 2 - Admin)**
  - `verifyRequest(requestId, data)`:
    - Input: `estimatedCost`, `technicalNote`.
    - Logic: Update status to `VERIFIED`.

- **Approval (Step 3 - Manager)**
  - `approveRequest(requestId)`:
    - Logic: Check `BudgetPeriod` available funds. If OK, status `APPROVED`.
  - `rejectRequest(requestId, reason)`:
    - Logic: Status `REJECTED`.

- **Execution (Step 4 - Admin/Technician)**
  - `startMaintenance(requestId)`:
    - Logic: Status `IN_PROGRESS`.
  - `completeMaintenance(requestId, data)`:
    - Input: `realizedCost`, `proofPhoto`.
    - Logic: Update status `COMPLETED`. Update `Asset` condition to `GOOD`. Deduct from live dashboard calculation.

### 3. Budget & Reporting
- `getDashboardStats(periodId)`:
  - Returns: `{ totalBudget, allocated(Verified/Approved est. costs), spent(Realized costs), remaining }`.
- `getSpendingByCategory(periodId)`:
  - Returns aggregation for charts.

---

## 4. Implementation Plan

1.  **Setup Database**: Configure Prisma with the schema above.
2.  **Auth Implementation**: Set up NextAuth for the 4 roles.
3.  **UI Shell**: Create the Dashboard Layout with role-based sidebars.
4.  **Feature - Assets**: Build the Asset Table and Add Asset Form.
5.  **Feature - Request Flow**:
    - "Report Issue" Form.
    - Kanban or List view for Admins to see Incoming requests.
    - Modal for Verification/Approval actions.
6.  **Feature - Dashboard**: Charts/Stats using the budget logic.
