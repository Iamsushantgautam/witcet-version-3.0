
  document.addEventListener("DOMContentLoaded", function () {
    const protectedLinks = document.querySelectorAll(".no-copy-link");

    protectedLinks.forEach(link => {
      link.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
    });
  });

