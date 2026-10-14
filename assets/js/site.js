/* Grupo Scout 109 «Monte Clavijo» — comportamiento del sitio
   Sin dependencias. Si el JavaScript falla, los enlaces siguen funcionando. */
(function () {
  'use strict';

  /* >>> CAMBIAR: correo al que llegan los mensajes del formulario de "Únete" <<< */
  var CONTACT_EMAIL = 'info@tudominio.org';

  /* ---------- Menú principal en móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Desplegable "Miembros" ---------- */
  var membersBtn = document.querySelector('[aria-controls="members-menu"]');
  var membersMenu = document.getElementById('members-menu');
  if (membersBtn && membersMenu) {
    var setMenu = function (open) {
      membersBtn.setAttribute('aria-expanded', String(open));
      membersMenu.hidden = !open;
    };
    membersBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(membersMenu.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!membersMenu.hidden && !membersMenu.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !membersMenu.hidden) {
        setMenu(false);
        membersBtn.focus();
      }
    });
  }

  /* ---------- Formulario de "Únete" ---------- */
  var form = document.getElementById('join-form');
  if (!form) return;

  var who = form.elements['quien'];
  var ageField = document.getElementById('campo-edad');
  var ageLabel = document.getElementById('etiqueta-edad');
  var age = form.elements['edad'];
  var result = document.getElementById('rama-sugerida');
  var status = document.getElementById('form-estado');

  function ramaPorEdad(n) {
    if (!n || n < 1) return '';
    if (n < 7) return 'Todavía no hay una rama para esa edad. Escríbenos y lo hablamos.';
    if (n === 7) return 'Puede entrar si se incorpora después de julio y cumple 8 años antes de que acabe el año. Escríbenos y lo vemos.';
    if (n <= 10) return 'Por edad, le corresponde la Manada de Lobatos.';
    if (n <= 13) return 'Por edad, le corresponde la Tropa (Sección Scout).';
    if (n <= 16) return 'Por edad, le corresponde la unidad Esculta.';
    if (n <= 21) return 'Por edad, le corresponde el Clan Rover. A partir de los 18 también puede ser scouter.';
    return 'Con esa edad lo que encaja es colaborar como scouter o como gestor.';
  }

  function update() {
    var kid = who.value === 'hijo' || who.value === 'yo';
    ageField.hidden = !kid;
    ageLabel.textContent = who.value === 'yo' ? 'Tu edad' : 'Edad del chico o de la chica';
    result.textContent = kid ? ramaPorEdad(parseInt(age.value, 10)) : '';
  }

  who.addEventListener('change', update);
  age.addEventListener('input', update);
  update();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var kid = who.value === 'hijo' || who.value === 'yo';
    var lines = [
      'Hola:',
      '',
      'Me pongo en contacto desde la web del grupo.',
      '',
      'Motivo: ' + who.options[who.selectedIndex].text,
      'Nombre: ' + f['nombre'].value,
      'Correo: ' + f['correo'].value
    ];
    if (f['telefono'].value) lines.push('Teléfono: ' + f['telefono'].value);
    if (kid && age.value) lines.push(ageLabel.textContent + ': ' + age.value);
    if (f['mensaje'].value) lines.push('', f['mensaje'].value);

    var href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent('Quiero unirme al Grupo Scout Monte Clavijo') +
      '&body=' + encodeURIComponent(lines.join('\n'));

    status.hidden = false;
    status.textContent = 'Se ha abierto tu programa de correo con el mensaje preparado. Si no ha pasado nada, escríbenos a ' + CONTACT_EMAIL + '.';
    window.location.href = href;
  });
})();
