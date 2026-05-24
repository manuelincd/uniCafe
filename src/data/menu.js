export const CATEGORIAS = [
  {
    id: 'buenos-dias',
    nombre: 'Buenos Días',
    emoji: '☀️',
    descripcion: 'Desayunos para empezar con energía'
  },
  {
    id: 'antojitos',
    nombre: 'Antojitos',
    emoji: '🌮',
    descripcion: 'Los clásicos antojitos mexicanos'
  },
  {
    id: 'lonche',
    nombre: 'Lonche',
    emoji: '🥪',
    descripcion: 'Tortas, sandwiches y más'
  },
  {
    id: 'comida-del-dia',
    nombre: 'Comida del Día',
    emoji: '🍽️',
    descripcion: 'El plato del día con guiso casero'
  },
  {
    id: 'pal-antojo',
    nombre: 'Pal Antojo',
    emoji: '🍟',
    descripcion: 'Hot dogs, hamburguesas y papas'
  },
  {
    id: 'postres',
    nombre: 'Postres',
    emoji: '🍮',
    descripcion: 'Para cerrar con sabor dulce'
  },
  {
    id: 'bebidas',
    nombre: 'Bebidas',
    emoji: '🥤',
    descripcion: 'Jugos, licuados, café y más'
  }
]

// Personalizaciones reutilizables
const P = {
  sinCebolla:    { id: 'sin-cebolla',   label: 'Sin cebolla',       costo: 0 },
  sinChile:      { id: 'sin-chile',      label: 'Sin chile',         costo: 0 },
  sinSalsa:      { id: 'sin-salsa',      label: 'Sin salsa',         costo: 0 },
  extraQueso:    { id: 'extra-queso',    label: 'Extra queso',       costo: 8 },
  extraSalsa:    { id: 'extra-salsa',    label: 'Extra salsa',       costo: 5 },
  sinCrema:      { id: 'sin-crema',      label: 'Sin crema',         costo: 0 },
  conCrema:      { id: 'con-crema',      label: 'Con crema',         costo: 3 },
  sinAzucar:     { id: 'sin-azucar',     label: 'Sin azúcar',        costo: 0 },
  conLeche:      { id: 'con-leche',      label: 'Con leche',         costo: 0 },
  extraProteina: { id: 'extra-proteina', label: 'Extra proteína',    costo: 10 },
  sinFrijoles:   { id: 'sin-frijoles',   label: 'Sin frijoles',      costo: 0 },
  extraAguacate: { id: 'extra-aguacate', label: 'Extra aguacate',    costo: 8 },
  sinJamon:      { id: 'sin-jamon',      label: 'Sin jamón',         costo: 0 },
  sinPina:       { id: 'sin-pina',       label: 'Sin piña',          costo: 0 },
  papasExtra:    { id: 'papas-extra',    label: 'Papas extra',       costo: 15 },
  sinKetchup:    { id: 'sin-ketchup',    label: 'Sin ketchup',       costo: 0 },
  sinMostaza:    { id: 'sin-mostaza',    label: 'Sin mostaza',       costo: 0 },
}

