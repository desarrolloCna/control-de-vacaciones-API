import { getVacacionesAutorizadasGlobalDao } from './src/apivacaciones/dao/calendario/calendario.dao.js';

async function test() {
  try {
    const start = Date.now();
    const data = await getVacacionesAutorizadasGlobalDao('Todas', 1, 'Director General');
    const end = Date.now();
    console.log("Success! Data length:", data.length);
    console.log(`Time taken: ${end - start}ms`);
  } catch (err) {
    console.error("Caught error:");
    console.error(err);
  }
}

test();
