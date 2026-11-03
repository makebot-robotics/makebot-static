// ===================== ACCORDION: one open at a time =====================
(function () {
  var items = document.querySelectorAll('.cd-acc-item');

  items.forEach(function (item) {
    var header = item.querySelector('.cd-acc-header');
    var panel = item.querySelector('.cd-acc-panel');
    var inner = item.querySelector('.cd-acc-panel-inner');

    header.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Close all
      items.forEach(function (i) {
        i.classList.remove('active');
        i.querySelector('.cd-acc-panel').style.maxHeight = null;
      });

      // Open the clicked one (unless it was already open)
      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
})();