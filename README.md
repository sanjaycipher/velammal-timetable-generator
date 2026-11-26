# Velammal Vidyalaya - Timetable Generator

**Live Website:** https://timetable-web-app-beta.vercel.app

A Next.js + Material UI + TypeScript web application for **Velammal Vidyalaya Poonamallee (Secondary Compartment: IX A – X C)** that converts all 10 timetable workbook sheets into an interactive dashboard with an AI/client-side conflict-free timetable solver and PDF/Excel export.

## Features
- **All 10 Excel Sheets Included:** Index, Guidelines (17 rules), Period Allotment & CBSE Subject Hours, Editable Teacher Allotment (`DataGrid`), Class Timetables (`IX A`–`X C`), Teacher Timetables (18 teachers), Lab Timetables, DRT Schedule, Coaching Class Schedule, and Free Period Matrix (`DataGrid`).
- **Conflict-Free Timetable Solver:** Generates a 6-day × 7-period timetable with zero teacher or class conflicts.
- **Export:** Download generated timetables as **PDF** (`jspdf` + `jspdf-autotable`) or **Excel** (`xlsx`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
