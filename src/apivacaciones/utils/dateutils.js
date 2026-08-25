import dayjs from "dayjs";

export const calcularRetornoYFestivosBackend = (startDate, diasVacaciones, diasFestivos) => {
    const isHoliday = (date) => {
        const fullDate = dayjs(date).format("YYYY-MM-DD");
        return diasFestivos.find((holiday) => holiday.fechaDiaFestivo === fullDate && holiday.estado === 'A');
    };

    let fechaFin = dayjs(startDate);
    let diasContados = 0;
    
    if (isHoliday(startDate)) {
        diasContados = 0;
    } else {
        diasContados = 1;
    }

    while (diasContados < diasVacaciones) {
        fechaFin = fechaFin.add(1, "day");
        const isWeekend = fechaFin.day() === 0 || fechaFin.day() === 6;
        if (!isWeekend && !isHoliday(fechaFin)) {
            diasContados++;
        }
    }

    let proximaFecha = dayjs(fechaFin).add(1, "day");
    while (proximaFecha.day() === 0 || proximaFecha.day() === 6 || isHoliday(proximaFecha)) {
        proximaFecha = proximaFecha.add(1, "day");
    }

    return { 
        fechaFin: fechaFin.format("YYYY-MM-DD"), 
        proximaFechaLaboral: proximaFecha.format("YYYY-MM-DD") 
    };
};
