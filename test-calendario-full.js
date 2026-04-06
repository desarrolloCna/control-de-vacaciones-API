import { getCalendarioController } from "./src/apivacaciones/controller/calendario/calendario.controller.js";

async function runTest() {
  const req = {
    query: {
      unidad: "Todas",
      idRol: "1",
      puesto: "Director General"
    }
  };

  const res = {
    status: function (code) {
      console.log("Status called with:", code);
      return this;
    },
    json: function (data) {
      console.log("JSON called with:", data);
      return this;
    }
  };

  try {
    await getCalendarioController(req, res);
  } catch(e) {
    console.error("Uncaught exception in controller:", e);
  }
}

runTest();
