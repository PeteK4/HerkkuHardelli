// Music: https://www.purple-planet.com 
// Song name: Sneaky Feet - Category: Playfull
// Licence: https://www.purple-planet.com/using-our-free-music
// Game over musiikki: https://www.zapsplat.com

// Haetaan elementit sivulta
const peliAlue = document.getElementById("pelialue");
const pisteetTeksti = document.getElementById("pisteet");
const tasoTeksti = document.getElementById("taso");
const pisteRivi = document.getElementById("pistetaso");
const aloitusValikko = document.querySelector(".valikko");
const uusiPeli = document.querySelector(".uusipeli-ruutu");
const radiot = document.querySelector(".valikko-radiorivi")
const pklg = document.querySelector(".pklogo");
const minfo = document.querySelector(".musiikki-info");
const goinfo = document.querySelector(".gameover-info");

// Määritetään audio- ja kuvat kansioiden tiedostonimet, polku/pääte määritellään myöhemmin
const tiedostoNimetLeivos = ["leivos1", "leivos2", "leivos3", "leivos4", "leivos5", "leivos6", "leivos7", "leivos8", "leivos9"];
const tiedostoNimetTausta = ["pelitausta1", "pelitausta2", "pelitausta3", "pelitausta4", "pelitausta5"];
const tiedostoNimetAani = ["aani1", "aani2", "aani3"];

// Alustetaan pelin muuttujat sivun avautuessa
let leivosMaara = 22;
let leivosKokoMin = 10;
let leivosKokoMax = 300;
let pelinNopeus = 45;
let leivosNopeus = 3;

let ajastin;
let pisteet = 0;
let pisteLisa = 0;
let taso = 1;
let lisaX = 100
let lisaY = 150
let ekaKaynnistys = true;
let valikko = true;

let musiikkiPauselle = true;
let musiikkiPauselleAika = 0;
let minfoGameover = true;
musiikki.volume = 0.5;

peliAlue.style.cursor = "url('./kuvat/nuoli.webp'), auto"; // Oma hiirenkohdistin

// Määritetään näkyvät ja poistuvat elementit sekä muuttujat pelin alkaessa
function alustaPeli() {
    valikko = false;
    peliAlue.style.borderColor="#705070"
    pisteRivi.style.display = "flex";
    aloitusValikko.style.display = "none";
    uusiPeli.style.display = "none";
    radiot.style.display = "none";
    pklg.style.display = "none";
    minfo.style.display = "none";
    tyhjennaPelialue();
    
    pisteet = 0;
    pisteLisa = 0;
    lisaX = 0
    lisaY = 50
    taso = 1;
    
    leivosLista = [];
    leivosMaara = 1;
    leivosNopeus = .75;
    leivosKokoMin = 170;
    leivosKokoMax = 200;
    pisteetTeksti.textContent = pisteet;
    tasoTeksti.textContent = taso;

    paaOhjelma();
}

// Pääohjelma luo ja pienentää leivoksia
function paaOhjelma() {
    leivosLista = [];

    // Aloitusikkunan kuvaksi valitaan aina sama kuva, peliin arvotaan kuva viidestä eri vaihtoehdosta
    if (ekaKaynnistys) {
        peliAlue.style.backgroundImage = "url(./kuvat/pelitausta5.webp)"
        ekaKaynnistys = false
    } else {
        arvoTaustakuva();
    }
    for (let i = 0; i < leivosMaara; i++) {
        uusiLeivos();
    }
    // Pienennetään ruudulla olevia leivoksia ja seurataan niiden kokoa
    // Ajastin määrittää pelin kokonaisnopeuden
    ajastin = setInterval(() => {
        leivosLista.forEach((leivosKuva, i) => {
            // Pienennetään leivoksia niin kauan, kunnes koko on nolla
            if (leivosKuva.koko >= 0) {
                leivosKuva.koko -= leivosNopeus;
                leivosKuva.elementti.width = leivosKuva.koko;
            } else {
                // Jos ollaan alkuvalikossa, arvotaan uusi leivos sen saavuttaessa nolla koon
                if (valikko) {
                    leivosLista[i].koko = uusiKoko();
                    leivosLista[i].elementti.style.left = uusiPaikka().paikkaX + "px";
                    leivosLista[i].elementti.style.top = uusiPaikka().paikkaY + "px";
                } else {
                    // Pelimoodissa leivoksen saavuttaessa nolla koon, peli loppuu
                    peliOhi();
                }
            }
        });
    }, pelinNopeus); // ajastimen intervalli
}

