# 🎓 StudyBot — AI Adaptive Study Material Recommender (Website)

## 📌 Overview
A fully functional **website** version of the StudyBot AI Study Material Recommender.
Built with pure HTML, CSS, and JavaScript — no server or installation needed.

## 🚀 How to Run
1. Unzip this folder
2. Double-click `index.html` — it opens directly in any browser
3. No server, no npm, no Python required!

## 🌐 Pages
| Page | Description |
|------|-------------|
| **Home** | Hero landing + features overview |
| **Recommend** | Search materials by subject/difficulty/type & rate them |
| **Progress** | View your feedback history and adaptive learning stats |
| **About** | Explains the AI concepts behind the system |

## 🧠 AI Concepts Preserved
- **Intelligent Agent** — Perceive → Recommend → Learn loop
- **Constraint-Based Search** — Exact match filtering on subject, difficulty, type
- **Heuristic Ranking** — `score = adaptive × difficulty_weight × type_weight`
- **Adaptive Learning** — `adaptive_score = (base + Σ ratings) / (1 + N)`

## 📁 Files
```
study_recommender_web/
├── index.html   ← Main page (open this)
├── style.css    ← Dark-academic UI styles
├── data.js      ← 30 materials dataset + score logic
├── app.js       ← UI interactions, search, feedback
└── README.md    ← This file
```

## 💾 Data Persistence
Ratings are saved to **localStorage** in your browser — they persist across sessions
and update material scores in real time (adaptive learning).

## 📚 Available Subjects
Python · Math · DSA · AI

## 🎯 Difficulty Levels
Easy · Medium · Hard

## 📂 Material Types
Video · Notes · Practice

---
Original CLI project converted to website format.
