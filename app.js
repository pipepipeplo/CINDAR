// Conservé la referencia original al sidebar y al comportamiento hover/click.
// Añadí: navegación por data-page, formularios para Valores, Agenda y Registro, persistencia en localStorage básica.

const sidebar = document.getElementById('sidebar');
const navLinks = sidebar.querySelectorAll('.nav a');

// Páginas (secciones)
const pages = document.querySelectorAll('.page');

function showPage(name) {
  pages.forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + name);
  if (el) el.classList.add('active');
}

// Mantener comportamiento original: al hacer click en un link se expande el sidebar
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page || 'inicio';
    // Expandir el sidebar (comportamiento existente)
    sidebar.classList.remove('collapsed');
    // Mostrar la sección correspondiente
    showPage(page);
  });
});

// Expandir al pasar el mouse
sidebar.addEventListener('mouseenter', () => {
  sidebar.classList.remove('collapsed');
});

// Volver a colapsar al sacar el mouse
sidebar.addEventListener('mouseleave', () => {
  sidebar.classList.add('collapsed');
});

/* ===========================
   Manejo de Valores (Mensajes)
   =========================== */
const valoresForm = document.getElementById('valores-form');
const valoresTableBody = document.querySelector('#valores-table tbody');

let valoresData = JSON.parse(localStorage.getItem('valoresData') || '[]');

function renderValores() {
  valoresTableBody.innerHTML = '';
  valoresData.forEach((v, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(v.hospital)}</td>
      <td>${escapeHtml(v.param)}</td>
      <td>${escapeHtml(v.min)}</td>
      <td>${escapeHtml(v.max)}</td>
      <td>${escapeHtml(v.unidad)}</td>
      <td>
        <button class="btn-delete" data-idx="${idx}">Eliminar</button>
      </td>
    `;
    valoresTableBody.appendChild(tr);
  });
}

valoresForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const h = document.getElementById('valores-hospital').value.trim();
  const p = document.getElementById('valores-param').value.trim();
  const mi = document.getElementById('valores-min').value.trim();
  const ma = document.getElementById('valores-max').value.trim();
  const u = document.getElementById('valores-unidad').value.trim();

  if (!h || !p) return alert('Hospital y parámetro son obligatorios.');

  valoresData.push({ hospital: h, param: p, min: mi, max: ma, unidad: u });
  localStorage.setItem('valoresData', JSON.stringify(valoresData));
  renderValores();
  valoresForm.reset();
});

// Delegación para eliminar
valoresTableBody?.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    const idx = parseInt(e.target.dataset.idx, 10);
    if (confirm('Eliminar este valor de referencia?')) {
      valoresData.splice(idx, 1);
      localStorage.setItem('valoresData', JSON.stringify(valoresData));
      renderValores();
    }
  }
});

/* ===========================
   Manejo de Agenda (Calendario)
   =========================== */
const agendaForm = document.getElementById('agenda-form');
const agendaTableBody = document.querySelector('#agenda-table tbody');

let agendaData = JSON.parse(localStorage.getItem('agendaData') || '[]');

function renderAgenda() {
  agendaTableBody.innerHTML = '';
  agendaData.forEach((a, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(a.date)}</td>
      <td>${escapeHtml(a.time)}</td>
      <td>${escapeHtml(a.hospital)}</td>
      <td>${escapeHtml(a.doctor)}</td>
      <td>${escapeHtml(a.procedimiento)}</td>
      <td>
        <button class="btn-delete" data-idx="${idx}">Eliminar</button>
      </td>
    `;
    agendaTableBody.appendChild(tr);
  });
}

agendaForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('agenda-date').value;
  const time = document.getElementById('agenda-time').value;
  const doctor = document.getElementById('agenda-doctor').value.trim();
  const hospital = document.getElementById('agenda-hospital').value.trim();
  const procedimiento = document.getElementById('agenda-procedimiento').value.trim();

  if (!date || !time || !doctor) return alert('Fecha, hora y doctor son obligatorios.');

  // Preferencia: mostrar alerta de conflicto según ajustes
  const prefConflict = JSON.parse(localStorage.getItem('pref_conflict_alert') ?? 'true');

  const collision = agendaData.some(a =>
    a.date === date && a.time === time && a.doctor.toLowerCase() === doctor.toLowerCase()
  );

  if (collision && prefConflict) {
    return alert(`Conflicto: el Dr. ${doctor} ya tiene una cirugía programada en esa fecha/hora.`);
  }

  agendaData.push({ date, time, doctor, hospital, procedimiento });
  localStorage.setItem('agendaData', JSON.stringify(agendaData));
  renderAgenda();
  agendaForm.reset();
});

