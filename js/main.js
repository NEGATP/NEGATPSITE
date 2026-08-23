// ============================================
// NEGATP Sarl — main.js
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
    });
  }

  /* ---------- Placeholders images manquantes ---------- */
  // Tant que les vraies photos (image1.jpg, image2.jpg, ...) ne sont pas
  // encore déposées dans /images/gallery/, on affiche un bloc "REF" au lieu
  // d'une icône d'image cassée.
  document.querySelectorAll('img[data-fallback-label]').forEach(function (img) {
    img.addEventListener('error', function () {
      var label = img.getAttribute('data-fallback-label');
      var ph = document.createElement('div');
      ph.className = 'ph';
      ph.textContent = label;
      img.replaceWith(ph);
    });
  });

  /* ---------- Filtre galerie (page Réalisations) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          if (cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.hidden = false;
          } else {
            item.hidden = true;
          }
        });
      });
    });
  }

  /* ---------- Formulaire "Demander un devis" ---------- */
  var form = document.getElementById('devis-form');
  if (form) {
    // Numéro WhatsApp NEGATP au format international sans "+" ni "0" initial
    var WHATSAPP_NUMBER = '2250707957574';
    // ID Formspree à remplacer par le vôtre (créez un formulaire sur https://formspree.io)
    var FORMSPREE_ENDPOINT = 'https://formspree.io/f/FAUXID123';

    var statusBox = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nom = form.nom.value.trim();
      var tel = form.telephone.value.trim();
      var email = form.email.value.trim();
      var ville = form.ville.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      if (!nom || !tel || !service) {
        showStatus(false, "Merci de renseigner au minimum votre nom, votre téléphone et le service concerné.");
        return;
      }

      // --- 1. Construction du message WhatsApp pré-rempli ---
      var waText =
        'Bonjour NEGATP, je souhaite une demande de devis.%0A' +
        '— Nom : ' + nom + '%0A' +
        '— Téléphone : ' + tel + '%0A' +
        (email ? '— Email : ' + email + '%0A' : '') +
        (ville ? '— Ville / Commune : ' + ville + '%0A' : '') +
        '— Service concerné : ' + service + '%0A' +
        (message ? '— Détails : ' + message : '');

      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;

      // --- 2. Envoi en parallèle vers Formspree (copie email) ---
      var formData = new FormData(form);
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).catch(function () {
        // L'échec de l'email n'empêche pas la démarche WhatsApp de continuer.
      });

      // --- 3. Ouverture de WhatsApp avec le message prêt à envoyer ---
      window.open(waUrl, '_blank');

      showStatus(true, "Votre message est prêt dans WhatsApp — il ne reste qu'à l'envoyer. Une copie a aussi été transmise par email à NEGATP.");
      form.reset();
    });

    function showStatus(ok, text) {
      if (!statusBox) return;
      statusBox.textContent = text;
      statusBox.className = 'form-status show ' + (ok ? 'ok' : 'err');
    }
  }

});