// Tyhjennetään pelialue leivoksista
function tyhjennaPelialue() {
    leivosLista.forEach((leivosKuva) => {
        peliAlue.removeChild(leivosKuva.elementti);
    });
    leivosLista = [];
}

// Luodaan uusi leivos sattumanvaraiseen paikkaan eri kokoisina
function uusiLeivos() {
    const leivos = document.createElement("img");
    if (valikko) {leivos.style.cursor = "url('./kuvat/nuoli.webp'), auto";} // Jos ollaan alkuvalikossa, kohdistin ei reagoi leivoksiin.
    leivos.width = uusiKoko();
    leivos.src = (tiedostoNimetLeivos.map((nimi) => `./kuvat/${nimi}.webp`))[Math.floor(Math.random() * tiedostoNimetLeivos.length)];
    leivos.draggable = false; // Poistetaan kuvien raahausmahdollisuus

    // Seurataan hiiren toimintoja
    leivos.addEventListener("mousedown", (event) => {
        
        // Pelitilan toiminnot, kun ei olla alkuvalikossa
        if (!valikko) {
            tahti(event); // luodaan .gif animaatio klikatun leivoksen kohdalle
            // Äänet valitaan kolmesta vaihtoehdosta, jos äänet on valittu päälle
            if (document.querySelector('input[name="aanet"]:checked').id == "aanet-on") {
                new Audio(`./audio/${tiedostoNimetAani[Math.floor(Math.random() * tiedostoNimetAani.length)]}.mp3`).play(); 
            }
             // Pisteenkertymislogiikkaa ja tason nostoa
            pisteet++;
            pisteetTeksti.textContent = pisteet;

            if (pisteet == 30 + pisteLisa) {
                leivosMaara += 1;
                pisteLisa += 50;
                tasoTeksti.textContent = leivosMaara;
                uusiLeivos();
            }
            
            // Arvotaan leivoksen kuva ja uusi paikka. Tiedostopolku ja -nimi muodostetaan alussa määritellyistä nimistä
            leivos.src = (tiedostoNimetLeivos.map((nimi) => `./kuvat/${nimi}.webp`))[Math.floor(Math.random() * tiedostoNimetLeivos.length)];
            leivos.width = uusiKoko();
            leivos.style.left = uusiPaikka().paikkaX + "px";
            leivos.style.top = uusiPaikka().paikkaY + "px";
            leivosLista.find((leivosKuva) => leivosKuva.elementti == leivos).koko = uusiKoko();
        }
    });

    // Muodostetaan haluttu hiirenkohdistin sen ollessa pelialueella 
    leivos.addEventListener("mouseover", () => {
        if (!valikko) {
            peliAlue.style.cursor = "url('./kuvat/kasi.webp'), auto";
        }
    });

    leivos.addEventListener("mouseout", () => {
        if (!valikko) {
            peliAlue.style.cursor = "url('./kuvat/nuoli.webp'), auto";
        }
    });

    // Leivoksen satunnainen paikka
    leivos.style.left = uusiPaikka().paikkaX + "px";
    leivos.style.top = uusiPaikka().paikkaY + "px";

    // Pyritään asettamaan uusi leivos aina muiden alle, ettei aikaisemmin tulleet ja jo pienentyneet jäisi isompien alle
    if (peliAlue.firstChild) {
        peliAlue.insertBefore(leivos, peliAlue.firstChild);
    } else {
        peliAlue.appendChild(leivos);
    }
    // Lisätään leivos listalle 
    leivosLista.push({elementti: leivos, koko: uusiKoko()});
}

