// data.js — Study materials dataset + adaptive score logic

const MATERIALS = [
  { id:1,  title:"Python Basics - Variables & Loops",     subject:"Python", difficulty:"Easy",   type:"Video",    url:"https://youtube.com/pybasics",    base_score:3.5 },
  { id:2,  title:"Python Functions Deep Dive",            subject:"Python", difficulty:"Medium", type:"Video",    url:"https://youtube.com/pyfunc",      base_score:3.5 },
  { id:3,  title:"Python OOP Concepts",                   subject:"Python", difficulty:"Hard",   type:"Video",    url:"https://youtube.com/pyoop",       base_score:3.5 },
  { id:4,  title:"Python Notes - Beginner Guide",         subject:"Python", difficulty:"Easy",   type:"Notes",    url:"https://notes.com/pybegin",       base_score:3.5 },
  { id:5,  title:"Python Cheat Sheet",                    subject:"Python", difficulty:"Medium", type:"Notes",    url:"https://notes.com/pycheat",       base_score:3.5 },
  { id:6,  title:"Python Practice Problems Set 1",        subject:"Python", difficulty:"Easy",   type:"Practice", url:"https://practice.com/py1",        base_score:3.5 },
  { id:7,  title:"Python Practice Problems Set 2",        subject:"Python", difficulty:"Medium", type:"Practice", url:"https://practice.com/py2",        base_score:3.5 },
  { id:8,  title:"Python Advanced Challenges",            subject:"Python", difficulty:"Hard",   type:"Practice", url:"https://practice.com/pyhard",     base_score:3.5 },
  { id:9,  title:"Math - Calculus Intro",                 subject:"Math",   difficulty:"Easy",   type:"Video",    url:"https://youtube.com/calc1",       base_score:3.5 },
  { id:10, title:"Math - Derivatives Explained",          subject:"Math",   difficulty:"Medium", type:"Video",    url:"https://youtube.com/deriv",       base_score:3.5 },
  { id:11, title:"Math - Integration Techniques",         subject:"Math",   difficulty:"Hard",   type:"Video",    url:"https://youtube.com/integ",       base_score:3.5 },
  { id:12, title:"Math Notes - Algebra Basics",           subject:"Math",   difficulty:"Easy",   type:"Notes",    url:"https://notes.com/algebra",       base_score:3.5 },
  { id:13, title:"Math Notes - Probability",              subject:"Math",   difficulty:"Medium", type:"Notes",    url:"https://notes.com/prob",          base_score:3.5 },
  { id:14, title:"Math Practice - Easy Sums",             subject:"Math",   difficulty:"Easy",   type:"Practice", url:"https://practice.com/math1",      base_score:3.5 },
  { id:15, title:"Math Practice - Hard Problems",         subject:"Math",   difficulty:"Hard",   type:"Practice", url:"https://practice.com/mathhard",   base_score:3.5 },
  { id:16, title:"DSA - Arrays and Strings",              subject:"DSA",    difficulty:"Easy",   type:"Video",    url:"https://youtube.com/arrays",      base_score:3.5 },
  { id:17, title:"DSA - Linked Lists",                    subject:"DSA",    difficulty:"Medium", type:"Video",    url:"https://youtube.com/linkedlist",  base_score:3.5 },
  { id:18, title:"DSA - Trees and Graphs",                subject:"DSA",    difficulty:"Hard",   type:"Video",    url:"https://youtube.com/trees",       base_score:3.5 },
  { id:19, title:"DSA Notes - Big O Notation",            subject:"DSA",    difficulty:"Easy",   type:"Notes",    url:"https://notes.com/bigo",          base_score:3.5 },
  { id:20, title:"DSA Notes - Sorting Algorithms",        subject:"DSA",    difficulty:"Medium", type:"Notes",    url:"https://notes.com/sort",          base_score:3.5 },
  { id:21, title:"DSA Practice - Easy Coding",            subject:"DSA",    difficulty:"Easy",   type:"Practice", url:"https://practice.com/dsa1",       base_score:3.5 },
  { id:22, title:"DSA Practice - Medium Coding",          subject:"DSA",    difficulty:"Medium", type:"Practice", url:"https://practice.com/dsa2",       base_score:3.5 },
  { id:23, title:"DSA Practice - Hard Coding",            subject:"DSA",    difficulty:"Hard",   type:"Practice", url:"https://practice.com/dsahard",    base_score:3.5 },
  { id:24, title:"AI - Introduction to AI",               subject:"AI",     difficulty:"Easy",   type:"Video",    url:"https://youtube.com/aiintro",     base_score:3.5 },
  { id:25, title:"AI - Search Algorithms",                subject:"AI",     difficulty:"Medium", type:"Video",    url:"https://youtube.com/aisearch",    base_score:3.5 },
  { id:26, title:"AI - Neural Networks Basics",           subject:"AI",     difficulty:"Hard",   type:"Video",    url:"https://youtube.com/nn",          base_score:3.5 },
  { id:27, title:"AI Notes - Agents and Environments",    subject:"AI",     difficulty:"Easy",   type:"Notes",    url:"https://notes.com/agents",        base_score:3.5 },
  { id:28, title:"AI Notes - Heuristic Search",           subject:"AI",     difficulty:"Medium", type:"Notes",    url:"https://notes.com/heuristic",     base_score:3.5 },
  { id:29, title:"AI Practice - Logic Problems",          subject:"AI",     difficulty:"Easy",   type:"Practice", url:"https://practice.com/ai1",        base_score:3.5 },
  { id:30, title:"AI Practice - Search Problems",         subject:"AI",     difficulty:"Medium", type:"Practice", url:"https://practice.com/ai2",        base_score:3.5 },
];