// Eliminar en agenda
agendaTableBody?.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    const idx = parseInt(e.target.dataset.idx, 10);
    if (confirm('Eliminar esta programación?')) {
      agendaData.splice(idx, 1);
      localStorage.setItem('agendaData', JSON.stringify(agendaData));
      renderAgenda();
    }
  }
});

/* ===========================
   Manejo de Registro Quirúrgico (Reportes)
   =========================== */
const registroForm = document.getElementById('registro-form');
const registroTableBody = document.querySelector('#registro-table tbody');

let registroData = JSON.parse(localStorage.getItem('registroData') || '[]');

function renderRegistro() {
  registroTableBody.innerHTML = '';
  registroData.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.time)}</td>
      <td>${escapeHtml(r.hospital)}</td>
      <td>${escapeHtml(r.doctor)}</td>
      <td>${escapeHtml(r.paciente)}</td>
      <td>${escapeHtml(r.desc || '')}</td>
      <td><button class="btn-delete" data-idx="${idx}">Eliminar</button></td>
    `;
    registroTableBody.appendChild(tr);
  });
}

registroForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('registro-date').value;
  const time = document.getElementById('registro-time').value;
  const hospital = document.getElementById('registro-hospital').value.trim();
  const doctor = document.getElementById('registro-doctor').value.trim();
  const paciente = document.getElementById('registro-paciente').value.trim();
  const desc = document.getElementById('registro-desc').value.trim();

  if (!date || !time || !doctor || !paciente) return alert('Fecha, hora, doctor y paciente son obligatorios.');

  registroData.push({ date, time, hospital, doctor, paciente, desc });
  localStorage.setItem('registroData', JSON.stringify(registroData));
  renderRegistro();
  registroForm.reset();
});

registroTableBody?.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    const idx = parseInt(e.target.dataset.idx, 10);
    if (confirm('Eliminar este registro quirúrgico?')) {
      registroData.splice(idx, 1);
      localStorage.setItem('registroData', JSON.stringify(registroData));
      renderRegistro();
    }
  }
});

/* ===========================
   Ajustes / Protocolos
   =========================== */
const protocolosText = document.getElementById('protocolos-text');
const saveProtocolosBtn = document.getElementById('save-protocolos');
const loadProtocolosBtn = document.getElementById('load-protocolos');
const prefCheckbox = document.getElementById('pref-conflict-alert');

saveProtocolosBtn?.addEventListener('click', () => {
  const val = protocolosText.value;
  localStorage.setItem('protocolos_doc', val);
  alert('Protocolos guardados localmente.');
});

loadProtocolosBtn?.addEventListener('click', () => {
  const saved = localStorage.getItem('protocolos_doc') || '';
  protocolosText.value = saved;
  alert('Protocolos cargados.');
});

prefCheckbox?.addEventListener('change', () => {
  localStorage.setItem('pref_conflict_alert', JSON.stringify(prefCheckbox.checked));
});

/* ===========================
   Utilidades & carga inicial
   =========================== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Carga inicial desde localStorage
function init() {
  // Si no hay datos de ejemplo, agrego algunos para mostrar estructura
  if (!localStorage.getItem('valoresData')) {
    valoresData = [
      { hospital: 'Hospital Central', param: 'Glucosa', min: '0.5', max: '0.6', unidad: 'g/L' },
      { hospital: 'Clínica Norte', param: 'Hemoglobina', min: '12', max: '16', unidad: 'g/dL' }
    ];
    localStorage.setItem('valoresData', JSON.stringify(valoresData));
  }
  if (!localStorage.getItem('agendaData')) {
    agendaData = [];
    localStorage.setItem('agendaData', JSON.stringify(agendaData));
  }
  if (!localStorage.getItem('registroData')) {
    registroData = [];
    localStorage.setItem('registroData', JSON.stringify(registroData));
  }

  // ----------------- REEMPLAZAR ESTO DENTRO DE init() -----------------
  // Preferencias (seguro: solo setear checkbox si existe)
  if (localStorage.getItem('pref_conflict_alert') === null) {
    localStorage.setItem('pref_conflict_alert', 'true');
  }
  const prefVal = JSON.parse(localStorage.getItem('pref_conflict_alert') ?? 'true');
  if (prefCheckbox) {
    try {
      prefCheckbox.checked = prefVal;
    } catch (err) {
      // si por alguna razon el elemento no soporta checked, lo ignoramos
      console.warn('prefCheckbox exists but setting checked failed:', err);
    }
  }

  // Cargar protocolos si existen (solo si el textarea existe)
  const prot = localStorage.getItem('protocolos_doc');
  if (prot && protocolosText) protocolosText.value = prot;

  // Refrescar tablas (siempre leer localStorage)
  valoresData = JSON.parse(localStorage.getItem('valoresData') || '[]');
  agendaData  = JSON.parse(localStorage.getItem('agendaData') || '[]');
  registroData = JSON.parse(localStorage.getItem('registroData') || '[]');

  renderValores();
  renderAgenda();
  renderRegistro();

  // Inicializar pacientes (si el módulo existe)
  if (typeof initPatients === 'function') {
    initPatients();
  }
}

init();
function showTab(tabName) {
    var contents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }
    var tab = document.getElementById(tabName);
    tab.style.display = "block";
    tab.classList.add("fade-in");
}
/* ==============================
   Módulo: Pacientes (Datos)
   ============================== */

let patients = JSON.parse(localStorage.getItem('patientsData') || '[]');

// Helpers (usa escapeHtml si ya existe en tu app.js)
function savePatients() {
  localStorage.setItem('patientsData', JSON.stringify(patients));
}

function renderPatients() {
  const container = document.getElementById('patients-list');
  if (!container) return;
  container.innerHTML = '';
  if (patients.length === 0) {
    container.innerHTML = `<div style="color:#666; padding:10px">No hay pacientes registrados.</div>`;
    return;
  }

  patients.forEach(p => {
    const div = document.createElement('div');
    div.className = 'patient-card';
    div.dataset.id = p.id;
    div.innerHTML = `
      <div class="name">${escapeHtml(p.name)}</div>
      <div class="meta">ID: ${escapeHtml(p.idnum)} • ${escapeHtml(p.age || '')} años</div>
      <div class="meta">Hospital: ${escapeHtml(p.hospital || '-')}</div>
      <div class="patient-actions">
        <button class="icon-btn view-btn" title="Ver"><i class="fas fa-eye"></i></button>
        <button class="icon-btn edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="icon-btn del-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>
    `;
    container.appendChild(div);
  });
}

/* Abrir modal con datos */
function openModalWithPatient(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('patient-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div><strong>Nombre:</strong> <span id="m-name">${escapeHtml(p.name)}</span></div>
    <div><strong>ID:</strong> <span id="m-idnum">${escapeHtml(p.idnum)}</span></div>
    <div><strong>Edad:</strong> <span id="m-age">${escapeHtml(p.age || '')}</span></div>
    <div><strong>Hospital:</strong> <span id="m-hospital">${escapeHtml(p.hospital || '')}</span></div>
    <div style="margin-top:8px;"><strong>Observaciones:</strong><div id="m-notes" style="white-space:pre-wrap; margin-top:6px; color:#333;">${escapeHtml(p.notes || '')}</div></div>
  `;

  // guardamos id en botones para referencia
  document.getElementById('modal-edit').dataset.id = id;
  document.getElementById('modal-delete').dataset.id = id;
  document.getElementById('modal-save').dataset.id = id;

  modal.setAttribute('aria-hidden', 'false');
}