// Arvotaan leivokselle uusi paikka
function uusiPaikka() {
    const paikkaX = Math.floor(Math.random() * (peliAlue.offsetWidth - leivosKokoMax) + lisaX);
    const paikkaY = Math.floor(Math.random() * (peliAlue.offsetHeight - leivosKokoMax) + lisaY);
    return {paikkaX, paikkaY};
}


// Arvotaan leivokselle uusi koko
function uusiKoko() {
    return Math.floor(Math.random() * (leivosKokoMax - leivosKokoMin)) + leivosKokoMin;
}

// Luodaan kuvaelementti .gif animaatiolle hiiren klikkauksen kohdalle
function tahti(event) {
    const gif = document.createElement("img");
    gif.src = "./kuvat/napattu.gif"; 
    gif.style.position = "absolute";
    gif.style.width = "80px";
    gif.style.height = "80px";
    gif.style.left = `${event.clientX - 40}px`;
    gif.style.top = `${event.clientY - 40}px`;
    document.body.appendChild(gif);
    // Odotetaan 200 millisekunttia ja poistetaan kuvaelementti
    setTimeout(() => {
        document.body.removeChild(gif);
    }, 200);
}

// Leivos karkaa ja peli on ohi.
function peliOhi() {
    // Soitetaan loppufanfaari, jos musiikit on päällä
    musiikkiOnOff(false);
    if (document.querySelector('input[name="musiikki"]:checked').id == "musiikki-on") {
        new Audio("./audio/GameOver.mp3").play(); 
    }
    // Tyhjennetään pelialue, sytytellään ja sammutellaan elementtejä pelialueella
    // Arvotaan uusi pelialueen taustakuva, nollataan ajastin
    // Loppupisteet ja taso ruudulle näkyviin
    peliAlue.style.borderColor="#fff";
    arvoTaustakuva();
    clearInterval(ajastin);
    tyhjennaPelialue();
    uusiPeli.style.display = "block";
    pisteRivi.style.display = "none";
    document.getElementById("loppupisteet").innerText = pisteet;
    document.getElementById("lopputaso").innerText = leivosMaara;
    minfoGameover = false;
    // Odotellaan, että loppufanfaari on soinut ja jatketaan pelimusiikilla, jos musiikki on valittuna päälle alkuvalikossa
        if (document.querySelector('input[name="musiikki"]:checked').id == "musiikki-on") {
        setTimeout(function() {
            musiikkiOnOff(true);
        }, 6000);
    }
}

// Koko homma alusta uusiksi
function etuSivu() {
    location.reload();
}

// Taustakuva arvotaan viidestä eri kuvasta. Tiedostopolku- ja nimi muodostetaan alussa luodusta nimilistasta.
function arvoTaustakuva() {
    const tausta = tiedostoNimetTausta[Math.floor(Math.random() * tiedostoNimetTausta.length)];
    peliAlue.style.backgroundImage = `url('${`./kuvat/${tausta}.webp`}')`;
}

// Soitetaan pelimusiikkia ja laitetaan se pauselle, jos radio button valinta on Musiikki: Pois
// Musiikki jatkaa samasta kohdin mihin se jäi ennen pausea
function musiikkiOnOff(tila) {
    if (tila) {
        if (musiikkiPauselle) {
            musiikki.play();
            musiikki.currentTime = musiikkiPauselleAika;
            musiikkiPauselle = false;
            if (minfoGameover) {
            minfo.style.display = "block";
            }
        } else {
            musiikki.play();
        }
    } else {
        if (musiikki.paused) {
            musiikkiPauselle = false;
        } else {
            musiikkiPauselle = true;
            musiikkiPauselleAika = musiikki.currentTime;
            musiikki.pause();
            minfo.style.display = "none";
        }
    }
}

// Kutsutaan pääohjelmaa
paaOhjelma();
