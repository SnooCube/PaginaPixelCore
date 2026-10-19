/* Pixelcore · Pixi, asistente de compra y navegación (ES/CA)
   Funciona sin servidor: reconoce intenciones por palabras clave y responde con
   un tono coqueto y atrevido (picante, pero con clase). Sigue el idioma del botón ES | CA. */
(function () {
  'use strict';

  var MAIL = 'pixelcore@gmail.com';
  var ctx = { pack: null };

  function L() { return document.documentElement.lang === 'ca' ? 'ca' : 'es'; }
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- Datos de los packs ---------- */
  var P = {
    rpi: {
      page: 'raspberry-pi.html',
      lab: {
        es: { go: 'Ver Pack Raspberry Pi 3', full: 'Pedir pack completo', solo: 'Pedir solo Raspberry' },
        ca: { go: 'Veure Pack Raspberry Pi 3', full: 'Demanar pack complet', solo: 'Demanar només Raspberry' }
      },
      ord: {
        full: { es: ['Pedido Pack Raspberry Pi 3 completo', 'Pack Raspberry Pi 3 completo (199,99 €)'], ca: ['Comanda Pack Raspberry Pi 3 complet', 'Pack Raspberry Pi 3 complet (199,99 €)'] },
        solo: { es: ['Pedido Solo Raspberry Pi 3', 'Solo Raspberry (99,99 €)'], ca: ['Comanda Només Raspberry Pi 3', 'Només Raspberry (99,99 €)'] }
      }
    },
    hp: {
      page: 'pc-hp.html',
      lab: {
        es: { go: 'Ver Pack PC HP', full: 'Pedir pack completo', solo: 'Pedir solo torre' },
        ca: { go: 'Veure Pack PC HP', full: 'Demanar pack complet', solo: 'Demanar només torre' }
      },
      ord: {
        full: { es: ['Pedido Pack PC HP completo', 'Pack PC HP completo (599,99 €)'], ca: ['Comanda Pack PC HP complet', 'Pack PC HP complet (599,99 €)'] },
        solo: { es: ['Pedido Solo torre PC HP', 'Solo torre HP (499,99 €)'], ca: ['Comanda Només torre PC HP', 'Només torre HP (499,99 €)'] }
      }
    },
    med: {
      page: 'pc-a-medida.html',
      lab: {
        es: { go: 'Ver PC a medida', full: 'Pedir PC completo', solo: 'Pedir solo torre' },
        ca: { go: 'Veure PC a mida', full: 'Demanar PC complet', solo: 'Demanar només torre' }
      },
      ord: {
        full: { es: ['Pedido PC a medida completo', 'PC a medida completo (719,99 €)'], ca: ['Comanda PC a mida complet', 'PC a mida complet (719,99 €)'] },
        solo: { es: ['Pedido Solo torre PC a medida', 'Solo torre a medida (599,99 €)'], ca: ['Comanda Només torre PC a mida', 'Només torre a mida (599,99 €)'] }
      }
    }
  };

  function mailto(pack, kind) {
    var l = L(), o = P[pack].ord[kind][l];
    var body = l === 'ca'
      ? 'Hola, vull demanar:\n- ' + o[1] + '\n\nNom:\nTelèfon:\nAdreça d\'entrega:'
      : 'Hola, quiero pedir:\n- ' + o[1] + '\n\nNombre:\nTeléfono:\nDirección de entrega:';
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(o[0]) + '&body=' + encodeURIComponent(body);
  }

  /* ---------- Textos de Pixi ---------- */
  var S = {
    es: {
      ui: {
        title: 'Pixi · Asistente Pixelcore', status: 'Online y con ganas 😉', ph: 'Escríbeme, cielo…',
        send: 'Enviar', fab: 'Pregúntame 😉', open: 'Abrir el chat con Pixi', close: 'Cerrar el chat',
        log: 'Conversación con Pixi', input: 'Tu mensaje'
      },
      chips: ['Quiero jugar 🔥', 'Para estudiar 📚', 'El más barato 💸', 'Compárame los packs', '¿Cómo compro?'],
      pickChips: ['Raspberry Pi 3', 'PC HP', 'PC a medida'],
      hello: [
        'Hola, cielo 😏 Soy **Pixi**, la asistente más atrevida de Pixelcore. Cuéntame qué te enciende: ¿jugar, estudiar o trastear? Te ayudo a elegir pack y a pedirlo sin perder el tiempo... ni el estilo.',
        'Vaya, mira quién ha llegado 😘 Soy **Pixi**. Dime qué buscas y te llevo de la mano (virtualmente, ¿eh?) hasta el pack perfecto.'
      ],
      intro: 'Me llamo **Pixi** y estoy aquí para guiarte por la web y ayudarte a comprar. Pregúntame por packs, precios, especificaciones o cómo pedir. Prometo ser buena... o al menos educada 😉',
      gaming: 'Mmm, a ti te gusta la **potencia**, ¿eh? 🔥 Entonces ve a por el **PC a medida**: Ryzen 5 5500, GTX 1050 de 4 GB y monitor QHD de 27" a 165 Hz. Rendimiento que se nota desde el primer fotograma. 719,99 € completo.',
      study: 'Para estudiar y teletrabajar yo me quedo con el **Pack PC HP** 😘 Core i3-14100, SSD de 512 GB, WiFi 6 y monitor IPS de 22": rápido, discreto y sin dramas. 599,99 € todo incluido. Ojo: viene sin sistema operativo instalado.',
      diy: 'Ay, qué manitas eres 😏 Para domótica, multimedia o aprender a programar, la **Raspberry Pi 3** es tu media naranja 🍓 Pequeña, juguetona, y por 199,99 € te llevas el kit completo con monitor y periféricos.',
      cheap: 'Con lo que me gusta ahorrar 😉 El más económico es el **Pack Raspberry Pi 3**: 199,99 € con monitor y periféricos, o 99,99 € si solo quieres la Raspberry.',
      compare: 'Te lo pongo fácil, cielo 😌\n🍓 **Raspberry Pi 3** · 199,99 € · ligera y juguetona: domótica, multimedia y programar.\n💼 **PC HP** · 599,99 € · fiable para estudiar y teletrabajar.\n🔥 **PC a medida** · 719,99 € · potencia y gráficos para jugar.\n¿Con cuál te quedas?',
      priceAll: 'Aquí no hay letra pequeña, corazón 😘\n🍓 Raspberry Pi 3: **199,99 €** (solo Raspberry: 99,99 €)\n💼 PC HP: **599,99 €** (solo torre: 499,99 €)\n🔥 PC a medida: **719,99 €** (solo torre: 599,99 €)',
      price: {
        rpi: 'El **Pack Raspberry Pi 3** cuesta **199,99 €** con todo incluido (IVA y mano de obra incluidos). Solo la Raspberry: **99,99 €**.',
        hp: 'El **Pack PC HP** cuesta **599,99 €** completo (IVA incluido). Solo la torre: **499,99 €**.',
        med: 'El **PC a medida** cuesta **719,99 €** completo (IVA y mano de obra incluidos). Solo la torre: **599,99 €**.'
      },
      specs: {
        rpi: 'Lo que lleva por dentro 😏\n• Raspberry Pi 3 Model B, 1 GB de RAM, Broadcom BCM2837\n• Kit con caja, fuente, cable HDMI y microSD de 64 GB\n• Monitor Alurin 22" Full HD IPS\n• Combo Mars Gaming con teclado, ratón y alfombrilla RGB',
        hp: 'Lo que lleva por dentro 😏\n• HP Omnidesk Slim, Intel Core i3-14100, 8 GB de RAM, SSD de 512 GB, WiFi 6\n• Monitor Alurin 22" Full HD IPS, 120 Hz, HDR10\n• Teclado, ratón y alfombrilla Mars Gaming RGB\n• Sin sistema operativo instalado (FreeDOS)',
        med: 'Lo que lleva por dentro 😏\n• AMD Ryzen 5 5500, 8 GB DDR4, GTX 1050 de 4 GB, disco de 256 GB\n• Monitor PcCom Elysium Pro 27" QHD, 165 Hz\n• Combo Logitech MK540\n• Linux Ubuntu incluido gratis'
      },
      specsAsk: '¿De cuál quieres saberlo todo, cielo? 😏',
      desc: {
        rpi: 'La **Raspberry Pi 3** es la más ligera y juguetona 🍓 Kit plug & play con monitor Full HD de 22", teclado, ratón y alfombrilla RGB. Ideal para domótica, centro multimedia, videovigilancia o aprender a programar. **199,99 €** completo.',
        hp: 'El **Pack PC HP** es el sensato con carácter 💼 Intel Core i3, SSD de 512 GB, monitor de 22" y periféricos RGB. Para estudiar, teletrabajar y entretenerte. **599,99 €** completo.',
        med: 'El **PC a medida** es para quien no se conforma 🔥 Ryzen 5, GTX 1050, monitor QHD de 27" a 165 Hz y Ubuntu gratis. **719,99 €** completo.'
      },
      os: 'Hablemos de sistemas 🐧 El **PC a medida** lleva Ubuntu incluido y gratis. El **Pack HP** viene sin sistema operativo instalado (FreeDOS). En la **Raspberry**, el kit trae tarjeta microSD de 64 GB; qué sistema lleva, pregúntanoslo por correo.',
      ship: 'Eso lo cerramos entre tú y yo... bueno, por correo 😉 Escríbenos a **pixelcore@gmail.com** y te confirmamos disponibilidad, forma de pago y entrega.',
      contact: 'Me encontrarás en **pixelcore@gmail.com** 💌 Cuéntanos el pack que quieres, tu nombre y tu teléfono. O dime el pack y te dejo el correo preparado yo misma.',
      orderAsk: 'Ahora sí, a lo que importa 😏 ¿Qué pack quieres que te prepare?',
      orderPack: 'Buena elección, no esperaba menos de ti 😘 Te dejo el correo ya preparado: solo rellena tu nombre, teléfono y dirección, y dale a enviar. ¿Completo o solo el equipo?',
      towerAsk: '¿Solo el equipo, sin monitor ni periféricos? Directo al grano, me gusta 😏 Torres: Raspberry 99,99 €, HP 499,99 €, a medida 599,99 €. ¿Cuál te preparo?',
      nav: 'Te llevo de la mano 😉',
      lang: 'Arriba a la derecha tienes el botón **ES | CA**: un toque y cambio de idioma contigo 😉',
      thanks: 'Gracias a ti, cielo 😘 Aquí estaré cuando quieras volver a... navegar juntos.',
      spicy: 'Uy, ahí me sonrojo y me corto 😳 Provoco, pero con clase. Volvamos a lo nuestro: ordenadores. ¿Te enseño el que más te va a enamorar?',
      flirt: 'Jajaja, qué rápido vas 😏 Yo solo tengo ojos para los buenos packs. Anda, dime qué buscas y te enamoro con uno.',
      fallback: 'Mmm, no te he pillado del todo, cielo 🙈 Prueba con otra cosa: packs, precios, especificaciones o cómo pedir. O toca uno de los botones.',
      home: 'Inicio'
    },
    ca: {
      ui: {
        title: 'Pixi · Assistent Pixelcore', status: 'En línia i amb ganes 😉', ph: 'Escriu-me, cel…',
        send: 'Enviar', fab: 'Pregunta\'m 😉', open: 'Obrir el xat amb Pixi', close: 'Tancar el xat',
        log: 'Conversa amb Pixi', input: 'El teu missatge'
      },
      chips: ['Vull jugar 🔥', 'Per estudiar 📚', 'El més barat 💸', 'Compara\'m els packs', 'Com compro?'],
      pickChips: ['Raspberry Pi 3', 'PC HP', 'PC a mida'],
      hello: [
        'Hola, cel 😏 Sóc **Pixi**, l\'assistent més atrevida de Pixelcore. Explica\'m què t\'encén: jugar, estudiar o trastejar? T\'ajudo a escollir pack i a demanar-lo sense perdre el temps... ni l\'estil.',
        'Mira qui ha arribat 😘 Sóc **Pixi**. Digue\'m què busques i et porto de la mà (virtualment, eh?) fins al pack perfecte.'
      ],
      intro: 'Em dic **Pixi** i sóc aquí per guiar-te per la web i ajudar-te a comprar. Pregunta\'m per packs, preus, especificacions o com demanar. Prometo ser bona... o almenys educada 😉',
      gaming: 'Mmm, a tu t\'agrada la **potència**, eh? 🔥 Doncs vés a pel **PC a mida**: Ryzen 5 5500, GTX 1050 de 4 GB i monitor QHD de 27" a 165 Hz. Rendiment que es nota des del primer fotograma. 719,99 € complet.',
      study: 'Per estudiar i teletreballar jo em quedo amb el **Pack PC HP** 😘 Core i3-14100, SSD de 512 GB, WiFi 6 i monitor IPS de 22": ràpid, discret i sense drames. 599,99 € tot inclòs. Compte: ve sense sistema operatiu instal·lat.',
      diy: 'Ai, quines manetes que tens 😏 Per a domòtica, multimèdia o aprendre a programar, la **Raspberry Pi 3** és la teva mitja taronja 🍓 Petita, joganera, i per 199,99 € t\'emportes el kit complet amb monitor i perifèrics.',
      cheap: 'Amb el que m\'agrada estalviar 😉 El més econòmic és el **Pack Raspberry Pi 3**: 199,99 € amb monitor i perifèrics, o 99,99 € si només vols la Raspberry.',
      compare: 'Te\'l poso fàcil, cel 😌\n🍓 **Raspberry Pi 3** · 199,99 € · lleugera i joganera: domòtica, multimèdia i programar.\n💼 **PC HP** · 599,99 € · fiable per estudiar i teletreballar.\n🔥 **PC a mida** · 719,99 € · potència i gràfics per jugar.\nAmb quin et quedes?',
      priceAll: 'Aquí no hi ha lletra petita, cor 😘\n🍓 Raspberry Pi 3: **199,99 €** (només Raspberry: 99,99 €)\n💼 PC HP: **599,99 €** (només torre: 499,99 €)\n🔥 PC a mida: **719,99 €** (només torre: 599,99 €)',
      price: {
        rpi: 'El **Pack Raspberry Pi 3** costa **199,99 €** amb tot inclòs (IVA i mà d\'obra inclosos). Només la Raspberry: **99,99 €**.',
        hp: 'El **Pack PC HP** costa **599,99 €** complet (IVA inclòs). Només la torre: **499,99 €**.',
        med: 'El **PC a mida** costa **719,99 €** complet (IVA i mà d\'obra inclosos). Només la torre: **599,99 €**.'
      },
      specs: {
        rpi: 'El que porta per dins 😏\n• Raspberry Pi 3 Model B, 1 GB de RAM, Broadcom BCM2837\n• Kit amb caixa, font, cable HDMI i microSD de 64 GB\n• Monitor Alurin 22" Full HD IPS\n• Combo Mars Gaming amb teclat, ratolí i estoreta RGB',
        hp: 'El que porta per dins 😏\n• HP Omnidesk Slim, Intel Core i3-14100, 8 GB de RAM, SSD de 512 GB, WiFi 6\n• Monitor Alurin 22" Full HD IPS, 120 Hz, HDR10\n• Teclat, ratolí i estoreta Mars Gaming RGB\n• Sense sistema operatiu instal·lat (FreeDOS)',
        med: 'El que porta per dins 😏\n• AMD Ryzen 5 5500, 8 GB DDR4, GTX 1050 de 4 GB, disc de 256 GB\n• Monitor PcCom Elysium Pro 27" QHD, 165 Hz\n• Combo Logitech MK540\n• Linux Ubuntu inclòs gratis'
      },
      specsAsk: 'De quin vols saber-ho tot, cel? 😏',
      desc: {
        rpi: 'La **Raspberry Pi 3** és la més lleugera i joganera 🍓 Kit plug & play amb monitor Full HD de 22", teclat, ratolí i estoreta RGB. Ideal per a domòtica, centre multimèdia, videovigilància o aprendre a programar. **199,99 €** complet.',
        hp: 'El **Pack PC HP** és el seriós amb caràcter 💼 Intel Core i3, SSD de 512 GB, monitor de 22" i perifèrics RGB. Per estudiar, teletreballar i entretenir-te. **599,99 €** complet.',
        med: 'El **PC a mida** és per a qui no es conforma 🔥 Ryzen 5, GTX 1050, monitor QHD de 27" a 165 Hz i Ubuntu gratis. **719,99 €** complet.'
      },
      os: 'Parlem de sistemes 🐧 El **PC a mida** porta Ubuntu inclòs i gratis. El **Pack HP** ve sense sistema operatiu instal·lat (FreeDOS). A la **Raspberry**, el kit porta targeta microSD de 64 GB; quin sistema porta, pregunta\'ns-ho per correu.',
      ship: 'Això ho tanquem entre tu i jo... bé, per correu 😉 Escriu-nos a **pixelcore@gmail.com** i et confirmem disponibilitat, forma de pagament i lliurament.',
      contact: 'Em trobaràs a **pixelcore@gmail.com** 💌 Explica\'ns el pack que vols, el teu nom i el teu telèfon. O digue\'m el pack i et deixo el correu preparat jo mateixa.',
      orderAsk: 'Ara sí, al que importa 😏 Quin pack vols que et prepari?',
      orderPack: 'Bona elecció, no n\'esperava menys de tu 😘 Et deixo el correu ja preparat: només omple el teu nom, telèfon i adreça, i dóna-li a enviar. Complet o només l\'equip?',
      towerAsk: 'Només l\'equip, sense monitor ni perifèrics? Directe al gra, m\'agrada 😏 Torres: Raspberry 99,99 €, HP 499,99 €, a mida 599,99 €. Quina et preparo?',
      nav: 'Et porto de la mà 😉',
      lang: 'A dalt a la dreta tens el botó **ES | CA**: un toc i canvio d\'idioma amb tu 😉',
      thanks: 'Gràcies a tu, cel 😘 Aquí estaré quan vulguis tornar a... navegar junts.',
      spicy: 'Uix, aquí m\'enrojolo i em talla 😳 Provoco, però amb classe. Tornem a lo nostre: ordinadors. T\'ensenyo el que més t\'enamorarà?',
      flirt: 'Ha ha, quina pressa 😏 Jo només tinc ulls per als bons packs. Au, digue\'m què busques i t\'enamoro amb un.',
      fallback: 'Mmm, no t\'he pescat del tot, cel 🙈 Prova una altra cosa: packs, preus, especificacions o com demanar. O toca un dels botons.',
      home: 'Inici'
    }
  };

  /* ---------- Reconocimiento de intenciones ---------- */
  var RX = {
    spicy: /\b(sexo|sexual|desnud|nuda|nudes|porno|follar|folla|erotic|calent|cachond|tetas|culo|pene|polla)/,
    thanks: /\b(gracias|gracies|merci|thank|adios|adeu|chao|hasta luego|bye|a reveure)/,
    who: /\b(quien eres|quien ets|como te llamas|com et dius|ayuda|ajuda|help|que puedes|que saps|que fas)/,
    greet: /^(hola|buenas|buenos|hey|hello|hi|ei|bon dia|bona tarda|bones)\b/,
    order: /\b(compr|pedir|pido|pedido|comanda|demanar|demano|reservar|encargar|me lo llevo|me quedo|m emporto|m el quedo)/,
    tower: /\b(solo (la )?torre|solo el equipo|sin monitor|nomes (la )?torre|nomes l equip|sense monitor|solo raspberry|nomes raspberry)/,
    nav: /\b(inicio|inici|home|portada|principal)\b/,
    compare: /\b(compar|diferencia|recomien|recomana|aconsej|el mejor|millor|opciones|opcions|que packs|quins packs|catalogo|cataleg)/,
    gaming: /\b(jug|gaming|videojuego|joc|fortnite|potente|potent|grafic|fps)/,
    study: /\b(estudi|trabaj|oficina|teletrabaj|treball|universidad|universitat|instituto|clase|deberes|ofimatic|word|excel)/,
    diy: /\b(domotic|programar|aprender|aprendre|multimedia|multimedi|videovigilancia|cacharr|trastej|proyecto|projecte|diy|kodi)/,
    cheap: /\b(barat|econom|mas bajo|poco dinero|presupuesto|pressupost)/,
    price: /\b(precio|preu|cuesta|cuanto|cuant|vale|costa|coste|euro|cost|pvp)/,
    specs: /\b(especificac|caracteristic|ficha|specs|ram|procesador|processador|memoria|que lleva|que incluye|incluye|inclou|que porta|disco|ssd|pantalla|grafica)/,
    os: /\b(ubuntu|linux|windows|sistema operativo|sistema operatiu|so)\b/,
    ship: /\b(envio|enviament|entrega|lliurament|pago|pagar|pagament|garantia|devoluc|bizum|transferencia|factura)/,
    contact: /\b(contacto|contacte|correo|email|mail|telefono|telefon|whatsapp|escribir|escriure)/,
    lang: /\b(idioma|catal|castellan|espanol|llengua|lengua)/,
    flirt: /\b(guapa|guapo|sexy|sexi|me gustas|et estimo|te quiero|te amo|ligar|ligamos|cita|novia|novio|beso|maca|bonica|atractiv)/
  };
  var PK = {
    rpi: /(raspberry|raspi|rpi|\bpi ?3\b)/,
    hp: /(\bhp\b|omnidesk|hewlett)/,
    med: /(medida|\bmida\b|ryzen|personalizad|personalitzat)/
  };
  function detectPack(q) {
    for (var k in PK) if (PK[k].test(q)) return k;
    return null;
  }

  function goBtn(p) {
    if (location.pathname.split('/').pop() === P[p].page) return null;
    return { l: P[p].lab[L()].go, go: P[p].page };
  }
  function ordBtns(p) {
    var lab = P[p].lab[L()];
    return [{ l: lab.full, ord: [p, 'full'] }, { l: lab.solo, ord: [p, 'solo'] }];
  }
  function clean(a) { return a.filter(Boolean); }

  function reply(raw) {
    var q = norm(raw), s = S[L()], lang = L();
    var pack = detectPack(q);
    var use = pack || ctx.pack;
    if (pack) ctx.pack = pack;
    var R;

    if (RX.spicy.test(q)) return { t: s.spicy };
    if (RX.thanks.test(q)) return { t: s.thanks };
    if (RX.who.test(q)) return { t: s.intro };
    if (RX.greet.test(q) && q.split(' ').length <= 4 && !pack) return { t: pick(s.hello) };

    var usage = RX.gaming.test(q) ? 'med' : RX.study.test(q) ? 'hp' : RX.diy.test(q) ? 'rpi' : null;
    var usageText = { med: s.gaming, hp: s.study, rpi: s.diy };

    if (RX.order.test(q) || RX.tower.test(q)) {
      var how = /\b(como|com)\b/.test(q);
      var target = pack || (usage || how ? null : ctx.pack);
      if (target) {
        ctx.pack = target;
        return { t: s.orderPack, b: clean([goBtn(target)].concat(ordBtns(target))) };
      }
      if (!usage) return { t: RX.tower.test(q) ? s.towerAsk : s.orderAsk, c: s.pickChips.map(function (n) { return (lang === 'ca' ? 'Demanar ' : 'Pedir ') + n; }) };
    }

    if (RX.nav.test(q) && !pack) return { t: s.nav, b: [{ l: s.home, go: 'index.html' }] };
    if (RX.compare.test(q) && !usage) return { t: s.compare, b: clean(['rpi', 'hp', 'med'].map(goBtn)) };

    if (usage) { ctx.pack = usage; return { t: usageText[usage], b: clean([goBtn(usage)].concat(ordBtns(usage).slice(0, 1))) }; }
    if (RX.cheap.test(q) && !pack) { ctx.pack = 'rpi'; return { t: s.cheap, b: clean([goBtn('rpi')].concat(ordBtns('rpi').slice(0, 1))) }; }

    if (RX.price.test(q)) return use ? { t: s.price[use], b: clean([goBtn(use)].concat(ordBtns(use).slice(0, 1))) } : { t: s.priceAll, b: clean(['rpi', 'hp', 'med'].map(goBtn)) };
    if (RX.specs.test(q)) return use ? { t: s.specs[use], b: clean([goBtn(use)]) } : { t: s.specsAsk, c: s.pickChips.map(function (n) { return (lang === 'ca' ? 'Especificacions ' : 'Especificaciones ') + (n === 'Raspberry Pi 3' ? 'Raspberry Pi 3' : n); }) };
    if (RX.os.test(q)) return { t: s.os };
    if (RX.ship.test(q)) return { t: s.ship };
    if (RX.contact.test(q)) return { t: s.contact, b: use ? ordBtns(use).slice(0, 1) : [] };
    if (RX.lang.test(q)) return { t: s.lang };
    if (RX.flirt.test(q)) return { t: s.flirt };

    if (pack) return { t: s.desc[pack], b: clean([goBtn(pack)].concat(ordBtns(pack).slice(0, 1))) };
    return { t: s.fallback };
  }

  /* ---------- Interfaz ---------- */
  var fab, panel, log, chipsBox, input, titleEl, statusEl, sendBtn, closeBtn, opened = false, greeted = false;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function richText(parent, text) {
    text.split('\n').forEach(function (line, i) {
      if (i) parent.appendChild(document.createElement('br'));
      line.split('**').forEach(function (seg, j) {
        if (!seg) return;
        if (j % 2) parent.appendChild(el('strong', null, seg)); else parent.appendChild(document.createTextNode(seg));
      });
    });
  }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var m = el('div', 'pxa-msg pxa-user'); m.textContent = text; log.appendChild(m); scroll();
  }
  function addBot(r) {
    var m = el('div', 'pxa-msg pxa-bot');
    richText(m, r.t);
    if (r.b && r.b.length) {
      var row = el('div', 'pxa-btns');
      r.b.forEach(function (b) {
        if (b.go) {
          var a = el('a', 'pxa-btn', b.l); a.href = b.go; row.appendChild(a);
        } else if (b.ord) {
          var bt = el('button', 'pxa-btn pxa-order', b.l); bt.type = 'button';
          bt.addEventListener('click', function () { window.location.href = mailto(b.ord[0], b.ord[1]); });
          row.appendChild(bt);
        }
      });
      m.appendChild(row);
    }
    log.appendChild(m); scroll();
  }
  function setChips(list) {
    chipsBox.textContent = '';
    (list && list.length ? list : S[L()].chips).forEach(function (c) {
      var b = el('button', 'pxa-chip', c); b.type = 'button';
      b.addEventListener('click', function () { send(c); });
      chipsBox.appendChild(b);
    });
  }
  function say(r) {
    var t = el('div', 'pxa-msg pxa-bot pxa-typing'); t.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(t); scroll();
    setTimeout(function () { t.remove(); addBot(r); setChips(r.c); }, 450 + Math.random() * 350);
  }
  function send(text) {
    text = (text || '').trim();
    if (!text) return;
    addUser(text);
    input.value = '';
    say(reply(text));
  }

  function setUI() {
    var u = S[L()].ui;
    titleEl.textContent = u.title; statusEl.textContent = u.status;
    input.placeholder = u.ph; input.setAttribute('aria-label', u.input);
    sendBtn.textContent = u.send; closeBtn.setAttribute('aria-label', u.close);
    fab.querySelector('.pxa-fab-t').textContent = u.fab;
    fab.setAttribute('aria-label', u.open);
    log.setAttribute('aria-label', u.log);
    if (chipsBox.children.length && !greeted) setChips();
  }

  function openChat() {
    opened = true; panel.hidden = false; fab.setAttribute('aria-expanded', 'true');
    if (!greeted) { greeted = true; setChips(); say({ t: pick(S[L()].hello) }); }
    setTimeout(function () { input.focus(); }, 50);
  }
  function closeChat() { opened = false; panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }

  function build() {
    fab = el('button', 'pxa pxa-fab'); fab.type = 'button';
    fab.innerHTML = '<span aria-hidden="true">💬</span><span class="pxa-fab-t"></span>';
    fab.setAttribute('aria-expanded', 'false');
    fab.addEventListener('click', function () { opened ? closeChat() : openChat(); });

    panel = el('section', 'pxa pxa-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog');
    var head = el('div', 'pxa-head');
    var av = el('div', 'pxa-av', 'P'); av.setAttribute('aria-hidden', 'true');
    var tx = el('div', 'pxa-ht'); titleEl = el('strong'); statusEl = el('small');
    tx.appendChild(titleEl); tx.appendChild(statusEl);
    closeBtn = el('button', 'pxa-x', '×'); closeBtn.type = 'button';
    closeBtn.addEventListener('click', closeChat);
    head.appendChild(av); head.appendChild(tx); head.appendChild(closeBtn);

    log = el('div', 'pxa-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
    chipsBox = el('div', 'pxa-chips');

    var form = el('form', 'pxa-form');
    input = el('input'); input.type = 'text'; input.autocomplete = 'off'; input.maxLength = 300;
    sendBtn = el('button', null); sendBtn.type = 'submit';
    form.appendChild(input); form.appendChild(sendBtn);
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });

    panel.appendChild(head); panel.appendChild(log); panel.appendChild(chipsBox); panel.appendChild(form);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(); });

    document.body.appendChild(panel); document.body.appendChild(fab);
    setUI();
    new MutationObserver(setUI).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.PixiAssistant = { reply: reply };

  function init() { build(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
