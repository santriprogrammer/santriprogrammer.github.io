/* =====================================================
   DOFIRI AL-MADURI
   PARTICLE NETWORK ANIMATION
   MULTI CANVAS VERSION
===================================================== */


/* =====================================================
   PENGATURAN
===================================================== */

const settings = {

    // Jumlah particle pada desktop
    desktopParticles: 75,

    // Jumlah particle pada HP
    mobileParticles: 35,

    // Jarak maksimal antar particle
    connectionDistance: 145,

    // Kecepatan gerakan particle
    particleSpeed: 0.35,

    // Ukuran dasar particle
    particleSize: 2,

    // Transparansi garis
    lineOpacity: 0.18,

    // Transparansi particle
    particleOpacity: 0.55

};


/* =====================================================
   FUNGSI MEMBUAT ANIMASI
   Fungsi ini dapat digunakan untuk banyak canvas.
===================================================== */

function initParticleNetwork(canvas) {

    /*
       Context 2D digunakan untuk menggambar
       particle dan garis pada canvas.
    */

    const ctx = canvas.getContext("2d");


    /*
       Setiap canvas memiliki particle sendiri.
       Jadi animasi Hero dan Layanan tidak saling
       mengganggu.
    */

    let particles = [];


    /* =================================================
       RESIZE CANVAS
    ================================================= */

    function resizeCanvas() {

        /*
           Parent canvas menjadi acuan ukuran.

           Karena canvas berada di dalam section,
           ukuran canvas mengikuti section tersebut.
        */

        const parent = canvas.parentElement;

        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;


        /*
           Setelah ukuran berubah,
           particle dibuat kembali.
        */

        createParticles();

    }


    /* =================================================
       JUMLAH PARTICLE
    ================================================= */

    function getParticleCount() {

        /*
           Jika layar HP, particle lebih sedikit
           supaya performa tetap ringan.
        */

        if (window.innerWidth <= 768) {

            return settings.mobileParticles;

        }


        return settings.desktopParticles;

    }


    /* =================================================
       BUAT PARTICLES
    ================================================= */

    function createParticles() {

        particles = [];


        const total = getParticleCount();


        for (let i = 0; i < total; i++) {

            particles.push({

                /*
                   Posisi awal X
                */

                x:
                    Math.random()
                    * canvas.width,


                /*
                   Posisi awal Y
                */

                y:
                    Math.random()
                    * canvas.height,


                /*
                   Kecepatan X
                */

                vx:
                    (Math.random() - 0.5)
                    * settings.particleSpeed,


                /*
                   Kecepatan Y
                */

                vy:
                    (Math.random() - 0.5)
                    * settings.particleSpeed,


                /*
                   Ukuran particle
                */

                size:
                    Math.random()
                    * settings.particleSize
                    + 1,


                /*
                   Transparansi
                */

                opacity:
                    Math.random()
                    * 0.35
                    + settings.particleOpacity,


                /*
                   Posisi awal pulse
                */

                pulse:
                    Math.random()
                    * Math.PI
                    * 2,


                /*
                   Kecepatan pulse
                */

                pulseSpeed:
                    Math.random()
                    * 0.02
                    + 0.005

            });

        }

    }


    /* =================================================
       UPDATE PARTICLES
    ================================================= */

    function updateParticles() {

        particles.forEach(particle => {


            /*
               Gerakkan particle
            */

            particle.x += particle.vx;

            particle.y += particle.vy;


            /*
               Pantulan kiri dan kanan
            */

            if (
                particle.x < 0 ||
                particle.x > canvas.width
            ) {

                particle.vx *= -1;

            }


            /*
               Pantulan atas dan bawah
            */

            if (
                particle.y < 0 ||
                particle.y > canvas.height
            ) {

                particle.vy *= -1;

            }


            /*
               Pulse membuat ukuran particle
               sedikit membesar dan mengecil.
            */

            particle.pulse +=
                particle.pulseSpeed;

        });

    }


    /* =================================================
       GAMBAR PARTICLE
    ================================================= */

    function drawParticles() {

        particles.forEach(particle => {


            /*
               Efek pulse
            */

            const pulse =
                Math.sin(particle.pulse)
                * 0.35
                + 0.65;


            /*
               Ukuran particle setelah pulse
            */

            const radius =
                particle.size
                * pulse;


            /* -----------------------------------------
               GLOW
            ----------------------------------------- */

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                radius * 3,
                0,
                Math.PI * 2
            );


            /*
               Gradient cahaya
            */

            const gradient =
                ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    radius * 4
                );


            gradient.addColorStop(
                0,
                `rgba(220,255,130,${0.18 * pulse})`
            );


            gradient.addColorStop(
                1,
                "rgba(220,255,130,0)"
            );


            ctx.fillStyle = gradient;

            ctx.fill();


            /* -----------------------------------------
               TITIK UTAMA
            ----------------------------------------- */

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    245,
                    255,
                    220,
                    ${particle.opacity * pulse}
                )`;


            ctx.fill();

        });

    }


    /* =================================================
       HUBUNGKAN PARTICLES
    ================================================= */

    function drawConnections() {

        for (
            let i = 0;
            i < particles.length;
            i++
        ) {


            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {


                const p1 = particles[i];

                const p2 = particles[j];


                /*
                   Selisih posisi
                */

                const dx =
                    p1.x - p2.x;


                const dy =
                    p1.y - p2.y;


                /*
                   Hitung jarak
                */

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                /*
                   Jika jaraknya cukup dekat,
                   buat garis.
                */

                if (
                    distance <
                    settings.connectionDistance
                ) {


                    /*
                       Semakin jauh,
                       semakin transparan.
                    */

                    const opacity =
                        (
                            1 -
                            distance /
                            settings.connectionDistance
                        )
                        *
                        settings.lineOpacity;


                    ctx.beginPath();


                    ctx.moveTo(
                        p1.x,
                        p1.y
                    );


                    ctx.lineTo(
                        p2.x,
                        p2.y
                    );


                    ctx.strokeStyle =
                        `rgba(
                            245,
                            255,
                            220,
                            ${opacity}
                        )`;


                    ctx.lineWidth = 0.7;


                    ctx.stroke();

                }

            }

        }

    }


    /* =================================================
       ANIMASI
    ================================================= */

    function animate() {


        /*
           Bersihkan canvas
        */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
           Gerakkan particle
        */

        updateParticles();


        /*
           Gambar garis
        */

        drawConnections();


        /*
           Gambar titik
        */

        drawParticles();


        /*
           Jalankan frame berikutnya
        */

        requestAnimationFrame(
            animate
        );

    }


    /* =================================================
       START ANIMATION
    ================================================= */

    function startAnimation() {

        resizeCanvas();

        animate();

    }


    /* =================================================
       RESIZE WINDOW
    ================================================= */

    let resizeTimeout;


    window.addEventListener(
        "resize",
        () => {


            /*
               Jangan resize terlalu sering.
            */

            clearTimeout(
                resizeTimeout
            );


            resizeTimeout =
                setTimeout(
                    () => {

                        resizeCanvas();

                    },
                    200
                );

        }
    );


    /* =================================================
       JALANKAN
    ================================================= */

    startAnimation();

}


/* =====================================================
   AKTIFKAN CANVAS HERO
===================================================== */

const heroCanvas =
    document.getElementById(
        "particle-network"
    );


if (heroCanvas) {

    initParticleNetwork(
        heroCanvas
    );

}


/* =====================================================
   AKTIFKAN CANVAS LAYANAN
===================================================== */

const layananCanvas =
    document.getElementById(
        "particle-network-layanan"
    );


if (layananCanvas) {

    initParticleNetwork(
        layananCanvas
    );

}
