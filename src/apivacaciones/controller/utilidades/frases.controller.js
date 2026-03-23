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
  { texto: "Las oportunidades no ocurren, las creas tú.", autor: "Chris Grosser" }
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
