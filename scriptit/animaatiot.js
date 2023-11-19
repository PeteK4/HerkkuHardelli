// Scrollataan pelialue ylhäältä alas sivun avautuessa

window.addEventListener("DOMContentLoaded", () => {
  const pelialue = document.getElementById("pelialue");

// Määäritetään scrollausmatkanpää riippuen ruudun koosta
  let loppupiste = 120;
  if (window.innerWidth < 992) {
    loppupiste = 0;
  }

  const alkupiste = -pelialue.offsetHeight - 600;
  pelialue.style.display = "flex"
  pelialue.style.top = `${alkupiste}px`;

  setTimeout(() => {
    pelialue.style.transition = "top 1s";
    pelialue.style.top = `${loppupiste}px`;
  }, 100);
});