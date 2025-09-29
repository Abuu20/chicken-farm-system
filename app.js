
// == IMPORTANT: paste your Apps Script web app URL below ==
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMXOm0qDQfRZMgnmiR2Y8Ktke8ZgG9qqXd7tTEZsvczfNSHmdCBDOkULqifwy97cnr/exec';

const entryForm = document.getElementById('entryForm');
const refreshBtn = document.getElementById('refreshBtn');
const tableWrap = document.getElementById('tableWrap');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

async function api(action, payload = {}){
  // payload will be sent as JSON string under 'payload' key for Apps Script compatibility
  const body = new URLSearchParams();
  body.append('action', action);
  body.append('payload', JSON.stringify(payload));

  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: body.toString(),
  });
  const text = await res.text();
  try{ return JSON.parse(text); }catch(e){ console.warn('Non-JSON response', text); return text; }
}

entryForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = {
    category: document.getElementById('category').value,
    type: document.getElementById('type').value,
    field1: document.getElementById('field1').value,
    field2: document.getElementById('field2').value,
    field3: document.getElementById('field3').value,
    notes: document.getElementById('notes').value,
  };
  entryForm.querySelector('button[type=submit]').disabled = true;
  const resp = await api('append', data);
  entryForm.querySelector('button[type=submit]').disabled = false;
  if(resp && resp.result === 'success'){
    alert('Saved ✅');
    entryForm.reset();
    loadTable();
  } else {
    alert('Error saving. Check console.');
    console.error(resp);
  }
});

clearBtn.addEventListener('click', ()=>entryForm.reset());
refreshBtn.addEventListener('click', loadTable);
exportBtn.addEventListener('click', ()=>downloadCSV(window.latestData || []));

updateBtn.addEventListener('click', async ()=>{
  const index = document.getElementById('rowIndex').value.trim();
  const notes = document.getElementById('updateNotes').value.trim();
  if(!index){ alert('Enter row number'); return; }
  const resp = await api('update', {row: parseInt(index,10), notes});
  if(resp && resp.result === 'success') { alert('Updated'); loadTable(); } else { alert('Update failed'); console.error(resp); }
});

deleteBtn.addEventListener('click', async ()=>{
  const index = document.getElementById('rowIndex').value.trim();
  if(!index){ alert('Enter row number'); return; }
  if(!confirm('Delete row ' + index + '? This cannot be undone from the site.')) return;
  const resp = await api('delete', {row: parseInt(index,10)});
  if(resp && resp.result === 'success'){ alert('Deleted'); loadTable(); } else { alert('Delete failed'); console.error(resp); }
});

async function loadTable(){
  tableWrap.innerText = 'Loading...';
  const resp = await api('get');
  if(!resp || !resp.data){ tableWrap.innerText = 'No data'; return; }
  window.latestData = resp.data; // keep for export
  const headers = resp.headers;
  // build table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const thr = document.createElement('tr');
  thr.innerHTML = '<th>#</th>' + headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('');
  thead.appendChild(thr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  resp.data.forEach((row, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+2}</td>` + row.map(c=>`<td>${escapeHtml(c)}</td>`).join('');
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.innerHTML = '';
  tableWrap.appendChild(table);
}

function escapeHtml(s){ if(s===null||s===undefined) return ''; return String(s).replace(/[&<>\"]+/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c)); }

function downloadCSV(data){
  if(!data || data.length===0){ alert('No data'); return; }
  // headers from window.latestData? We received headers in load.
  const headers = (window.latestHeaders || (data[0] && Object.keys(data[0])) ) || [];
  // Build CSV from latestData which is array-of-arrays from server
  const csvRows = [];
  // get headers from server response stored in window.latestDataResponse
  const resp = window.latestDataResponse;
  if(window.latestData && window.latestData.length){
    // assume server returned arrays; use global headers from last load
    const h = window.latestDataHeaders || [];
    if(h.length) csvRows.push(h.join(','));
    window.latestData.forEach(row=> csvRows.push(row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')));
  } else {
    alert('No data to export'); return;
  }
  const blob = new Blob([csvRows.join('\n')], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'chickenfarm_data.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// enhance loadTable to save headers globally
(async ()=>{ await loadTable(); })();


