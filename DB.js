//EN ESTE ARCHIVO VAN TODAS LAS INTERACCIONES DIRECTAS CON LA BASE DE DATOS

//DEFINICIONES:
const { query } = require('express');
var mysql = require('mysql');
// var md5 = require('md5');

//DATOS DE LA BASE:
var conexion =  mysql.createConnection({
    host: 'mysql.db.mdbgo.com',
    user: 'roy_dm_adminclinica',
    password: 'Admin1234!',
    database: 'roy_dm_dbclinica'
});

//ESTABLECER CONEXION (SIN EXPORT PARA QUE SOLO PUEDA USARSE DESDE ESTE ARCHIVO)
function conectar() {
    if (conexion.state === 'disconnected') {
        conexion.connect(function(err) {
            if (err) {
                console.log('Error al conectar a la base de datos:', err);
            } else {
                console.log('Conexión exitosa a la base de datos');
            }
        });
    }
}

//FUNCION INSERTAR PACIENTE EN BD
exports.insertarPaciente = function(datosPaciente){
    var sqlQuery = 'insert into UsuarioPaciente (nombre,apellido,dni,email,password,foto)';
    var queryValues = " values (" +
        "'" + datosPaciente.nombre + "'," +
        "'" + datosPaciente.apellido + "'," +
        "'" + datosPaciente.dni + "'," +
        "'" + datosPaciente.email + "'," +
        "'" + datosPaciente.password + "'," +
        "'" + datosPaciente.foto + "')";

    var sql = sqlQuery + queryValues;

    conectar();
    
    conexion.query(sql,function(err){
        auditarCambio();
        if(err) throw err;});
    
    //sql= sql + "'" + md5("clavesupersecreta" + datosPaciente.pass) + "')"; sin implementar

}
//FUNCION INSERTAR PROFESIONAL EN BD
exports.insertarProfesional = function(datosProfesional){
    
    var sqlQuery = 'insert into UsuarioProfesional (nombre,apellido,dni,email,password,foto,especialidad,diasAtencion,inicioAtencion,finAtencion,fotoEsp)';
    var queryValues = " values (" +
        "'" + datosProfesional.nombre + "'," +
        "'" + datosProfesional.apellido + "'," +
        "'" + datosProfesional.dni + "'," +
        "'" + datosProfesional.email + "'," +
        "'" + datosProfesional.password + "'," +
        "'" + datosProfesional.foto + "'," +
        "'" + datosProfesional.especialidad + "'," +
        "'" + datosProfesional.diasAtencion + "'," +
        "'" + datosProfesional.inicioAtencion + "'," +
        "'" + datosProfesional.finAtencion + "'," +
        "'" + datosProfesional.fotoEsp + "')";

    var sql = sqlQuery + queryValues;

    conectar();
    
    conexion.query(sql,function(err){
        auditarCambio();
        if(err) throw err;});
}
//FUNCION INSERTAR GERENTE EN BD
exports.insertarGerente = function(datosGerente){
    
    var sqlQuery = 'insert into UsuarioGerente (nombre,apellido,dni,email,password,foto)';
    var queryValues = " values (" +
        "'" + datosGerente.nombre + "'," +
        "'" + datosGerente.apellido + "'," +
        "'" + datosGerente.dni + "'," +
        "'" + datosGerente.email + "'," +
        "'" + datosGerente.password + "'," +
        "'" + datosGerente.foto + "')";

    var sql = sqlQuery + queryValues;

    conectar();
    
    conexion.query(sql,function(err){
        auditarCambio();
        if(err) throw err;});
}

//FUNCION PARA TRAER UN PACIENTE DE LA BD SEGUN EMAIL Y PASSWORD
exports.buscarPaciente = function(emailPaciente, passwordPaciente) {

    conectar();

    const sqlQuery = "SELECT * FROM UsuarioPaciente WHERE email = ? AND password = ?";
    const queryValues = [emailPaciente, passwordPaciente];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });
};

//FUNCION PARA TRAER UN PROFESIONAL DE LA BD SEGUN EMAIL Y PASSWORD
exports.buscarProfesional = function(emailProfesional, passwordProfesional) {

    conectar();

    const sqlQuery = "SELECT * FROM UsuarioProfesional WHERE email = ? AND password = ? AND activo = 1";
    const queryValues = [emailProfesional, passwordProfesional];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });
};

