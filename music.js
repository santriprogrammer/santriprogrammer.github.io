const music = document.getElementById("background-music");
const musicButton = document.getElementById("music-button");

let musicStarted = false;


/* =====================================================
   COBA AUTOPLAY
   ===================================================== */

function startMusic() {

    music.volume = 0.35;

    const playPromise = music.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                musicStarted = true;

                musicButton.innerHTML =
                    '<i class="bi bi-volume-up-fill"></i>';

            })
            .catch(() => {

                /* Autoplay diblokir browser.
                   Tunggu interaksi pengguna. */

            });

    }

}


/* =====================================================
   KLIK TOMBOL MUSIC
   ===================================================== */

musicButton.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        musicButton.innerHTML =
            '<i class="bi bi-volume-up-fill"></i>';

    } else {

        music.pause();

        musicButton.innerHTML =
            '<i class="bi bi-volume-mute-fill"></i>';

    }

});


/* =====================================================
   JIKA AUTOPLAY DIBLOKIR,
   PUTAR SETELAH PENGUNJUNG BERINTERAKSI
   ===================================================== */

function userInteraction() {

    if (!musicStarted) {

        music.volume = 0.35;

        music.play()
            .then(() => {

                musicStarted = true;

                musicButton.innerHTML =
                    '<i class="bi bi-volume-up-fill"></i>';

            })
            .catch(() => {});

    }

}


/* Interaksi pertama pengunjung */

document.addEventListener(
    "click",
    userInteraction,
    { once: true }
);

document.addEventListener(
    "touchstart",
    userInteraction,
    { once: true }
);

document.addEventListener(
    "keydown",
    userInteraction,
    { once: true }
);


/* =====================================================
   JALANKAN AUTOPLAY
   ===================================================== */

startMusic();
