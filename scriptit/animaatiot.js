window.addEventListener("DOMContentLoaded", () => {
  const pelialue = document.getElementById("pelialue");

  // Määritetään scrollausmatkanpää riippuen ruudun koosta
  let loppupiste = 120;
  if (window.innerWidth < 992) {
    loppupiste = 0;
  }

  // Aloituspiste ja elementti näkyviin
  pelialue.style.top = `${-pelialue.offsetHeight - 700}px`;
  pelialue.style.opacity = "0";
  pelialue.style.display = "flex";

  // Liike 
  setTimeout(() => {
    // Liike 
    requestAnimationFrame(() => {
      pelialue.style.transition = "top 1s ease-out, opacity 1.3s ease-in-out";
      pelialue.style.top = `${loppupiste}px`;
      pelialue.style.opacity = "1";
    });
  }, 500); // Aseta tarvittava aikaviive millisekunteina
});
