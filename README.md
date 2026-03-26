# Study Material Recommender
I built this as my AI/ML course project in first year. The idea was simple — 
instead of randomly searching for study material, what if a system could 
recommend the right resource based on what you actually need, and improve 
its suggestions based on your feedback?
It started as a Python command-line program. Later I converted it into a 
website so it's easier to use and share.


## The Problem I Was Trying to Solve
Every time I had to study a new topic, I'd waste time figuring out whether 
to watch a video, read notes, or jump straight into practice problems. And 
the difficulty mattered too — starting with hard content when you're a 
beginner is frustrating.
This tool tries to solve that by letting you specify exactly what you want, 
then ranking the best options for you.


## How It Works
You choose three things:
- **Subject** — Python, Math, DSA, or AI
- **Difficulty** — Easy, Medium, or Hard  
- **Type** — Video, Notes, or Practice
The system then searches the dataset, ranks the results using a scoring 
formula, and shows you the top matches. You can open any material directly 
or rate it out of 5. Your ratings feed back into the scores, so the system 
gradually learns which materials are actually useful.


## The AI Concepts Used
This project is built around four ideas from our AI course:
**1. Intelligent Agent**  
The system follows the classic agent loop — perceive the user's input, 
process it, take an action (recommend), and learn from feedback. Nothing 
fancy, but it covers all four parts properly.

**2. Constraint-Based Search**  
Filtering materials by subject, difficulty and type is basically a search 
with constraints. Only materials that satisfy all three conditions are 
considered. This is the same idea behind constraint satisfaction problems 
in AI.

**3. Heuristic Ranking**  
After filtering, materials are ranked using a weighted formula. Practice 
problems get a higher weight than videos because active learning is more 
effective. Harder materials are weighted slightly higher too.
final score = adaptive_score × difficulty_weight × type_weight
difficulty weights:  Easy → 1.0 | Medium → 1.1 | Hard → 1.2
type weights:        Video → 1.0 | Notes → 1.05 | Practice → 1.1

**4. Adaptive Learning**  
Every material starts with a base score of 3.5. When you rate something, 
that rating gets blended into the score using this formula:
adaptive_score = (base_score + sum of all ratings) / (1 + number of ratings)
So if a material has a base score of 3.5 and three people rated it 5, 4, 
and 5 — the new score becomes (3.5 + 14) / 4 = 4.375. It then ranks higher 
in future searches.


## Dataset
30 study materials across 4 subjects, 3 difficulty levels and 3 types. 
All materials start with a base score of 3.5. The scores evolve as users 
rate them.

| Subject | Easy | Medium | Hard |
|---------|------|--------|------|
| Python  |  ✓   |   ✓    |  ✓   |
| Math    |  ✓   |   ✓    |  ✓   |
| DSA     |  ✓   |   ✓    |  ✓   |
| AI      |  ✓   |   ✓    |  ✓   |

Each subject has Video, Notes and Practice materials at each level.


## Tech Stack
- HTML — structure
- CSS — styling (dark theme, responsive layout)
- JavaScript — all logic including search, ranking and adaptive scoring
- localStorage — saves your ratings in the browser across sessions
No frameworks. No backend. No database. Everything runs in the browser.


## Project Structure
study-recommender/
├── index.html      → main page, all four sections
├── style.css       → dark academic theme
├── data.js         → materials dataset + scoring logic
├── app.js          → UI interactions, search, feedback handling
└── README.md       → this file


## How to Run Locally

1. Download or clone the repository
2. Open `index.html` in any browser
3. No installation, no server, nothing to configure


## Live Demo
https://khyatisingh16032008-sys.github.io/study-recommender/


## What I Learned
- How to model a real problem using AI agent concepts
- How heuristic functions work in practice, not just in theory
- How adaptive/reinforcement-style learning can be implemented 
  in a very simple way without any ML libraries
- How to convert a Python CLI project into a working website


## Course Details
B.Tech CSE — First Year  
AI/ML Course Project  
[VIT BHOPAL UNIVERSITY]