//FUNCION PARA TRAER UN PROFESIONAL DE LA BD SEGUN ESTADO
exports.buscarProfesionalPorEstado = function(estadoProfesional) {

    conectar();

    const sqlQuery = "SELECT * FROM UsuarioProfesional WHERE activo = ?";
    const queryValues = [estadoProfesional];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });
};

//FUNCION PARA TRAER PROFESIONALES DE LA BD SEGUN ACTIVIDAD (0 no activo, 1 activo)
exports.buscarTodosProfesionales = function(estado) {
    var estadoProf = 1;
    if(estado !== 1) {estadoProf = 0};

    conectar();

    const sqlQuery = "SELECT * FROM UsuarioProfesional WHERE activo = ?";
    const queryValues = [estadoProf];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });

    });

};

//ACTIVAR O DESACTIVAR UN PROFESIONAL
exports.profesionalActivarDesactivar = function(emailProfesional,estadoProfesional){

    let estadoActualizado = estadoProfesional;
    if (estadoProfesional != 1) {estadoActualizado = 0};

    conectar();


    const sqlQuery = "UPDATE UsuarioProfesional SET activo = ? WHERE email = ?";
    const queryValues = [estadoActualizado, emailProfesional];

    conexion.query(sqlQuery, queryValues, function(err) {
        auditarCambio();
        if (err) throw err;});
};

//FUNCION PARA TRAER UN GERENTE DE LA BD SEGUN EMAIL Y PASSWORD
exports.buscarGerente = function(emailGerente, passwordGerente) {

    conectar();

    const sqlQuery = "SELECT * FROM UsuarioGerente WHERE email = ? AND password = ?";
    const queryValues = [emailGerente, passwordGerente];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });

};

//FUNCION INSERTAR TURNO EN BD
exports.insertarTurno = function(datosTurno){
    
    var sqlQuery = "INSERT INTO TurnosActivos (paciente,especialidad,dia,horario,profesional) values (?,?,?,?,?)";
    const queryValues = [datosTurno.paciente, datosTurno.especialidad, datosTurno.dia, datosTurno.horario, datosTurno.profesional];

    conectar();
    
    conexion.query(sqlQuery, queryValues, function(err){
        if(err) throw err;});
}

//FUNCION PARA TRAER TURNOS ACTIVOS DE LA BASE DE DATOS SEGUN PACIENTE
exports.buscarTurnosActivos = function(emailPaciente) {
    conectar();

    const sqlQuery = "SELECT * FROM TurnosActivos WHERE paciente = ?";
    const queryValues = [emailPaciente];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });
    
};

//FUNCION PARA TRAER TURNOS ACTIVOS DE LA BASE DE DATOS SEGUN PROFESIONAL
exports.buscarTurnosActivosPorProfesional = function(profesional) {
    conectar();

    const sqlQuery = "SELECT * FROM TurnosActivos WHERE profesional = ?";
    const queryValues = [profesional];

    return new Promise((resolve, reject) => {
        conexion.query(sqlQuery, queryValues, function(err, resultados) {
            if (err) reject(err);
            resolve(resultados);
        });
    });
    
};

