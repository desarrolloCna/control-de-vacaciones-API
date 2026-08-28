async function test() {
    try {
        const res = await fetch("https://control-de-vacaciones-api-kappa.vercel.app/api/employeesList");
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
}
test();
