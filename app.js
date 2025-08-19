// Conservé la referencia original al sidebar y al comportamiento hover/click.
// Añadí: navegación por data-page, formularios para Valores, Agenda y Registro, persistencia en localStorage básica.
// NUEVO: Gestión de usuario logueado y logout

const sidebar = document.getElementById('sidebar');
const navLinks = sidebar.querySelectorAll('.nav a');

// Páginas (secciones)
const pages = document.querySelectorAll('.page');

// Verificar si hay usuario logueado al cargar la página
function checkUserAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    // No hay usuario logueado, redirigir a login
    window.location.href = 'registro/registro/index r.html';
    return false;
  }
  
  // Actualizar nombre de usuario en el sidebar
  updateUserInfo(currentUser);
  return true;
}

// Actualizar información de usuario en el sidebar
function updateUserInfo(user) {
  const userName = document.querySelector('.user-info .name');
  const userLink = document.querySelector('.user a');
  
  if (userName) {
    userName.textContent = user.name;
  }
  
  // Actualizar el enlace para logout en lugar de ir a registro
  if (userLink) {
    userLink.onclick = (e) => {
      e.preventDefault();
      logout();
    };
    userLink.title = 'Cerrar sesión';
  }
}

// Función para cerrar sesión
function logout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'registro/registro/index r.html';
  }
}

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
   NUEVA SECCIÓN: Manejo de Pacientes (DATOS) - EN TABLA
   =========================== */
const patientForm = document.getElementById('patient-form');
const patientsTableBody = document.querySelector('#patients-table tbody');

let patientsData = JSON.parse(localStorage.getItem('patientsData') || '[]');

function renderPatients() {
  if (!patientsTableBody) return;
  
  patientsTableBody.innerHTML = '';
  patientsData.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.idnum)}</td>
      <td>${escapeHtml(p.age || '-')}</td>
      <td>${escapeHtml(p.hospital || '-')}</td>
      <td>${escapeHtml(p.notes || '-')}</td>
      <td>
        <button class="btn-delete" data-idx="${idx}">Eliminar</button>
      </td>
    `;
    patientsTableBody.appendChild(tr);
  });
}

patientForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('patient-name').value.trim();
  const idnum = document.getElementById('patient-idnum').value.trim();
  const age = document.getElementById('patient-age').value.trim();
  const hospital = document.getElementById('patient-hospital').value.trim();
  const notes = document.getElementById('patient-notes').value.trim();

  if (!name || !idnum) return alert('Nombre e ID son obligatorios.');

  const newPatient = {
    id: String(Date.now()),
    name, 
    idnum, 
    age, 
    hospital, 
    notes
  };
  
  patientsData.push(newPatient);
  localStorage.setItem('patientsData', JSON.stringify(patientsData));
  renderPatients();
  patientForm.reset();
});

// Eliminar paciente
patientsTableBody?.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) {
    const idx = parseInt(e.target.dataset.idx, 10);
    if (confirm('Eliminar este paciente?')) {
      patientsData.splice(idx, 1);
      localStorage.setItem('patientsData', JSON.stringify(patientsData));
      renderPatients();
    }
  }
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
  // Verificar autenticación antes de continuar
  if (!checkUserAuth()) {
    return; // Si no está autenticado, la función ya redirige
  }

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
  if (!localStorage.getItem('patientsData')) {
    patientsData = [];
    localStorage.setItem('patientsData', JSON.stringify(patientsData));
  }

  // Cargar datos desde localStorage
  valoresData = JSON.parse(localStorage.getItem('valoresData') || '[]');
  agendaData = JSON.parse(localStorage.getItem('agendaData') || '[]');
  registroData = JSON.parse(localStorage.getItem('registroData') || '[]');
  patientsData = JSON.parse(localStorage.getItem('patientsData') || '[]');

  // Renderizar todas las tablas
  renderValores();
  renderAgenda();
  renderRegistro();
  renderPatients();
}

// Función para mostrar tabs (si la necesitas)
function showTab(tabName) {
    var contents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }
    var tab = document.getElementById(tabName);
    if (tab) {
        tab.style.display = "block";
        tab.classList.add("fade-in");
    }
}

// Agregar listener para cuando el usuario cierre la pestaña/navegador
window.addEventListener('beforeunload', () => {
  // Aquí podrías agregar lógica adicional si fuera necesario
});

// Inicializar la aplicación
init();