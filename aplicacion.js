var db = require('./DB');

exports.insertarPaciente = function(datosPaciente){
    db.insertarPaciente(datosPaciente);
}
exports.insertarProfesional = function(datosProfesional){
    db.insertarProfesional(datosProfesional);
}
exports.insertarGerente = function(datosGerente){
    db.insertarGerente(datosGerente);
}

exports.buscarPaciente = async function(emailPaciente, passwordPaciente){
    try {
        var pacienteEncontrado = await db.buscarPaciente(emailPaciente, passwordPaciente);
        return pacienteEncontrado[0];
    } catch (error) {
        console.error('Error al buscar el paciente:', error);
        throw error;
    }
}

exports.buscarProfesional = async function(emailProfesional, passwordProfesional){
    try {
        var profesionalEncontrado = await db.buscarProfesional(emailProfesional, passwordProfesional);
        return profesionalEncontrado[0];
    } catch (error) {
        console.error('Error al buscar el profesional:', error);
        throw error;
    }
}

exports.buscarProfesionalPorEstado = async function(estadoProfesional){
    try {
        var profesionalEncontrado = await db.buscarProfesionalPorEstado(estadoProfesional);
        return profesionalEncontrado;
    } catch (error) {
        console.error('Error al buscar profesionales.', error);
        throw error;
    }
}

exports.buscarTodosProfesionales = async function(estado){
    try {
        var profesionalesEncontrados = await db.buscarTodosProfesionales(estado);
        return profesionalesEncontrados;
    } catch (error) {
        console.error('Error al buscar profesionales:', error);
        throw error;
    }
}

exports.profesionalActivarDesactivar = function(emailProfesional,estadoProfesional){
    db.profesionalActivarDesactivar(emailProfesional,estadoProfesional);
};

exports.buscarGerente = async function(emailGerente, passwordGerente){
    try {
        var gerenteEncontrado = await db.buscarGerente(emailGerente, passwordGerente);
        return gerenteEncontrado[0];
    } catch (error) {
        console.error('Error al buscar el gerente:', error);
        throw error;
    }
}

exports.insertarTurno = function(datosTurno){
    db.insertarTurno(datosTurno);
}

exports.buscarTurnosActivos = async function(emailPaciente){
    try {
        var turnosEncontrados = await db.buscarTurnosActivos(emailPaciente);
        return turnosEncontrados;
    } catch (error) {
        console.error('Error al buscar turnos:', error);
        throw error;
    }
}

exports.buscarTurnosDisponibles = async function(){
    try {
        var turnosEncontrados = await db.buscarTurnosDisponibles();
        return turnosEncontrados;
    } catch (error) {
        console.error('Error al buscar turnos:', error);
        throw error;
    }
}