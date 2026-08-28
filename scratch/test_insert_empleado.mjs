import { IngresarEmpleadosService } from '../src/apivacaciones/services/empleados/empleados.service.js';

async function test() {
    try {
        const data = {
            idInfoPersonal: 115, // Un ID real de la base de datos de los incompletos
            puesto: "test",
            salario: 100,
            fechaIngreso: "2023-01-01",
            correoInstitucional: "test@test.com",
            extensionTelefonica: "123",
            unidad: "test",
            renglon: "test",
            observaciones: "",
            coordinacion: "",
            tipoContrato: "Permanente",
            numeroCuentaCHN: "123",
            numeroContrato: "123",
            numeroActa: "123",
            numeroAcuerdo: "123",
            isCoordinador: "0"
        };
        const res = await IngresarEmpleadosService(data);
        console.log("Success:", res);
    } catch(err) {
        console.error("Failed:", err);
    }
}
test();
