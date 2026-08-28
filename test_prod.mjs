const data = {
    "idInfoPersonal": 115,
    "puesto": "test",
    "salario": 100,
    "fechaIngreso": "2023-01-01",
    "correoInstitucional": "test@test.com",
    "extensionTelefonica": "123",
    "unidad": "test",
    "renglon": "test",
    "observaciones": "",
    "coordinacion": "",
    "tipoContrato": "Permanente",
    "numeroCuentaCHN": "123",
    "numeroContrato": "123",
    "numeroActa": "123",
    "numeroAcuerdo": "123",
    "isCoordinador": "0"
};

fetch("http://localhost:3000/api/ingresarEmpleado", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
})
.then(res => res.text())
.then(text => console.log(text))
.catch(err => console.error(err));