// FUNCIÓN PARA BUSCAR TODOS LOS TURNOS DISPONIBLES SEGUN CHAT
exports.buscarTurnosDisponibles = function() {
    conectar();

    const sqlQueryProfesionales = "SELECT * FROM UsuarioProfesional WHERE activo = 1";
    const sqlQueryTurnosActivos = "SELECT * FROM TurnosActivos";

    return new Promise((resolve, reject) => {
        conexion.query(sqlQueryProfesionales, function(err, profesionales) {
            if (err) {
                reject(err);
                return;
            }

            conexion.query(sqlQueryTurnosActivos, function(err, turnosActivos) {
                if (err) {
                    reject(err);
                    return;
                }

                const turnosDeProfesionales = [];

                profesionales.forEach(prof => {
                    const profNombre = `${prof.nombre} ${prof.apellido}`;
                    const diasArray = prof.diasAtencion.split('/');
                    const diasTrabajo = obtenerFechasCorrespondientes(diasArray, 14);
                    const horariosInicio = prof.inicioAtencion.split('/');
                    const horariosFin = prof.finAtencion.split('/');

                    diasTrabajo.forEach((dia, index) => {

                        let indexdia = index;
                        if (indexdia > (diasTrabajo.length/2 -1)) {indexdia = indexdia - diasTrabajo.length/2};

                        let [inicioHora, inicioMinuto] = horariosInicio[indexdia].split(':');
                        let [finHora, finMinuto] = horariosFin[indexdia].split(':');

                        //console.log(dia + ' desde ' + inicioHora + ':' + inicioMinuto + ' hasta ' + finHora + ':' + finMinuto);

                        let horaActual = inicioHora;
                        let minutoActual = inicioMinuto;

                        //Generar todos los turnos posibles de 30'
                        while (
                            Number(horaActual) < Number(finHora) || 
                            (Number(horaActual.map) === Number(finHora) && Number(minutoActual) < Number(finMinuto)) //No pasarse de hora
                        ) {
                            const horario = `${horaActual}:${minutoActual}`;
                            const turno = {
                                paciente: '',
                                especialidad: prof.especialidad,
                                dia: dia,
                                horario: horario,
                                profesional: profNombre
                            };
                            turnosDeProfesionales.push(turno);

                            if (minutoActual === '30') {
                                minutoActual = '00';
                                h = Number(horaActual) +1;
                                horaActual = h.toString().padStart(2, '0');
                            } else {minutoActual = '30'};
                        }
                    });
                });

                const turnosDisponibles = turnosDeProfesionales.filter(turno => {
                    return !turnosActivos.some(tactivo => {
                        return tactivo.especialidad === turno.especialidad &&
                                tactivo.dia === turno.dia &&
                                tactivo.horario === turno.horario &&
                                tactivo.profesional === turno.profesional;
                    });
                });

                resolve(turnosDisponibles);
            });
        });
    });
};

//ACEPTAR, CANCELAR O RECHAZAR UN TURNO
exports.turnoAceptarCancelar = function(especialidad, dia, horario, profesional, accion){

    conectar();

    let sqlQuery;
    const queryValues = [especialidad, dia, horario, profesional];

    if (accion === -1) {
        sqlQuery = "DELETE FROM TurnosActivos WHERE especialidad = ? AND dia = ? AND horario = ? AND profesional = ?";
    } else if (accion === 0) {
        sqlQuery = "UPDATE TurnosActivos SET estado = 0 WHERE especialidad = ? AND dia = ? AND horario = ? AND profesional = ?";
    } else if (accion === 1) {
        sqlQuery = "UPDATE TurnosActivos SET estado = 1 WHERE especialidad = ? AND dia = ? AND horario = ? AND profesional = ?";
    } else {
        throw new Error("Acción inválida. La acción debe ser -1, 0, o 1.");
    }

    conexion.query(sqlQuery, queryValues, function(err) {
        auditarCambio();
        if (err) throw err;
    });
};

function obtenerNombreDiaEnEspanol(dia) {
    const diasEnEspanol = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasEnEspanol[dia];
}

function obtenerFechasCorrespondientes(dias, cantidadDias) {
    const fechasCorrespondientes = [];
    const hoy = new Date();
    
    for (let i = 0; i < cantidadDias; i++) {
        const fecha = new Date();
        fecha.setDate(hoy.getDate() + i);
        const nombreDia = obtenerNombreDiaEnEspanol(fecha.getDay());
        
        if (dias.includes(nombreDia)) {
            const numeroDia = fecha.getDate();
            const fechaFormateada = nombreDia + ' ' + numeroDia;
            fechasCorrespondientes.push(fechaFormateada);
        }
    }

    return fechasCorrespondientes;
}

//PARA AGREGAR AUDITORIA EN EL FUTURO (SIN EXPORT, FUNCIONA SOLO EN BD)
async function auditarCambio() {
    var textoCambio = 'Aca se realizo un cambio significativo';
    
    var fecha = new Date();
    var nombreDia = obtenerNombreDiaEnEspanol(fecha.getDay());
    var numeroDia = fecha.getDate();
    var fechaFormateada = nombreDia + ' ' + numeroDia;

    var consulta_p1 = "INSERT INTO auditoria (cambio, fecha)";
    var consulta_p2 = " values ("+
        "'" + textoCambio + "'," +
        "'" + fechaFormateada + "')";

    var consultaSql = consulta_p1 + consulta_p2;

    conectar();

    conexion.query(consultaSql, function(err) {
        if(err) throw err;
    });
}