/* Cerrar modal */
function closeModal() {
  const modal = document.getElementById('patient-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  // asegurar estado botones
  document.getElementById('modal-edit').style.display = '';
  document.getElementById('modal-save').style.display = 'none';
}

/* Hacer editable el contenido del modal */
function enableModalEdit(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return;
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <label>Nombre</label>
    <input id="edit-name" value="${escapeHtml(p.name)}" />
    <label>ID</label>
    <input id="edit-idnum" value="${escapeHtml(p.idnum)}" />
    <label>Edad</label>
    <input id="edit-age" value="${escapeHtml(p.age || '')}" />
    <label>Hospital</label>
    <input id="edit-hospital" value="${escapeHtml(p.hospital || '')}" />
    <label>Observaciones</label>
    <textarea id="edit-notes" rows="4">${escapeHtml(p.notes || '')}</textarea>
  `;
  document.getElementById('modal-edit').style.display = 'none';
  document.getElementById('modal-save').style.display = '';
}

/* Guardar cambios desde modal */
function saveModalEdit(id) {
  const idx = patients.findIndex(x => x.id === id);
  if (idx === -1) return;
  const p = patients[idx];
  p.name = document.getElementById('edit-name').value.trim();
  p.idnum = document.getElementById('edit-idnum').value.trim();
  p.age = document.getElementById('edit-age').value.trim();
  p.hospital = document.getElementById('edit-hospital').value.trim();
  p.notes = document.getElementById('edit-notes').value.trim();
  patients[idx] = p;
  savePatients();
  renderPatients();
  openModalWithPatient(id);
}

/* Eliminar paciente */
function deletePatientById(id) {
  if (!confirm('Eliminar este paciente? Esta acción no se puede deshacer.')) return;
  patients = patients.filter(x => x.id !== id);
  savePatients();
  renderPatients();
  closeModal();
}

/* Export CSV */
function exportPatientsCSV() {
  if (patients.length === 0) { alert('No hay pacientes para exportar.'); return; }
  const headers = ['id','name','idnum','age','hospital','notes'];
  const rows = patients.map(p => headers.map(h => `"${String(p[h]||'').replace(/"/g,'""')}"`).join(','));
  const csv = headers.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pacientes.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* Eventos: delegación y formulario */
