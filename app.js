(function () {
  "use strict";

  const CART_KEY = "ghc_cart_v1";
  const ORDERS_KEY = "ghc_orders_v1";
  const CHANNEL_NAME = "garasi_helm_custom_realtime_v1";

            // Konfigurasi varian kustomisasi resmi untuk helm #01 s/d #05
      const customVariantsByNum = {
        1: [
          { key: "default", label: "Standard (Smoke Visor)", gambar: "gambar/1.jpg", priceDelta: 0 },
          { key: "novisor", label: "No Visor", gambar: "gambar/1-novisor.jpg", priceDelta: -150000 },
          { key: "redvisor", label: "Red Iridium Visor", gambar: "gambar/1-redvisor.jpg", priceDelta: 200000 },
          { key: "visorbiru", label: "Blue Iridium Visor", gambar: "gambar/1-visorbiru.jpg", priceDelta: 200000 }
        ],
        2: [
          { key: "default", label: "Standard Studio", gambar: "gambar/2.jpg", priceDelta: 0 },
          { key: "electricblue", label: "Electric Blue", gambar: "gambar/2-electricblue.jpg", priceDelta: 250000 },
          { key: "novisor", label: "No Visor", gambar: "gambar/2-novisor.jpg", priceDelta: -150000 },
          { key: "pink", label: "Pink Edition", gambar: "gambar/2-pink.jpg", priceDelta: 250000 }
        ],
        3: [
          { key: "default", label: "Standard Studio", gambar: "gambar/3.jpg", priceDelta: 0 },
          { key: "blueorange", label: "Blue Orange", gambar: "gambar/3-blueorange.jpg", priceDelta: 250000 },
          { key: "magenta", label: "Magenta Edition", gambar: "gambar/3-magenta.jpg", priceDelta: 250000 },
          { key: "novisor", label: "No Visor", gambar: "gambar/3-novisor.jpg", priceDelta: -150000 }
        ],
        4: [
          { key: "default", label: "Green Visor (Default)", gambar: "gambar/4.jpg", priceDelta: 0 },
          { key: "silver", label: "Silver Chrome", gambar: "gambar/4-silver.jpg", priceDelta: 300000 },
          { key: "white", label: "Arctic White", gambar: "gambar/4-white.jpg", priceDelta: 200000 },
          { key: "yellowvisor", label: "Yellow Visor", gambar: "gambar/4-yellowvisor.jpg", priceDelta: 200000 }
        ],
        5: [
          { key: "default", label: "Golden Carnival (Default)", gambar: "gambar/5.jpg", priceDelta: 0 },
          { key: "black", label: "Obsidian Black", gambar: "gambar/5-black.jpg", priceDelta: 250000 },
          { key: "blue", label: "Royal Blue", gambar: "gambar/5-blue.jpg", priceDelta: 250000 },
          { key: "feather", label: "Feather Crest Spec", gambar: "gambar/5-feather.jpg", priceDelta: 450000 }
        ]
      };

// Daftar resmi 24 nomor kategori Full Face
      const FULL_FACE_NUMBERS = new Set([
        1, 2, 3, 8, 11, 12, 16, 18, 19, 20, 21, 23, 27, 28, 32, 34, 35, 45, 51, 52, 71, 73, 74, 75
      ]);

      // Daftar resmi 66 nomor kategori Custom Edition (termasuk nomor 4)
      const CUSTOM_EDITION_NUMBERS = new Set([
        4, 5, 6, 7, 13, 14, 15, 17, 22, 24, 25, 29, 30, 36, 38, 39, 40, 41, 42, 43, 44, 46, 48,
        53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 72,
        76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
      ]);

// Spesifikasi khusus yang disesuaikan dengan gambar asli helm
      const specialSpecs = {
        1: { category: "full-face", meta: "Full Face · ECE 22.06 · SNI", title: "Garasi Studio Pro Series #01", desc: "Cangkang komposit serat karbon berprofil aerodinamis dengan lapisan finishing studio anti-gores.", size: "S – XL", weight: "1.350 g", status: "Tersedia", price: "Rp 3.250.000", sku: "GHC-FF-01" },
        2: { category: "full-face", meta: "Full Face · ECE 22.06 · SNI", title: "Garasi Studio Pro Series #02", desc: "Desain kontur modern untuk berkendara jarak jauh dengan ventilasi multi-saluran dan visor optik kelas 1.", size: "S – XL", weight: "1.380 g", status: "Tersedia", price: "Rp 3.300.000", sku: "GHC-FF-02" },
        3: { category: "full-face", meta: "Full Face · ECE 22.06 · SNI", title: "Garasi Studio Pro Series #03", desc: "Dilengkapi spoiler belakang terintegrasi, pengunci Double D-Ring, dan busa pipi pembuang kelembapan.", size: "XS – XL", weight: "1.360 g", status: "Tersedia", price: "Rp 3.350.000", sku: "GHC-FF-03" },
        4: { category: "custom-edition", meta: "Custom Sci-Fi · ECE 22.06 · SNI", title: "Garasi Xenomorph Green Visor #04", desc: "Helm kustom bertema alien futuristik dengan visor hijau neon anti-silau dan lapisan peredam akustik.", size: "M – XXL", weight: "1.390 g", status: "Tersedia", price: "Rp 3.400.000", sku: "GHC-CS-04" },
        5: { category: "custom-edition", meta: "Custom Artisan · ECE 22.06 · SNI", title: "Garasi Golden Carnival Mask #05", desc: "Helm kustom artistik terinspirasi topeng karnaval Venesia dengan ukiran ornamen emas mewah dan finishing studio gloss.", size: "S – XL", weight: "1.370 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-CS-05" },
        6: { category: "custom-edition", meta: "Custom Concept · SNI 1811", title: "Garasi Apollo Astronaut Spec #06", desc: "Terinspirasi helm penjelajah luar angkasa dengan visor panorama luas dan lapisan pelindung UV reflektif.", size: "M – XL", weight: "1.520 g", status: "Stok Terbatas", price: "Rp 4.650.000", sku: "GHC-CS-06" },
        7: { category: "custom-edition", meta: "Custom Armor · SNI 1811", title: "Garasi Sovereign Gold Knight #07", desc: "Finishing metalik emas bergaya zirah ksatria abad pertengahan dengan struktur pelindung dagu kokoh.", size: "M – L", weight: "1.580 g", status: "Stok Terbatas", price: "Rp 4.890.000", sku: "GHC-CS-07" },
        8: { category: "full-face", meta: "Full Face · Custom Heritage · SNI 1811", title: "Garasi Chronos Steampunk Ed. #08", desc: "Helm full-face dengan ornamen kuningan mekanis, aksen kulit klasik, dan lensa optik ganda berstandar SNI.", size: "S – XL", weight: "1.550 g", status: "Tersedia", price: "Rp 4.500.000", sku: "GHC-FF-08" },
        9: { category: "half-face", meta: "Half Face · Retro-Tech · SNI 1811", title: "Garasi RetroVision Half Face CRT-90 #09", desc: "Cangkang half-face kustom bergaya retro klasik 90-an dengan visor polikarbonat cembung jernih.", size: "M – XL", weight: "1.280 g", status: "Pre-Order", price: "Rp 2.750.000", sku: "GHC-HF-09" },
        10: { category: "half-face", meta: "Half Face · Sculpted Spec · SNI 1811", title: "Garasi Diablo Half Face Spec #10", desc: "Helm half-face dengan aksen aerodinamis fleksibel lepas-aman serta pengunci Microlock baja.", size: "S – XL", weight: "1.260 g", status: "Tersedia", price: "Rp 2.850.000", sku: "GHC-HF-10" },
        11: { category: "full-face", meta: "Full Face · Custom Sculpted · SNI 1811", title: "Garasi Monarch Crest Edition #11", desc: "Helm full-face berdetail mahkota dan ornamen relief timbul di atas shell komposit ABS berkekuatan tarik tinggi.", size: "M – XL", weight: "1.490 g", status: "Tersedia", price: "Rp 3.950.000", sku: "GHC-FF-11" },
        12: { category: "full-face", meta: "Full Face · Custom Form · SNI 1811", title: "Garasi Avant-Garde Form X #12", desc: "Helm full-face berstruktur pahatan kustom unik dengan lapisan peredam benturan Multi-Density EPS penuh.", size: "S – XL", weight: "1.510 g", status: "Tersedia", price: "Rp 4.100.000", sku: "GHC-FF-12" },
        13: { category: "custom-edition", meta: "Custom Character · SNI 1811", title: "Garasi Cobalt Fur Monster #13", desc: "Balutan bulu sintetis biru kobalt tahan cuaca di atas cangkang helm kustom berstandar SNI dengan pandangan luas.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 2.450.000", sku: "GHC-CS-13" },
        14: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Apex Great White Shark #14", desc: "Sirip punggung aerodinamis dan grafis rahang hiu agresif dengan sistem sirkulasi udara insang samping.", size: "S – XL", weight: "1.480 g", status: "Tersedia", price: "Rp 3.790.000", sku: "GHC-CS-14" },
        15: { category: "custom-edition", meta: "Custom Fruit Edition · SNI 1811", title: "Garasi Fresh Strawberry Custom #15", desc: "Helm kustom berbentuk buah stroberi merah merona dengan tekstur bintik biji dan mahkota daun hijau di puncak cangkang.", size: "S – L", weight: "1.440 g", status: "Tersedia", price: "Rp 2.950.000", sku: "GHC-CS-15" },
        16: { category: "full-face", meta: "Full Face · Sci-Fi Spec · SNI 1811", title: "Garasi Xenomorph Green Alien #16", desc: "Helm full-face hijau metalik futuristik dengan kontur memanjang aerodinamis dan visor gelap anti-silau.", size: "M – XL", weight: "1.500 g", status: "Stok Terbatas", price: "Rp 3.890.000", sku: "GHC-FF-16" },
        17: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Musang King Edition #17", desc: "Tekstur pahatan elastomer lentur yang aman dan tidak melukai, dipadukan cangkang dalam berstandar SNI.", size: "M – XL", weight: "1.540 g", status: "Tersedia", price: "Rp 3.650.000", sku: "GHC-CS-17" },
        18: { category: "full-face", meta: "Full Face · Custom Airbrush · SNI 1811", title: "Garasi Fresh Watermelon Spec #18", desc: "Helm full-face airbrush presisi motif kulit dan daging semangka segar dengan lapisan clear coat gloss tinggi.", size: "S – XL", weight: "1.390 g", status: "Tersedia", price: "Rp 2.750.000", sku: "GHC-FF-18" },
        19: { category: "full-face", meta: "Full Face · Custom 3D · SNI 1811", title: "Garasi Sculpted Bowl Edition #19", desc: "Helm full-face kustom 3D lengkap dengan detail ornamen pahatan presisi di atas cangkang ABS teruji.", size: "M – XL", weight: "1.560 g", status: "Stok Terbatas", price: "Rp 4.250.000", sku: "GHC-FF-19" },
        20: { category: "full-face", meta: "Full Face · Custom Edition · SNI 1811", title: "Garasi Glazed Sprinkle Spec #20", desc: "Helm full-face dengan kontur membulat ergonomis, finishing gloss kustom, serta sirkulasi udara tersembunyi.", size: "XS – L", weight: "1.430 g", status: "Tersedia", price: "Rp 3.490.000", sku: "GHC-FF-20" },
        21: { category: "full-face", meta: "Full Face · Custom Edition · SNI 1811", title: "Garasi Golden Melt Spec #21", desc: "Helm full-face tekstur pahatan satin-gloss dengan sistem pengunci Microlock baja dan interior lepas-pasang.", size: "S – XL", weight: "1.420 g", status: "Tersedia", price: "Rp 3.390.000", sku: "GHC-FF-21" },
        29: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Shiba Inu Edition #29", desc: "Helm karakter anjing Shiba Inu Jepang berwarna cokelat keemasan dengan telinga tegak dan interior hippoallergenic.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.550.000", sku: "GHC-CS-29" },
        48: { category: "custom-edition", meta: "Custom Geometric · SNI 1811", title: "Garasi Rubik Cube 3D Spec #48", desc: "Helm kustom berbentuk kubus teka-teki Rubik warna-warni primer mengilap dengan ventilasi tersembunyi.", size: "M – XL", weight: "1.490 g", status: "Tersedia", price: "Rp 3.850.000", sku: "GHC-CS-48" },
        53: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Alpaca Fluffy Custom #53", desc: "Helm karakter Alpaca berbulu lembut warna krem dengan telinga tegak dan pandangan visor lebar.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-CS-53" },
        54: { category: "custom-edition", meta: "Custom Fruit Edition · SNI 1811", title: "Garasi Fresh Avocado Spec #54", desc: "Helm kustom berbentuk belahan buah alpukat hijau lengkap dengan tekstur biji 3D di bagian atas cangkang.", size: "S – XL", weight: "1.430 g", status: "Tersedia", price: "Rp 3.390.000", sku: "GHC-CS-54" },
        55: { category: "custom-edition", meta: "Custom Character · SNI 1811", title: "Garasi Blue Fur Monster #55", desc: "Helm berbalut bulu sintetis biru elektrik dengan aksen tanduk mini dan busa dalam empuk berstandar SNI.", size: "S – XL", weight: "1.460 g", status: "Tersedia", price: "Rp 3.290.000", sku: "GHC-CS-55" },
        56: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Capybara Chill Edition #56", desc: "Helm karakter Capybara dengan ekspresi tenang ikonik dan sistem sirkulasi udara multi-saluran.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.590.000", sku: "GHC-CS-56" },
        57: { category: "custom-edition", meta: "Custom Concept · SNI 1811", title: "Garasi Nimbus White Cloud #57", desc: "Helm berbentuk gumpalan awan putih lembut yang ringan dan aerodinamis untuk berkendara santai.", size: "S – XL", weight: "1.410 g", status: "Tersedia", price: "Rp 3.350.000", sku: "GHC-CS-57" },
        58: { category: "custom-edition", meta: "Custom Concept · SNI 1811", title: "Garasi Apollo Astronaut Studio #58", desc: "Replika helm penjelajah luar angkasa dengan visor panorama luas dan modul komunikasi samping.", size: "M – XL", weight: "1.520 g", status: "Stok Terbatas", price: "Rp 4.650.000", sku: "GHC-CS-58" },
        59: { category: "custom-edition", meta: "Custom Retro-Tech · SNI 1811", title: "Garasi Retro CRT-90 TV Spec #59", desc: "Helm kustom berbentuk televisi tabung retro era 90-an lengkap dengan antena dan visor layar kaca jernih.", size: "M – XL", weight: "1.510 g", status: "Tersedia", price: "Rp 4.150.000", sku: "GHC-CS-59" },
        60: { category: "custom-edition", meta: "Custom Armor · SNI 1811", title: "Garasi Sovereign Gold Knight #60", desc: "Helm zirah kesatria abad pertengahan berlapis cat metalik emas dengan pelindung dagu kokoh.", size: "M – L", weight: "1.580 g", status: "Stok Terbatas", price: "Rp 4.890.000", sku: "GHC-CS-60" },
        61: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Cheeseburger Deluxe #61", desc: "Helm bertema hamburger lengkap dengan lapisan roti wijen, patty daging, keju leleh, dan selada hijau.", size: "M – XL", weight: "1.490 g", status: "Tersedia", price: "Rp 3.750.000", sku: "GHC-CS-61" },
        62: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Bamboo Dimsum Steamer #62", desc: "Helm kreatif berbentuk bakpao dan dimsum hangat di dalam wadah kukusan anyaman bambu.", size: "M – XL", weight: "1.480 g", status: "Tersedia", price: "Rp 3.850.000", sku: "GHC-CS-62" },
        63: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Glazed Cinnamon Roll #63", desc: "Helm berbentuk gulungan roti kayu manis dengan lapisan glasir gula putih bertekstur realistis.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 3.590.000", sku: "GHC-CS-63" },
        64: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Golden Butter Texture #64", desc: "Helm minimalis bertekstur olesan mentega lembut warna kuning pastel dengan kilau satin anti-gores.", size: "S – XL", weight: "1.420 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-CS-64" },
        65: { category: "custom-edition", meta: "Custom Marine Series · SNI 1811", title: "Garasi Translucent Jellyfish #65", desc: "Helm kubah transparan menyerupai ubur-ubur laut dengan aksen tentakel lembut di bagian belakang.", size: "M – XL", weight: "1.470 g", status: "Stok Terbatas", price: "Rp 4.190.000", sku: "GHC-CS-65" },
        66: { category: "custom-edition", meta: "Custom Retro-Tech · SNI 1811", title: "Garasi Retro Arcade Machine #66", desc: "Helm bertema mesin game arcade klasik lengkap dengan detail tombol joystick dan grafis piksel.", size: "M – XL", weight: "1.520 g", status: "Tersedia", price: "Rp 4.250.000", sku: "GHC-CS-66" },
        67: { category: "custom-edition", meta: "Custom Marine Series · SNI 1811", title: "Garasi Kraken Octopus 3D #67", desc: "Helm karakter gurita dengan delapan tentakel melingkar di sekeliling batok helm berstandar SNI.", size: "M – XL", weight: "1.530 g", status: "Tersedia", price: "Rp 4.150.000", sku: "GHC-CS-67" },
        68: { category: "custom-edition", meta: "Custom Geometric · SNI 1811", title: "Garasi Geometric Origami White #68", desc: "Helm dengan lekukan poligonal tajam bergaya seni lipat kertas origami modern warna putih doff.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.790.000", sku: "GHC-CS-68" },
        69: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Sculpted Concept Alpha #69", desc: "Helm kustom pahatan aerodinamis dengan kontur organik presisi dan sistem pengunci Double D-Ring.", size: "S – XL", weight: "1.460 g", status: "Tersedia", price: "Rp 3.890.000", sku: "GHC-CS-69" },
        70: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Sculpted Concept Studio #70", desc: "Helm kustom berprofil pahatan modern finishing studio putih bersih dengan ventilasi tersembunyi.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 3.850.000", sku: "GHC-CS-70" },
        71: { category: "full-face", meta: "Full Face · Studio Spec · SNI 1811", title: "Garasi Studio Aero Full Face #71", desc: "Helm full-face studio berprofil aerodinamis dengan cangkang komposit ringan dan visor optik kelas 1.", size: "S – XL", weight: "1.370 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-FF-71" },
        72: { category: "custom-edition", meta: "Custom Studio · SNI 1811", title: "Garasi Artisan Custom Studio #72", desc: "Helm edisi kustom studio dengan kombinasi warna hangat dan lapisan clear coat tahan cuaca.", size: "S – XL", weight: "1.460 g", status: "Tersedia", price: "Rp 3.750.000", sku: "GHC-CS-72" },
        73: { category: "full-face", meta: "Full Face · Studio Spec · SNI 1811", title: "Garasi Studio Carbon Track #73", desc: "Helm full-face berperforma tinggi dengan spoiler belakang terintegrasi dan peredam akustik.", size: "S – XL", weight: "1.360 g", status: "Tersedia", price: "Rp 3.550.000", sku: "GHC-FF-73" },
        74: { category: "full-face", meta: "Full Face · Studio Spec · SNI 1811", title: "Garasi Studio Cobalt Full Face #74", desc: "Helm full-face balap harian dengan visor anti-gores dan busa pipi pembuang kelembapan.", size: "S – XL", weight: "1.380 g", status: "Tersedia", price: "Rp 3.490.000", sku: "GHC-FF-74" },
        75: { category: "full-face", meta: "Full Face · Studio Spec · SNI 1811", title: "Garasi Studio Stealth Full Face #75", desc: "Helm full-face berdesain minimalis modern dengan sistem pelepas visor cepat tanpa alat.", size: "S – XL", weight: "1.375 g", status: "Tersedia", price: "Rp 3.520.000", sku: "GHC-FF-75" },
        76: { category: "custom-edition", meta: "Custom Retro-Tech · SNI 1811", title: "Garasi Retro Cassette Tape #76", desc: "Helm bergaya kaset pita musik klasik era 80-an lengkap dengan detail gulungan pita.", size: "M – XL", weight: "1.470 g", status: "Tersedia", price: "Rp 3.950.000", sku: "GHC-CS-76" },
        77: { category: "custom-edition", meta: "Custom Artisan · SNI 1811", title: "Garasi Ceramic Teapot Spec #77", desc: "Helm berbentuk teko teh keramik klasik lengkap dengan corong dan gagang melengkung ikonik.", size: "M – XL", weight: "1.490 g", status: "Tersedia", price: "Rp 3.890.000", sku: "GHC-CS-77" },
        78: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Crowned Monarch Custom #78", desc: "Helm kustom berdetail mahkota ukiran timbul di atas shell komposit ABS berkekuatan tinggi.", size: "M – XL", weight: "1.500 g", status: "Tersedia", price: "Rp 4.050.000", sku: "GHC-CS-78" },
        79: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Diablo Horned Custom #79", desc: "Helm hitam matte dengan sepasang tanduk melengkung kokoh di bagian atas untuk tampilan tegas.", size: "S – XL", weight: "1.460 g", status: "Tersedia", price: "Rp 3.750.000", sku: "GHC-CS-79" },
        80: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Maple Pancake Stack #80", desc: "Helm berbentuk tumpukan kue pancake cokelat keemasan dengan lelehan sirup maple dan mentega.", size: "M – XL", weight: "1.480 g", status: "Tersedia", price: "Rp 3.790.000", sku: "GHC-CS-80" },
        81: { category: "custom-edition", meta: "Custom Marine Series · SNI 1811", title: "Garasi Spiky Pufferfish Spec #81", desc: "Helm bulat karakter ikan buntal mengembang dengan duri lunak elastomer aman dan sirip samping.", size: "S – XL", weight: "1.470 g", status: "Tersedia", price: "Rp 3.850.000", sku: "GHC-CS-81" },
        82: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Japanese Ramen Bowl #82", desc: "Helm berbentuk mangkuk mie ramen Jepang lengkap dengan topping telur rebus, narutomaki, dan sumpit.", size: "M – XL", weight: "1.540 g", status: "Stok Terbatas", price: "Rp 4.290.000", sku: "GHC-CS-82" },
        83: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Great White Shark #83", desc: "Helm karakter ikan hiu dengan sirip punggung 3D dan grafis rahang tajam di sekeliling visor.", size: "S – XL", weight: "1.480 g", status: "Tersedia", price: "Rp 3.890.000", sku: "GHC-CS-83" },
        84: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Cozy Sloth Fur Spec #84", desc: "Helm berwajah kukang (sloth) dengan detail bulu cokelat lembut dan tatapan mata ramah.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.550.000", sku: "GHC-CS-84" },
        85: { category: "custom-edition", meta: "Custom Heritage · SNI 1811", title: "Garasi Chronos Steampunk Gear #85", desc: "Helm bergaya retro-futuristik Steampunk berbalut warna tembaga antik, kacamata goggle, dan roda gigi.", size: "S – XL", weight: "1.550 g", status: "Tersedia", price: "Rp 4.450.000", sku: "GHC-CS-85" },
        86: { category: "custom-edition", meta: "Custom Botanical · SNI 1811", title: "Garasi Sunny Sunflower Bloom #86", desc: "Helm dikelilingi kelopak bunga matahari kuning cerah yang memberikan kesan ceria di jalan.", size: "S – XL", weight: "1.420 g", status: "Tersedia", price: "Rp 3.490.000", sku: "GHC-CS-86" },
        87: { category: "custom-edition", meta: "Custom Fruit Edition · SNI 1811", title: "Garasi Fresh Watermelon Slice #87", desc: "Helm motif kulit semangka hijau bergaris dengan detail bagian dalam merah berbiji.", size: "S – XL", weight: "1.410 g", status: "Tersedia", price: "Rp 3.350.000", sku: "GHC-CS-87" },
        89: { category: "custom-edition", meta: "Custom Fruit Edition · SNI 1811", title: "Garasi King Durian Sculpted #89", desc: "Helm berbentuk buah durian lengkap dengan tekstur kulit berduri tumpul berbahan karet lentur.", size: "M – XL", weight: "1.530 g", status: "Tersedia", price: "Rp 3.950.000", sku: "GHC-CS-89" },
        90: { category: "custom-edition", meta: "Custom Character · SNI 1811", title: "Garasi Giant Yellow Duck #90", desc: "Helm karakter bebek karet kuning raksasa dengan paruh oranye ikonik di bagian depan.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-CS-90" },
        91: { category: "custom-edition", meta: "Custom Sci-Fi · SNI 1811", title: "Garasi Classic Green Alien #91", desc: "Helm kepala alien hijau klasik dengan mata hitam besar dan sepasang antena lentur di atasnya.", size: "S – XL", weight: "1.460 g", status: "Tersedia", price: "Rp 3.790.000", sku: "GHC-CS-91" },
        92: { category: "custom-edition", meta: "Custom Retro-Tech · SNI 1811", title: "Garasi Vintage Typewriter Spec #92", desc: "Helm unik dengan detail tuts huruf mesin tik antik dan rol kertas di bagian mahkota helm.", size: "M – XL", weight: "1.520 g", status: "Stok Terbatas", price: "Rp 4.190.000", sku: "GHC-CS-92" },
        93: { category: "custom-edition", meta: "Custom Concept · SNI 1811", title: "Garasi Mini Aquarium Fish #93", desc: "Helm transparan konsep akuarium mini lengkap dengan ornamen terumbu karang dan ikan hias.", size: "M – XL", weight: "1.560 g", status: "Stok Terbatas", price: "Rp 4.690.000", sku: "GHC-CS-93" },
        94: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Sunny Side Fried Egg #94", desc: "Helm putih bersih dengan bagian tengah kuning telur cembung menyerupai telur mata sapi.", size: "S – XL", weight: "1.420 g", status: "Tersedia", price: "Rp 3.390.000", sku: "GHC-CS-94" },
        95: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Melting Waffle Ice Cream #95", desc: "Helm bertema es krim stroberi dan vanila lengkap dengan cone wafel renyah di puncak helm.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 3.590.000", sku: "GHC-CS-95" },
        96: { category: "custom-edition", meta: "Custom Culinary 3D · SNI 1811", title: "Garasi Strawberry Glazed Donut #96", desc: "Helm berbentuk donat manis berlapis glasir stroberi pink dan taburan meses warna-warni.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.550.000", sku: "GHC-CS-96" },
        97: { category: "custom-edition", meta: "Custom Animal Series · SNI 1811", title: "Garasi Pink Axolotl Cute #97", desc: "Helm karakter salamander Axolotl merah muda lengkap dengan insang luar berbulu di sisi kanan-kiri.", size: "S – XL", weight: "1.450 g", status: "Tersedia", price: "Rp 3.690.000", sku: "GHC-CS-97" },
        98: { category: "custom-edition", meta: "Custom Character · SNI 1811", title: "Garasi Pink Piggy Coin Bank #98", desc: "Helm berbentuk celengan babi merah muda mengilap dengan telinga mungil dan hidung khas.", size: "S – XL", weight: "1.430 g", status: "Tersedia", price: "Rp 3.450.000", sku: "GHC-CS-98" },
        99: { category: "custom-edition", meta: "Custom Sculpted · SNI 1811", title: "Garasi Red Glossy Bubble #99", desc: "Helm desain gelembung merah cerah dengan lekukan empuk futuristik dan visor bening.", size: "S – XL", weight: "1.440 g", status: "Tersedia", price: "Rp 3.590.000", sku: "GHC-CS-99" },
        100: { category: "custom-edition", meta: "Custom Botanical · SNI 1811", title: "Garasi Red Toadstool Mushroom #100", desc: "Helm berbentuk tudung jamur hutan berwarna merah cerah dengan bintik-bintik putih klasik.", size: "S – XL", weight: "1.430 g", status: "Tersedia", price: "Rp 3.490.000", sku: "GHC-CS-100" }
      };

      const fullFaceSeriesTemplate = {
        category: "full-face",
        code: "FF",
        meta: "Full Face · ECE 22.06 · SNI",
        prefix: "Garasi Aero Full Face",
        desc: "Helm full-face aerodinamis dengan cangkang komposit ringan, ventilasi multi-kanal, visor optik anti-gores, dan pengunci Double D-Ring.",
        basePrice: 3250000,
        weight: 1370,
        size: "S – XL"
      };

      const customSeriesTemplates = [
        { category: "custom-edition", code: "CS", meta: "Custom Edition · SNI 1811", prefix: "Garasi Artisan Custom", desc: "Karya tangan studio Bandung dengan lapisan cat multi-stage tahan cuaca serta peredam benturan Multi-Density EPS.", basePrice: 3990000, weight: 1480, size: "S – XL" },
        { category: "custom-edition", code: "CS", meta: "Custom Heritage · SNI 1811", prefix: "Garasi Heritage Custom", desc: "Siluet kustom klasik dengan detail trim kulit sintetis jahitan tangan, aksen kuningan, dan interior suede.", basePrice: 3650000, weight: 1420, size: "S – XL" },
        { category: "custom-edition", code: "CS", meta: "Custom Sculpted · SNI 1811", prefix: "Garasi Sculpted Concept", desc: "Cangkang komposit kustom berprofil unik dengan finishing airbrush presisi dan lapisan clear coat anti-UV.", basePrice: 4150000, weight: 1510, size: "M – XL" }
      ];

      const halfFaceTemplates = [
        { category: "half-face", code: "HF", meta: "Half Face · SNI 1811", prefix: "Garasi Urban Half Face", desc: "Helm half-face ringan dengan double visor internal anti-UV dan ventilasi atas yang optimal untuk lalu lintas kota.", basePrice: 1450000, weight: 1180, size: "S – XL" },
        { category: "half-face", code: "HF", meta: "Half Face · ECE 22.06 · SNI", prefix: "Garasi Horizon Half Face GT", desc: "Helm half-face touring dengan visor panjang pelindung angin penuh, busa hippoallergenic, dan slot interkom.", basePrice: 1850000, weight: 1220, size: "M – XXL" },
        { category: "half-face", code: "HF", meta: "Half Face Classic · SNI 1811", prefix: "Garasi Heritage Half Face", desc: "Helm half-face bergaya klasik dengan trim kulit sintetis jahitan tangan dan kancing visor kuningan.", basePrice: 1650000, weight: 1190, size: "S – XL" }
      ];

      const variantNames = [
        "Matte Obsidian", "Cobalt Strike", "Titanium Silver", "Crimson Apex", "Arctic White",
        "Stealth Graphite", "Solar Flare", "Emerald Drift", "Bronze Patina", "Neon Circuit",
        "Midnight Blue", "Sandstorm Tan", "Glacier Grey", "Volcanic Red"
      ];

      const statusPool = ["Tersedia", "Tersedia", "Tersedia", "Stok Terbatas", "Pre-Order"];
      const allHelmets = [];

      for (let i = 1; i <= 100; i++) {
        const numStr = String(i).padStart(2, "0");
        const isFullFace = FULL_FACE_NUMBERS.has(i);
        const isCustom = CUSTOM_EDITION_NUMBERS.has(i);
        const isHalfFace = !isFullFace && !isCustom;

        if (specialSpecs[i]) {
          allHelmets.push({
            num: i,
            isFullFace,
            isCustom,
            isHalfFace,
            ...specialSpecs[i]
          });
        } else {
          let series;
          if (isFullFace) {
            series = fullFaceSeriesTemplate;
          } else if (isCustom) {
            series = customSeriesTemplates[i % customSeriesTemplates.length];
          } else {
            series = halfFaceTemplates[i % halfFaceTemplates.length];
          }

          const variant = variantNames[i % variantNames.length];
          const priceVal = series.basePrice + ((i % 5) * 75000);

          allHelmets.push({
            num: i,
            isFullFace,
            isCustom,
            isHalfFace,
            category: series.category,
            meta: series.meta,
            title: `${series.prefix} ${variant} #${numStr}`,
            desc: series.desc,
            size: series.size,
            weight: `${(series.weight + (i % 4) * 15).toLocaleString("id-ID")} g`,
            status: statusPool[i % statusPool.length],
            price: "Rp " + priceVal.toLocaleString("id-ID"),
            sku: `GHC-${series.code}-${numStr}`
          });
        }
      }

      
  function parsePriceNumber(priceStr) {
    if (typeof priceStr === "number") return priceStr;
    return parseInt(String(priceStr).replace(/[^0-9]/g, ""), 10) || 3500000;
  }

  const daftarHelm = allHelmets.map(function (h) {
    const baseHarga = parsePriceNumber(h.price);
    const rawVariants = customVariantsByNum[h.num] || null;
    const variants = rawVariants
      ? rawVariants.map(function (v) {
          const finalHarga = baseHarga + (v.priceDelta || 0);
          return {
            key: v.key,
            label: v.label,
            gambar: v.gambar,
            priceDelta: v.priceDelta || 0,
            hargaNum: finalHarga,
            harga: formatRupiah(finalHarga),
            sku: v.key === "default" ? h.sku : h.sku + "-" + v.key.toUpperCase()
          };
        })
      : null;

    return {
      id: "helm-" + String(h.num).padStart(2, "0"),
      num: h.num,
      sku: h.sku,
      nama: h.title,
      gambar: "gambar/" + h.num + ".jpg",
      kategori: h.category,
      meta: h.meta,
      deskripsi: h.desc,
      size: h.size,
      weight: h.weight,
      status: h.status,
      hargaNum: baseHarga,
      harga: h.price,
      satuan: "/ unit",
      variants: variants
    };
  });

  let channel = null;
  if (typeof BroadcastChannel !== "undefined") {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch (_) {
      channel = null;
    }
  }

  function broadcastEvent(type, payload) {
    if (channel) {
      try {
        channel.postMessage({ type: type, payload: payload, ts: Date.now() });
      } catch (_) {}
    }
  }

  function onRealtimeUpdate(callback) {
    window.addEventListener("storage", function (e) {
      if (e.key === ORDERS_KEY || e.key === CART_KEY) {
        callback({ source: "storage", key: e.key });
      }
    });
    if (channel) {
      channel.addEventListener("message", function (e) {
        callback({ source: "broadcast", data: e.data });
      });
    }
  }

  function formatRupiah(amount) {
    const num = Number(amount) || 0;
    return "Rp " + num.toLocaleString("id-ID");
  }

  function formatWaktu(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Cart API
  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    broadcastEvent("CART_UPDATED", { count: getCartCount() });
    updateNavBadge();
  }

  function getProductById(id) {
    return daftarHelm.find(function (item) {
      return item.id === id || String(item.num) === String(id);
    });
  }

  function addToCart(productId, qty, variantKey) {
    const product = getProductById(productId);
    if (!product) return null;
    const addQty = Math.max(1, parseInt(qty, 10) || 1);

    let chosenVariant = null;
    if (product.variants && product.variants.length > 0) {
      chosenVariant =
        product.variants.find(function (v) {
          return v.key === variantKey;
        }) || product.variants[0];
    }

    const cartItemId = chosenVariant
      ? product.id + "__" + chosenVariant.key
      : product.id;
    const itemName = chosenVariant
      ? product.nama + " — Varian: " + chosenVariant.label
      : product.nama;
    const itemGambar = chosenVariant ? chosenVariant.gambar : product.gambar;
    const itemHargaNum = chosenVariant ? chosenVariant.hargaNum : product.hargaNum;
    const itemSku = chosenVariant ? chosenVariant.sku : product.sku;

    const cart = getCart();
    const existing = cart.find(function (c) {
      return c.id === cartItemId;
    });
    if (existing) {
      existing.qty += addQty;
    } else {
      cart.push({
        id: cartItemId,
        productId: product.id,
        variantKey: chosenVariant ? chosenVariant.key : null,
        variantLabel: chosenVariant ? chosenVariant.label : null,
        num: product.num,
        sku: itemSku,
        nama: itemName,
        gambar: itemGambar,
        satuan: product.satuan,
        hargaNum: itemHargaNum,
        qty: addQty
      });
    }
    saveCart(cart);
    return cart;
  }

  function updateCartQty(productId, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) {
      return removeFromCart(productId);
    }
    const cart = getCart();
    const item = cart.find(function (c) {
      return c.id === productId;
    });
    if (item) {
      item.qty = Math.min(99, qty);
      saveCart(cart);
    }
    return cart;
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(function (c) {
      return c.id !== productId;
    });
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, item) {
      return sum + (parseInt(item.qty, 10) || 0);
    }, 0);
  }

  function getCartTotals(shippingCost) {
    const cart = getCart();
    const subtotal = cart.reduce(function (sum, item) {
      return sum + item.hargaNum * item.qty;
    }, 0);
    const ongkir = cart.length > 0 ? (typeof shippingCost === "number" ? shippingCost : 50000) : 0;
    const grandTotal = subtotal + ongkir;
    return { subtotal: subtotal, ongkir: ongkir, grandTotal: grandTotal };
  }

  // Orders API
  function getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  function getOrderById(orderId) {
    return getOrders().find(function (o) {
      return o.id === orderId;
    });
  }

  function generateOrderId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return "INV-GHC-" + y + m + d + "-" + rand;
  }

  function createOrder(customer, shippingMethod) {
    const cart = getCart();
    if (cart.length === 0) return null;

    const ongkir = shippingMethod === "pickup" ? 0 : 50000;
    const totals = getCartTotals(ongkir);
    const orderId = generateOrderId();
    const nowIso = new Date().toISOString();

    const order = {
      id: orderId,
      createdAt: nowIso,
      paidAt: null,
      rejectedAt: null,
      status: "PENDING", // PENDING | PAID | REJECTED
      paymentMethod: "QRIS",
      qrisRef: "QRIS" + Date.now().toString().slice(-8),
      approvalRef: null,
      shippingMethod: shippingMethod === "pickup" ? "Ambil di Showroom Bandung" : "Kurir Khusus Helm (Asuransi & Box)",
      customer: {
        nama: customer.nama,
        telepon: customer.telepon,
        alamat: customer.alamat,
        kota: customer.kota,
        catatan: customer.catatan || ""
      },
      items: cart.map(function (c) {
        return {
          id: c.id,
          productId: c.productId || c.id,
          variantKey: c.variantKey || null,
          variantLabel: c.variantLabel || null,
          num: c.num,
          sku: c.sku,
          nama: c.nama,
          gambar: c.gambar,
          satuan: c.satuan,
          hargaNum: c.hargaNum,
          qty: c.qty,
          subtotal: c.hargaNum * c.qty
        };
      }),
      subtotal: totals.subtotal,
      ongkir: totals.ongkir,
      grandTotal: totals.grandTotal
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    broadcastEvent("ORDER_CREATED", { orderId: order.id });
    return order;
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const order = orders.find(function (o) {
      return o.id === orderId;
    });
    if (!order) return null;

    order.status = newStatus;
    if (newStatus === "PAID") {
      order.paidAt = new Date().toISOString();
      order.approvalRef = "APR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    } else if (newStatus === "REJECTED") {
      order.rejectedAt = new Date().toISOString();
    }
    saveOrders(orders);
    broadcastEvent("ORDER_STATUS_CHANGED", { orderId: order.id, status: newStatus });
    return order;
  }

  function renderStatusBadge(status) {
    if (status === "PAID") {
      return '<span class="status-badge status-paid">&#10003; Paid / Lunas</span>';
    }
    if (status === "REJECTED") {
      return '<span class="status-badge status-rejected">&#10005; Ditolak</span>';
    }
    return '<span class="status-badge status-pending"><span class="pulse-dot"></span> Menunggu Bayar</span>';
  }

  // Deterministic Dummy QRIS SVG Generator (Pure JS, zero external dependencies)
  function generateDummyQrisSvg(seedText) {
    const size = 25;
    const cell = 8;
    const quiet = 16;
    const totalPx = size * cell + quiet * 2;

    let hash = 2166136261;
    const text = String(seedText || "GARASI-HELM-CUSTOM-QRIS");
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    function nextBit() {
      hash ^= hash << 13;
      hash ^= hash >>> 17;
      hash ^= hash << 5;
      return (hash >>> 0) % 2 === 1;
    }

    const grid = Array.from({ length: size }, function () {
      return Array(size).fill(false);
    });
    const reserved = Array.from({ length: size }, function () {
      return Array(size).fill(false);
    });

    function placeFinder(r0, c0) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = r0 + r;
          const cc = c0 + c;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          reserved[rr][cc] = true;
          const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[rr][cc] = inOuter && (onBorder || inInner);
        }
      }
    }

    function placeAlignment(r0, c0) {
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const rr = r0 + r;
          const cc = c0 + c;
          reserved[rr][cc] = true;
          grid[rr][cc] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);
    placeAlignment(size - 7, size - 7);

    for (let i = 8; i < size - 8; i++) {
      reserved[6][i] = true;
      reserved[i][6] = true;
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    for (let r = 10; r <= 14; r++) {
      for (let c = 10; c <= 14; c++) {
        reserved[r][c] = true;
        grid[r][c] = false;
      }
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved[r][c]) {
          grid[r][c] = nextBit();
        }
      }
    }

    let rects = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c]) {
          const x = quiet + c * cell;
          const y = quiet + r * cell;
          rects += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="#111317"/>';
        }
      }
    }

    const cx = totalPx / 2;
    const cy = totalPx / 2;

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + totalPx + '" height="' + totalPx + '" viewBox="0 0 ' + totalPx + " " + totalPx + '" role="img" aria-label="Kode QRIS">' +
      '<rect width="100%" height="100%" fill="#ffffff"/>' +
      rects +
      '<rect x="' + (cx - 24) + '" y="' + (cy - 13) + '" width="48" height="26" rx="4" fill="#ffffff" stroke="#111317" stroke-width="1.5"/>' +
      '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#111317">QRIS</text>' +
      "</svg>"
    );
  }

  function updateNavBadge() {
    const badge = document.getElementById("nav-cart-count");
    if (badge) {
      badge.textContent = String(getCartCount());
    }
  }

  let toastTimer = null;
  function showToast(message) {
    let el = document.getElementById("ghc-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ghc-toast";
      el.className = "ghc-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2400);
  }

  onRealtimeUpdate(function () {
    updateNavBadge();
  });

  window.handleImgError = function (imgEl, num) {
    const fallbackExts = ["jpeg", "png", "webp", "JPG"];
    const step = Number(imgEl.dataset.retry || 0);
    if (step < fallbackExts.length) {
      imgEl.dataset.retry = String(step + 1);
      imgEl.src = "gambar/" + num + "." + fallbackExts[step];
    } else {
      imgEl.onerror = null;
    }
  };

  window.GHCStore = {
    daftarHelm: daftarHelm,
    formatRupiah: formatRupiah,
    formatWaktu: formatWaktu,
    escapeHtml: escapeHtml,
    getCart: getCart,
    addToCart: addToCart,
    updateCartQty: updateCartQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getCartCount: getCartCount,
    getCartTotals: getCartTotals,
    getOrders: getOrders,
    getOrderById: getOrderById,
    createOrder: createOrder,
    updateOrderStatus: updateOrderStatus,
    renderStatusBadge: renderStatusBadge,
    generateDummyQrisSvg: generateDummyQrisSvg,
    updateNavBadge: updateNavBadge,
    showToast: showToast,
    onRealtimeUpdate: onRealtimeUpdate
  };
})();
