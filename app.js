// app.js — StudyBot Website Logic

// ─── Page Navigation ─────────────────────────────────────
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`).classList.add('active');
  if (id === 'progress') renderProgress();
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => goPage(btn.dataset.page));
});

// ─── Option Button Selection ──────────────────────────────
function setupOptionGroup(groupId) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}
setupOptionGroup('opt-subject');
setupOptionGroup('opt-difficulty');
setupOptionGroup('opt-type');

function getSelected(groupId) {
  const sel = document.querySelector(`#${groupId} .opt-btn.selected`);
  return sel ? sel.dataset.val : null;
}

// ─── Search & Render Results ──────────────────────────────
function renderResults() {
  const subject    = getSelected('opt-subject');
  const difficulty = getSelected('opt-difficulty');
  const type       = getSelected('opt-type');

  if (!subject || !difficulty || !type) {
    showToast('⚠️ Please select Subject, Difficulty & Type');
    return;
  }

  // queryMaterials() is defined in data.js — no name collision
  const results = queryMaterials(subject, difficulty, type);
  const placeholder = document.getElementById('results-placeholder');
  const content     = document.getElementById('results-content');

  placeholder.classList.add('hidden');
  content.classList.remove('hidden');

  if (!results.length) {
    content.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">😔</div>
        <p>No materials found for <strong>${subject} · ${difficulty} · ${type}</strong></p>
        <p style="margin-top:8px;font-size:12px;color:var(--text-muted)">Try a different combination.</p>
      </div>`;
    return;
  }

  const ratedIds = getFeedback().map(f => f.material_id);

  let html = `
    <div class="results-header">
      <span class="results-meta">
        🔍 <strong>${results.length}</strong> result${results.length > 1 ? 's' : ''} for
        <strong>${subject}</strong> · <strong>${difficulty}</strong> · <strong>${type}</strong>
      </span>
    </div>`;

  results.forEach((m, i) => {
    const isTop   = i === 0;
    const isRated = ratedIds.includes(m.id);
    // Escape title safely for inline onclick attribute
    const safeTitle = m.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    html += `
      <div class="material-card">
        <div class="mat-rank ${isTop ? 'top' : ''}">${i + 1}</div>
        <div class="mat-body">
          <div class="mat-title">${m.title}</div>
          <div class="mat-tags">
            <span class="mat-tag">${m.subject}</span>
            <span class="mat-tag">${m.difficulty}</span>
            <span class="mat-tag">${m.type}</span>
          </div>
        </div>
        <div class="mat-score-wrap">
          <div class="mat-score">${m.score.toFixed(2)}</div>
          <div class="mat-score-label">AI Score</div>
        </div>
        <div class="mat-actions">
          <a href="${m.url}" target="_blank" class="btn-link">🔗 Open</a>
          <button class="btn-rate ${isRated ? 'rated' : ''}"
            onclick="openRateModal(${m.id}, '${safeTitle}', ${isRated})"
            ${isRated ? 'disabled' : ''}>
            ${isRated ? '✅ Rated' : '⭐ Rate'}
          </button>
        </div>
      </div>`;
  });

  content.innerHTML = html;
}

// renderResults() is called directly from index.html onclick="renderResults()"

// ─── Rating Modal ─────────────────────────────────────────
let currentRatingMaterial = null;
let currentRatingValue    = 0;

window.openRateModal = function(id, title, alreadyRated) {
  if (alreadyRated) return;
  currentRatingMaterial = { id, title };
  currentRatingValue    = 0;

  document.getElementById('modal-title-text').textContent = title;
  document.getElementById('rating-label').textContent     = 'Select a rating';
  document.getElementById('submit-rating-btn').disabled   = true;

  // Reset stars
  document.querySelectorAll('.star').forEach(s => s.classList.remove('lit'));

  document.getElementById('feedback-modal').classList.remove('hidden');
};

window.closeModal = function() {
  document.getElementById('feedback-modal').classList.add('hidden');
};

// Star hover + click
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('mouseover', () => {
    const val = +star.dataset.val;
    document.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('lit', +s.dataset.val <= val);
    });
  });
  star.addEventListener('mouseout', () => {
    document.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('lit', +s.dataset.val <= currentRatingValue);
    });
  });
  star.addEventListener('click', () => {
    currentRatingValue = +star.dataset.val;
    const labels = ['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent 🤩'];
    document.getElementById('rating-label').textContent = `${currentRatingValue}/5 — ${labels[currentRatingValue]}`;
    document.getElementById('submit-rating-btn').disabled = false;
  });
});

window.submitRating = function() {
  if (!currentRatingMaterial || !currentRatingValue) return;
  const mat = MATERIALS.find(m => m.id === currentRatingMaterial.id);
  saveFeedbackEntry({
    material_id: currentRatingMaterial.id,
    title:       currentRatingMaterial.title,
    subject:     mat ? mat.subject    : '',
    difficulty:  mat ? mat.difficulty : '',
    type:        mat ? mat.type       : '',
    rating:      currentRatingValue,
    timestamp:   new Date().toISOString()
  });
  closeModal();
  showToast(`⭐ Rated "${currentRatingMaterial.title}" — ${currentRatingValue}/5`);
  // Re-render results to mark as rated
  renderResults();
};

// ─── Progress Page ────────────────────────────────────────
function renderProgress() {
  const fb = getFeedback();
  const emptyEl  = document.getElementById('empty-feedback');
  const tableWrap = document.getElementById('progress-table-wrap');

  if (!fb.length) {
    emptyEl.classList.remove('hidden');
    tableWrap.classList.add('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  tableWrap.classList.remove('hidden');

  // Stats
  const avgRating  = (fb.reduce((s, f) => s + f.rating, 0) / fb.length).toFixed(2);
  const uniqueMats = new Set(fb.map(f => f.material_id)).size;
  const subjectSet = new Set(fb.map(f => f.subject)).size;

  // Group by material
  const grouped = {};
  fb.forEach(f => {
    if (!grouped[f.material_id]) {
      grouped[f.material_id] = { title: f.title, subject: f.subject, difficulty: f.difficulty, type: f.type, ratings: [] };
    }
    grouped[f.material_id].ratings.push(f.rating);
  });

  let tableRows = '';
  Object.values(grouped)
    .map(g => ({ ...g, avg: g.ratings.reduce((s, r) => s + r, 0) / g.ratings.length, count: g.ratings.length }))
    .sort((a, b) => b.avg - a.avg)
    .forEach(g => {
      const stars = '★'.repeat(Math.round(g.avg)) + '☆'.repeat(5 - Math.round(g.avg));
      tableRows += `<tr>
        <td>${g.title}</td>
        <td>${g.subject}</td>
        <td>${g.difficulty}</td>
        <td>${g.type}</td>
        <td class="stars-display">${stars}</td>
        <td>${g.avg.toFixed(2)}</td>
        <td>${g.count}</td>
      </tr>`;
    });

  tableWrap.innerHTML = `
    <div class="progress-stats">
      <div class="stat-card"><div class="stat-val">${fb.length}</div><div class="stat-lbl">Total Ratings</div></div>
      <div class="stat-card"><div class="stat-val">${uniqueMats}</div><div class="stat-lbl">Materials Rated</div></div>
      <div class="stat-card"><div class="stat-val">${avgRating}</div><div class="stat-lbl">Avg Rating</div></div>
      <div class="stat-card"><div class="stat-val">${subjectSet}</div><div class="stat-lbl">Subjects Explored</div></div>
    </div>
    <div class="progress-table-container">
      <h3>📊 Feedback Summary — sorted by average rating</h3>
      <div style="overflow-x:auto">
        <table class="progress-table">
          <thead><tr>
            <th>Title</th><th>Subject</th><th>Difficulty</th><th>Type</th><th>Stars</th><th>Avg</th><th>Count</th>
          </tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>
    <button class="clear-btn" onclick="clearFeedbackUI()">🗑 Clear All Feedback</button>`;
}

window.clearFeedbackUI = function() {
  if (confirm('Clear all feedback? This cannot be undone.')) {
    clearAllFeedback();
    renderProgress();
    showToast('Feedback cleared.');
  }
};

// ─── Toast ────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3000);
}

// Close modal on overlay click
document.getElementById('feedback-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