document.addEventListener('click', function(e){
  // abrir vista (card) -> ojo: botones dentro
  if (e.target.closest('.view-btn')) {
    const id = e.target.closest('.patient-card').dataset.id;
    openModalWithPatient(id);
  }
  // editar desde card
  if (e.target.closest('.edit-btn')) {
    const id = e.target.closest('.patient-card').dataset.id;
    openModalWithPatient(id);
    enableModalEdit(id);
  }
  // eliminar desde card
  if (e.target.closest('.del-btn')) {
    const id = e.target.closest('.patient-card').dataset.id;
    deletePatientById(id);
  }
});

const patientForm = document.getElementById('patient-form');
patientForm?.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('patient-name').value.trim();
  const idnum = document.getElementById('patient-idnum').value.trim();
  const age = document.getElementById('patient-age').value.trim();
  const hospital = document.getElementById('patient-hospital').value.trim();
  const notes = document.getElementById('patient-notes').value.trim();

  if (!name || !idnum) return alert('Nombre e ID son obligatorios.');

  const newPatient = {
    id: String(Date.now()),
    name, idnum, age, hospital, notes
  };
  patients.unshift(newPatient); // al inicio
  savePatients();
  renderPatients();
  patientForm.reset();
});

/* Modal botones */
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('patient-modal')?.addEventListener('click', function(e){
  if (e.target === this) closeModal();
});
document.getElementById('modal-edit')?.addEventListener('click', function(){
  const id = this.dataset.id;
  enableModalEdit(id);
});
document.getElementById('modal-save')?.addEventListener('click', function(){
  const id = this.dataset.id;
  saveModalEdit(id);
});
document.getElementById('modal-delete')?.addEventListener('click', function(){
  const id = this.dataset.id;
  deletePatientById(id);
});

/* Exportar */
document.getElementById('export-patients')?.addEventListener('click', exportPatientsCSV);

/* Inicializar datos al cargar (invocar desde tu init() o directamente aquí) */
function initPatients() {
  // cargar patients (ya se hizo al inicio con let patients = ...)
  renderPatients();
}