export const PRODUCTOS = [
  // ─── BUENOS DÍAS ───────────────────────────────────────────────
  {
    id: 'bd-01',
    categoriaId: 'buenos-dias',
    nombre: 'Desayuno completo',
    descripcion: 'Huevos al gusto, frijoles, tortillas y café o jugo',
    precio: 65,
    disponibilidad: 'disponible',
    imagen: '/images/menu/desayuno-mexicano.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinFrijoles,
      P.extraQueso, P.sinCrema, P.conCrema
    ]
  },
  {
    id: 'bd-02',
    categoriaId: 'buenos-dias',
    nombre: 'Orden de huevos',
    descripcion: 'Huevos al gusto acompañados de frijoles y tortillas',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/huevos.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinFrijoles,
      P.extraQueso, P.extraSalsa, P.sinSalsa
    ]
  },
  {
    id: 'bd-03',
    categoriaId: 'buenos-dias',
    nombre: 'Orden de hotcakes',
    descripcion: 'Tres hotcakes esponjosos con miel y mantequilla',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/hotcakes.jpg',
    personalizaciones: [
      P.sinAzucar, P.extraProteina
    ]
  },
  {
    id: 'bd-04',
    categoriaId: 'buenos-dias',
    nombre: 'Chilaquiles',
    descripcion: 'Totopos bañados en salsa roja o verde, crema y queso',
    precio: 55,
    disponibilidad: 'disponible',
    imagen: '/images/menu/chilaquiles.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinCrema, P.conCrema,
      P.extraQueso, P.extraSalsa, P.sinSalsa, P.extraProteina
    ]
  },
  {
    id: 'bd-05',
    categoriaId: 'buenos-dias',
    nombre: 'Sincronizada',
    descripcion: 'Tortilla de harina con jamón y queso gratinado',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/sincronizada.jpg',
    personalizaciones: [
      P.sinJamon, P.extraQueso, P.sinSalsa
    ]
  },
  {
    id: 'bd-06',
    categoriaId: 'buenos-dias',
    nombre: 'Molletes con mantequilla',
    descripcion: 'Bolillo abierto con mantequilla y azúcar',
    precio: 30,
    disponibilidad: 'disponible',
    imagen: '/images/menu/molleteazucar.jpg',
    personalizaciones: [
      P.sinAzucar
    ]
  },

  // ─── ANTOJITOS ─────────────────────────────────────────────────
  {
    id: 'ant-01',
    categoriaId: 'antojitos',
    nombre: 'Enchiladas suizas',
    descripcion: 'Tortillas bañadas en salsa verde con pollo, crema y queso',
    precio: 55,
    disponibilidad: 'disponible',
    imagen: '/images/menu/enchiladas.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinCrema, P.conCrema,
      P.extraQueso, P.extraSalsa, P.sinSalsa
    ]
  },
  {
    id: 'ant-02',
    categoriaId: 'antojitos',
    nombre: 'Taquitos de adobada',
    descripcion: 'Taquitos de cerdo adobado con cebolla y cilantro',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/tacos.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinSalsa, P.extraSalsa
    ]
  },
  {
    id: 'ant-03',
    categoriaId: 'antojitos',
    nombre: 'Tacos tuxpeños',
    descripcion: 'Tacos de frijoles con queso y rajas, estilo Tuxpan',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/tacos.jpg',
    personalizaciones: [
      P.sinChile, P.sinFrijoles, P.extraQueso, P.sinSalsa, P.extraSalsa
    ]
  },
  {
    id: 'ant-04',
    categoriaId: 'antojitos',
    nombre: 'Enfrijoladas',
    descripcion: 'Tortillas bañadas en salsa de frijol con queso y crema',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/comida-mexicana.jpg',
    personalizaciones: [
      P.sinChile, P.sinCrema, P.conCrema, P.extraQueso, P.sinSalsa
    ]
  },
  {
    id: 'ant-05',
    categoriaId: 'antojitos',
    nombre: 'Flautas de pollo',
    descripcion: 'Tortillas enrolladas con pollo, acompañadas de guacamole y crema',
    precio: 55,
    disponibilidad: 'disponible',
    imagen: '/images/menu/flautas.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinCrema, P.conCrema,
      P.extraQueso, P.extraAguacate, P.sinSalsa
    ]
  },
  {
    id: 'ant-06',
    categoriaId: 'antojitos',
    nombre: 'Sopitos',
    descripcion: 'Masa frita con frijoles, lechuga, queso y salsa',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/sopitos.jpg',
    personalizaciones: [
      P.sinChile, P.sinFrijoles, P.extraQueso, P.sinSalsa, P.extraSalsa
    ]
  },

  // ─── LONCHE ────────────────────────────────────────────────────
  {
    id: 'lon-01',
    categoriaId: 'lonche',
    nombre: 'Torta de lomo',
    descripcion: 'Pan telera con lomo de cerdo, aguacate, jitomate y chile',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraAguacate, P.sinSalsa,
      P.extraQueso, P.sinCrema, P.conCrema
    ]
  },
  {
    id: 'lon-02',
    categoriaId: 'lonche',
    nombre: 'Torta hawaiana',
    descripcion: 'Pan telera con jamón, queso, piña y chile',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinPina, P.sinChile, P.extraQueso, P.sinSalsa
    ]
  },
  {
    id: 'lon-03',
    categoriaId: 'lonche',
    nombre: 'Torta cubana',
    descripcion: 'Pan telera cargada con milanesa, jamón, salchicha, queso y aguacate',
    precio: 55,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraAguacate, P.extraQueso,
      P.sinSalsa, P.sinCrema, P.conCrema
    ]
  },
  {
    id: 'lon-04',
    categoriaId: 'lonche',
    nombre: 'Torta de panela',
    descripcion: 'Pan telera con queso panela asado, aguacate y chile',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraAguacate, P.sinSalsa, P.extraQueso
    ]
  },
  {
    id: 'lon-05',
    categoriaId: 'lonche',
    nombre: 'Torta de jamón',
    descripcion: 'Pan telera con jamón, queso, aguacate y chile',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinJamon, P.sinCebolla, P.sinChile, P.extraAguacate,
      P.extraQueso, P.sinSalsa, P.conCrema
    ]
  },
  {
    id: 'lon-06',
    categoriaId: 'lonche',
    nombre: 'Medio pachuco sencillo',
    descripcion: 'Medio bolillo con frijoles y queso',
    precio: 40,
    disponibilidad: 'disponible',
    imagen: '/images/menu/molletes.jpg',
    personalizaciones: [
      P.sinFrijoles, P.extraQueso, P.sinChile
    ]
  },
  {
    id: 'lon-07',
    categoriaId: 'lonche',
    nombre: 'Medio pachuco con carne',
    descripcion: 'Medio bolillo con frijoles, queso y milanesa',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/molletes.jpg',
    personalizaciones: [
      P.sinFrijoles, P.extraQueso, P.sinChile, P.sinCebolla
    ]
  },
  {
    id: 'lon-08',
    categoriaId: 'lonche',
    nombre: 'Sandwich de lomo',
    descripcion: 'Pan de caja tostado con lomo, lechuga, jitomate y mayonesa',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraQueso, P.sinSalsa, P.conCrema
    ]
  },
  {
    id: 'lon-09',
    categoriaId: 'lonche',
    nombre: 'Sandwich de pollo',
    descripcion: 'Pan de caja tostado con pollo, lechuga, jitomate y mayonesa',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.extraQueso, P.sinSalsa, P.conCrema, P.extraProteina
    ]
  },
  {
    id: 'lon-10',
    categoriaId: 'lonche',
    nombre: 'Sandwich de panela',
    descripcion: 'Pan de caja tostado con queso panela, lechuga y jitomate',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinCebolla, P.extraQueso, P.sinSalsa, P.sinChile
    ]
  },
  {
    id: 'lon-11',
    categoriaId: 'lonche',
    nombre: 'Sandwich de jamón',
    descripcion: 'Pan de caja tostado con jamón, queso, lechuga y jitomate',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/torta.jpg',
    personalizaciones: [
      P.sinJamon, P.extraQueso, P.sinSalsa, P.sinCebolla, P.conCrema
    ]
  },

  // ─── COMIDA DEL DÍA ────────────────────────────────────────────
  {
    id: 'com-01',
    categoriaId: 'comida-del-dia',
    nombre: 'Guiso del día sin agua',
    descripcion: 'Plato del día con arroz, frijoles y tortillas',
    precio: 55,
    disponibilidad: 'disponible',
    imagen: '/images/menu/comida-mexicana.jpg',
    personalizaciones: [
      P.sinChile, P.sinFrijoles, P.extraSalsa, P.sinSalsa, P.sinCrema, P.conCrema
    ]
  },
  {
    id: 'com-02',
    categoriaId: 'comida-del-dia',
    nombre: 'Guiso del día con agua',
    descripcion: 'Plato del día completo con agua fresca incluida',
    precio: 65,
    disponibilidad: 'disponible',
    imagen: '/images/menu/comida-mexicana.jpg',
    personalizaciones: [
      P.sinChile, P.sinFrijoles, P.extraSalsa, P.sinSalsa, P.sinCrema, P.conCrema
    ],
    grupos: [
      {
        id: 'sabor-agua',
        label: 'Sabor del agua',
        requerido: true,
        default: 'agua-jamaica',
        opciones: [
          { id: 'agua-jamaica',  label: 'Jamaica'  },
          { id: 'agua-horchata', label: 'Horchata' },
          { id: 'agua-limon',    label: 'Limón'    },
          { id: 'agua-naranja',  label: 'Naranja'  },
        ]
      }
    ]
  },
  {
    id: 'com-03',
    categoriaId: 'comida-del-dia',
    nombre: 'Ensalada de pollo',
    descripcion: 'Ensalada fresca con pollo a la plancha, verduras y aderezo',
    precio: 60,
    disponibilidad: 'disponible',
    imagen: '/images/menu/ensalada-pollo.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraProteina, P.sinSalsa
    ]
  },

  // ─── PAL ANTOJO ────────────────────────────────────────────────
  {
    id: 'pal-01',
    categoriaId: 'pal-antojo',
    nombre: 'Hot dog',
    descripcion: 'Salchicha en pan con cátsup, mostaza y mayonesa',
    precio: 35,
    disponibilidad: 'disponible',
    imagen: '/images/menu/hotdog.jpg',
    personalizaciones: [
      P.sinKetchup, P.sinMostaza, P.sinCebolla, P.extraQueso
    ]
  },
  {
    id: 'pal-02',
    categoriaId: 'pal-antojo',
    nombre: 'Hamburguesa sencilla',
    descripcion: 'Carne de res con lechuga, jitomate, queso y mayonesa',
    precio: 50,
    disponibilidad: 'disponible',
    imagen: '/images/menu/hamburguesa.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraQueso, P.sinKetchup,
      P.sinMostaza, P.extraProteina
    ]
  },
  {
    id: 'pal-03',
    categoriaId: 'pal-antojo',
    nombre: 'Hamburguesa con papas',
    descripcion: 'Hamburguesa sencilla acompañada de papas a la francesa',
    precio: 70,
    disponibilidad: 'disponible',
    imagen: '/images/menu/hamburguesa-papas.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.extraQueso, P.sinKetchup,
      P.sinMostaza, P.extraProteina, P.papasExtra
    ]
  },
  {
    id: 'pal-04',
    categoriaId: 'pal-antojo',
    nombre: 'Burritos',
    descripcion: 'Tortilla de harina con carne, frijoles, queso y salsa',
    precio: 45,
    disponibilidad: 'disponible',
    imagen: '/images/menu/burrito.jpg',
    personalizaciones: [
      P.sinCebolla, P.sinChile, P.sinFrijoles, P.extraQueso,
      P.extraSalsa, P.sinSalsa
    ]
  },
  {
    id: 'pal-05',
    categoriaId: 'pal-antojo',
    nombre: 'Papas a la francesa',
    descripcion: 'Papas doradas y crujientes con sal y tu salsa favorita',
    precio: 35,
    disponibilidad: 'disponible',
    imagen: '/images/menu/papas.jpg',
    personalizaciones: [
      P.sinKetchup, P.extraSalsa, P.extraQueso
    ]
  },

  // ─── POSTRES ───────────────────────────────────────────────────
  {
    id: 'pos-01',
    categoriaId: 'postres',
    nombre: 'Fruta',
    descripcion: 'Fruta fresca de temporada con chile y limón',
    precio: 30,
    disponibilidad: 'disponible',
    imagen: '/images/menu/fruta.jpg',
    personalizaciones: [
      P.sinChile
    ]
  },
  {
    id: 'pos-02',
    categoriaId: 'postres',
    nombre: 'Gelatina',
    descripcion: 'Gelatina del día con crema chantilly',
    precio: 20,
    disponibilidad: 'disponible',
    imagen: '/images/menu/gelatina.jpg',
    personalizaciones: [
      P.sinCrema
    ]
  },
  {
    id: 'pos-03',
    categoriaId: 'postres',
    nombre: 'Crepas',
    descripcion: 'Crepas con cajeta, crema y nuez',
    precio: 40,
    disponibilidad: 'disponible',
    imagen: '/images/menu/crepas.jpg',
    personalizaciones: [
      P.sinCrema, P.sinAzucar
    ]
  },

  // ─── BEBIDAS ───────────────────────────────────────────────────
  {
    id: 'beb-01',
    categoriaId: 'bebidas',
    nombre: 'Agua de sabor',
    descripcion: 'Agua fresca del día (Jamaica, Horchata, Tamarindo o Limón)',
    precio: 20,
    disponibilidad: 'disponible',
    imagen: '/images/menu/agua-fresca.jpg',
    personalizaciones: [
      P.sinAzucar
    ]
  },
  {
    id: 'beb-02',
    categoriaId: 'bebidas',
    nombre: 'Jugo de naranja',
    descripcion: 'Jugo natural de naranja recién exprimido',
    precio: 30,
    disponibilidad: 'disponible',
    imagen: '/images/menu/jugo-naranja.jpg',
    personalizaciones: []
  },
  {
    id: 'beb-03',
    categoriaId: 'bebidas',
    nombre: 'Jugo verde',
    descripcion: 'Mezcla de espinaca, nopal, pepino, piña y limón',
    precio: 30,
    disponibilidad: 'disponible',
    imagen: '/images/menu/jugo-verde.jpg',
    personalizaciones: [
      P.sinAzucar
    ]
  },
  {
    id: 'beb-04',
    categoriaId: 'bebidas',
    nombre: 'Licuado de frutas',
    descripcion: 'Licuado con frutas de temporada, leche y miel',
    precio: 35,
    disponibilidad: 'disponible',
    imagen: '/images/menu/licuado.jpg',
    personalizaciones: [
      P.sinAzucar, P.conLeche, P.extraProteina
    ]
  },
  {
    id: 'beb-05',
    categoriaId: 'bebidas',
    nombre: 'Chocomilk',
    descripcion: 'Leche con chocolate, frío o caliente',
    precio: 25,
    disponibilidad: 'disponible',
    imagen: '/images/menu/chocomilk.jpg',
    personalizaciones: [
      P.sinAzucar, P.conLeche
    ]
  },
  {
    id: 'beb-06',
    categoriaId: 'bebidas',
    nombre: 'Vaso con leche',
    descripcion: 'Vaso de leche entera, frío o caliente',
    precio: 20,
    disponibilidad: 'disponible',
    imagen: '/images/menu/leche.jpg',
    personalizaciones: [
      P.sinAzucar
    ]
  },
  {
    id: 'beb-07',
    categoriaId: 'bebidas',
    nombre: 'Café',
    descripcion: 'Café de olla o americano, con o sin leche',
    precio: 20,
    disponibilidad: 'disponible',
    imagen: '/images/menu/cafe.jpg',
    personalizaciones: [
      P.sinAzucar, P.conLeche
    ]
  },
  {
    id: 'beb-08',
    categoriaId: 'bebidas',
    nombre: 'Té',
    descripcion: 'Té de manzanilla, limón o hierbabuena',
    precio: 15,
    disponibilidad: 'disponible',
    imagen: '/images/menu/te.jpg',
    personalizaciones: [
      P.sinAzucar, P.conLeche
    ]
  }
]

// Helpers de búsqueda
export const getProducto = (id) => PRODUCTOS.find((p) => p.id === id)
export const getProductosPorCategoria = (categoriaId) =>
  PRODUCTOS.filter((p) => p.categoriaId === categoriaId)
export const getCategoria = (id) => CATEGORIAS.find((c) => c.id === id)