// ─── Heuristic weights (mirrors Python recommender.py) ───
const DIFFICULTY_WEIGHTS = { Easy: 1.0, Medium: 1.1, Hard: 1.2 };
const TYPE_WEIGHTS       = { Video: 1.0, Notes: 1.05, Practice: 1.1 };

// ─── Feedback storage (localStorage-backed) ──────────────
function getFeedback() {
  try { return JSON.parse(localStorage.getItem('studybot_feedback') || '[]'); }
  catch { return []; }
}
function saveFeedbackEntry(entry) {
  const arr = getFeedback();
  arr.push(entry);
  localStorage.setItem('studybot_feedback', JSON.stringify(arr));
}
function clearAllFeedback() {
  localStorage.removeItem('studybot_feedback');
}

// ─── Adaptive score formula (mirrors Python feedback.py) ──
function calcAdaptiveScore(materialId, baseScore) {
  const fb = getFeedback().filter(f => f.material_id === materialId);
  if (!fb.length) return baseScore;
  const sumRatings = fb.reduce((s, f) => s + f.rating, 0);
  return Math.round(((baseScore + sumRatings) / (1 + fb.length)) * 100) / 100;
}

// ─── Heuristic score ──────────────────────────────────────
function calcHeuristicScore(adaptiveScore, difficulty, type) {
  const dw = DIFFICULTY_WEIGHTS[difficulty] || 1.0;
  const tw = TYPE_WEIGHTS[type] || 1.0;
  return Math.round(adaptiveScore * dw * tw * 1000) / 1000;
}

// ─── Main search function ─────────────────────────────────
function queryMaterials(subject, difficulty, type) {
  return MATERIALS
    .filter(m =>
      m.subject.toLowerCase() === subject.toLowerCase() &&
      m.difficulty.toLowerCase() === difficulty.toLowerCase() &&
      m.type.toLowerCase() === type.toLowerCase()
    )
    .map(m => {
      const adaptive = calcAdaptiveScore(m.id, m.base_score);
      const score    = calcHeuristicScore(adaptive, m.difficulty, m.type);
      return { ...m, adaptive_score: adaptive, score };
    })
    .sort((a, b) => b.score - a.score);
}
