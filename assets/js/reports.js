// reports.js - Reports Management
Store.init().then(() => {
  requireParentAuth();
  renderReportsPage();
});

function renderReportsPage() {
  const u = Store.user;
  document.getElementById('rep-child').textContent = u.child || '—';
  
  const container = document.getElementById('reports-container');
  if (!container) return;

  const myReports = Store.reports;
  if (myReports.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#888;">
        <span style="font-size:3rem;display:block;margin-bottom:12px;">📋</span>
        No active reports or complaints.
      </div>
    `;
    return;
  }

  const sorted = [...myReports].sort((a,b) => b.id - a.id);
  container.innerHTML = sorted.map(r => `
    <div class="report-item">
      <div class="report-icon">📞</div>
      <div class="report-info">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span class="tag ${reportStatusClass(r.status)}">${r.status}</span>
          <button class="report-delete" onclick="deleteMyReport(${r.id})">Cancel</button>
        </div>
        <h4>${r.subject}</h4>
        <p>${r.description}</p>
        <div class="report-meta">Type: ${r.type === 'lost' ? 'Lost Card' : r.type === 'damaged' ? 'Damaged Card' : 'Other'} • Filed on ${r.createdAt}</div>
      </div>
    </div>
  `).join('');
}

function reportStatusClass(status) {
  if (status === 'Resolved') return 'tag-green';
  if (status === 'In Progress') return 'tag-yellow';
  return 'tag-red';
}

async function submitReport() {
  const type = document.getElementById('rep-type').value;
  const subject = document.getElementById('rep-subject').value.trim();
  const desc = document.getElementById('rep-desc').value.trim();

  if (!subject || !desc) { toast('Please fill in all fields.'); return; }

  toast('Submitting report...');
  try {
    const res = await fetch('api.php?action=create-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: Store.user.email, type, subject, description: desc })
    });
    if (res.ok) {
      const data = await res.json();
      Store.reports = data.reports;
      Store.save();
      closeModal('modal-new-report');
      toast('Report submitted successfully!');
      
      // Clear fields
      document.getElementById('rep-subject').value = '';
      document.getElementById('rep-desc').value = '';
      
      renderReportsPage();
    } else {
      toast('Submission failed.');
    }
  } catch (e) {
    console.error(e);
    toast('Error submitting report.');
  }
}

async function deleteMyReport(id) {
  if (confirm('Are you sure you want to cancel this report?')) {
    toast('Cancelling report...');
    try {
      const res = await fetch('api.php?action=delete-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        Store.reports = Store.reports.filter(r => r.id !== id);
        Store.save();
        toast('Report cancelled successfully.');
        renderReportsPage();
      } else {
        toast('Action failed.');
      }
    } catch (e) {
      console.error(e);
      toast('Network error.');
    }
  }
}
