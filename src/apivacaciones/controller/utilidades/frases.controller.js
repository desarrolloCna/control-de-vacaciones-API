const frasesMotivadoras = [
  { texto: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", autor: "Robert Collier" },
  { texto: "Siempre parece imposible hasta que se hace.", autor: "Nelson Mandela" },
  { texto: "La única manera de hacer un gran trabajo es amar lo que haces.", autor: "Steve Jobs" },
  { texto: "No mires el reloj; haz lo mismo que él: sigue avanzando.", autor: "Sam Levenson" },
  { texto: "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es hoy.", autor: "Proverbio Chino" },
  { texto: "No cuentes los días, haz que los días cuenten.", autor: "Muhammad Ali" },
  { texto: "La motivación nos impulsa a comenzar y el hábito nos permite continuar.", autor: "Jim Ryun" },
  { texto: "El secreto del cambio es enfocar toda tu energía, no en luchar contra lo viejo, sino en construir lo nuevo.", autor: "Sócrates" },
  { texto: "Si puedes soñarlo, puedes hacerlo.", autor: "Walt Disney" },
  { texto: "Las oportunidades no ocurren, las creas tú.", autor: "Chris Grosser" },
  { texto: "Cree en ti mismo y en todo lo que eres. Reconoce que hay algo dentro de ti que es más grande que cualquier obstáculo.", autor: "Christian D. Larson" },
  { texto: "El único límite a nuestra realización de mañana serán nuestras dudas de hoy.", autor: "Franklin D. Roosevelt" },
  { texto: "Trabajar duro por algo que no nos importa se llama estrés; trabajar duro por algo que amamos se llama pasión.", autor: "Simon Sinek" },
  { texto: "No tienes que ser grande para empezar, pero tienes que empezar para ser grande.", autor: "Zig Ziglar" },
  { texto: "Cae siete veces, levántate ocho.", autor: "Proverbio Japonés" },
  { texto: "Nuestra mayor gloria no es no caer nunca, sino levantarnos cada vez que caemos.", autor: "Confucio" },
  { texto: "La disciplina es el puente entre las metas y los logros.", autor: "Jim Rohn" },
  { texto: "Haz de cada día tu obra maestra.", autor: "John Wooden" },
  { texto: "El optimismo es la fe que conduce al logro. Nada puede hacerse sin esperanza y confianza.", autor: "Helen Keller" },
  { texto: "Atrévete a ser la mejor versión de ti mismo.", autor: "Anónimo" },
  { texto: "Lo que haces hoy puede mejorar todos tus mañanas.", autor: "Ralph Marston" },
  { texto: "La diferencia entre lo ordinario y lo extraordinario es ese pequeño extra.", autor: "Jimmy Johnson" },
  { texto: "El camino hacia el éxito y el camino hacia el fracaso son casi exactamente los mismos.", autor: "Colin R. Davis" },
  { texto: "Da siempre lo mejor de ti. Lo que plantes ahora, lo cosecharás más tarde.", autor: "Og Mandino" },
  { texto: "Si la oportunidad no llama, construye una puerta.", autor: "Milton Berle" },
  { texto: "Sé el cambio que quieres ver en el mundo.", autor: "Mahatma Gandhi" },
  { texto: "Tu actitud, no tu aptitud, determinará tu altitud.", autor: "Zig Ziglar" },
  { texto: "Cuanto más difícil es el conflicto, más glorioso es el triunfo.", autor: "Thomas Paine" },
  { texto: "A veces la magia es simplemente alguien pasando más tiempo en algo que los demás.", autor: "Anónimo" },
  { texto: "Un líder es aquel que conoce el camino, va por el camino y muestra el camino.", autor: "John C. Maxwell" }
];

export const getFraseAleatoria = (req, res) => {
  try {
    const indiceAleatorio = Math.floor(Math.random() * frasesMotivadoras.length);
    const frase = frasesMotivadoras[indiceAleatorio];

    return res.status(200).json({
      exito: true,
      data: frase
    });
  } catch (error) {
    console.error("Error al obtener frase motivadora:", error);
    return res.status(500).json({
      exito: false,
      message: "Error interno del servidor al obtener la frase."
    });
  }
};
