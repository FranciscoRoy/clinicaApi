const express = require('express');
const aplicacion = require('./aplicacion');
const cors = require('cors');
//const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
//app.use(express.json({ limit: '10mb' }));
//app.use(express.urlencoded({ limit: '10mb', extended: true }));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

//FUNCION PARA ESCUCHAR EL PUERTO DE ENTRADA
app.listen( process.env.PORT || 3000, () => {
    console.log('Escuchando el puerto 3000.');
})

//FUNCION PARA AGREGAR UN NUEVO PACIENTE
app.post('/registroPaciente', (req) =>{
    var datosPaciente = req.body;
    aplicacion.insertarPaciente(datosPaciente);
})

//FUNCION PARA AGREGAR UN NUEVO PROFESIONAL
app.post('/registroProfesional', (req) =>{
    var datosProfesional = req.body;
    aplicacion.insertarProfesional(datosProfesional);
})

//FUNCION PARA AGREGAR UN NUEVO GERENTE
app.post('/registroGerente', (req) =>{
    var datosGerente = req.body;
    aplicacion.insertarGerente(datosGerente);
})

//ENCONTRAR UN PACIENTE POR EMAIL Y PASSWORD
app.post('/buscarPaciente', async (req, res) => {
  var emailPaciente = req.body.email;
  var passwordPaciente = req.body.password;
  
  if (!emailPaciente || !passwordPaciente) {
      res.status(400).send('Faltan parámetros: email y password son obligatorios.');
      return;
  }

  try {
      let usuarioPaciente = await buscarPaciente(emailPaciente, passwordPaciente);
      if (!usuarioPaciente || usuarioPaciente.length === 0) {
          res.status(404).send('Usuario no encontrado.');
          return;
      }

      res.json(usuarioPaciente);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al buscar el paciente.');
  }
});

//ENCONTRAR UN PROFESIONAL POR EMAIL Y PASSWORD
app.post('/buscarProfesional', async (req, res) => {
  var emailProfesional = req.body.email;
  var passwordProfesional = req.body.password;
  
  if (!emailProfesional || !passwordProfesional) {
      res.status(400).send('Faltan parámetros: email y password son obligatorios.');
      return;
  }

  try {
      let usuarioProfesional = await buscarProfesionalPorEmailyPass(emailProfesional, passwordProfesional);
      if (!usuarioProfesional || usuarioProfesional.length === 0) {
          res.status(404).send('Usuario no encontrado.');
          return;
      }

      res.json(usuarioProfesional);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al buscar el profesional.');
  }
});

//ENCONTRAR UN PROFESIONAL POR ESTADO
app.post('/buscarProfesionalesPorEstado', async (req, res) => {
    var estadoProfesional = req.body.estado;
    
    if (!estadoProfesional) {
        this.estadoProfesional = 1;
    }
  
    try {
        let usuarioProfesional = await buscarProfesionalPorEstado(estadoProfesional);
        if (!usuarioProfesional || usuarioProfesional.length === 0) {
            res.status(404).send('Profesionales no encontrados.');
            return;
        }
  
        res.json(usuarioProfesional);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar profesionales.');
    }
  });

//ACTIVAR O DESACTIVAR PROFESIONALES
app.post('/profesionalActivarDesactivar', async (req, res) => {
    var profesional_email = req.body.email;
    var estadoProfesional = req.body.estado;

    if (!estadoProfesional || !profesional_email) {
        res.status(400).send('Faltan parámetros: email y estado son obligatorios.');
        return;
    }
    
    aplicacion.profesionalActivarDesactivar(profesional_email,estadoProfesional);

  });

//ACTIVAR O CANCELAR TURNOS
app.post('/turnoAceptarCancelar', async (req, res) => {
    var paciente = req.body.paciente;
    var especialidad = req.body.especialidad;
    var dia = req.body.dia;
    var horario = req.body.horario;
    var profesional = req.body.profesional;
    var accion = req.body.accion;
    var resena = req.body.resena;
    
    aplicacion.turnoAceptarCancelar(paciente, especialidad, dia, horario, profesional, accion, resena);
  });

//ENCONTRAR TODOS LOS PROFESIONALES
app.post('/buscarTodosProfesionales', async (req, res) => {
    var estado = req.body.estado;
    try {
        let usuariosProfesionalesActivos = await buscarTodosProfesionales(estado);
        if (!usuariosProfesionalesActivos || usuariosProfesionalesActivos.lenght === 0) {
            res.status(404).send('Profesionales no encontrados.');
            return;
        }
  
        res.json(usuariosProfesionalesActivos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar profesionales.');
    }
});

//ENCONTRAR UN GERENTE POR EMAIL Y PASSWORD
app.post('/buscarGerente', async (req, res) => {
  var emailGerente = req.body.email;
  var passwordGerente = req.body.password;
  
  if (!emailGerente || !passwordGerente) {
      res.status(400).send('Faltan parámetros: email y password son obligatorios.');
      return;
  }

  try {
      let usuarioGerente = await buscarGerente(emailGerente, passwordGerente);
      if (!usuarioGerente || usuarioGerente.length === 0) {
          res.status(404).send('Usuario no encontrado.');
          return;
      }

      res.json(usuarioGerente);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al buscar el gerente.');
  }
});

//FUNCION PARA AGREGAR UN NUEVO TURNO
app.post('/insertarTurno', (req) =>{
    var datosTurno = req.body;
    aplicacion.insertarTurno(datosTurno);
})

//ENCONTRAR TODOS LOS TURNOS ACTIVOS
app.post('/buscarTodosTurnosActivos', async (req, res) => {
  
    try {
        let todosTurnosActivos = await buscarTodosTurnosActivos();
        if (!todosTurnosActivos || todosTurnosActivos.length === 0) {
            res.status(404).send('Turnos no encontrados.');
            return;
        }
        res.json(todosTurnosActivos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar turnos.');
    }
});

//ENCONTRAR UN TURNO ACTIVO POR EMAIL DEL PACIENTE
app.post('/buscarTurnosActivos', async (req, res) => {
    var emailPaciente = req.body.email;
    
    if (!emailPaciente) {
        res.status(400).send('Faltan parámetros: email es obligatorio.');
        return;
    }
  
    try {
        let turnosActivos = await buscarTurnosActivos(emailPaciente);
        if (!turnosActivos || turnosActivos.length === 0) {
            res.status(404).send('Turnos no encontrados.');
            return;
        }
        res.json(turnosActivos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar turnos.');
    }
});

//ENCONTRAR TURNOS FINALIZADOS POR EMAIL DEL PACIENTE
app.post('/buscarTurnosFinalizadosPaciente', async (req, res) => {
    var emailPaciente = req.body.email;
    
    if (!emailPaciente) {
        res.status(400).send('Faltan parámetros: email es obligatorio.');
        return;
    }
  
    try {
        let turnosFinalizados = await aplicacion.buscarTurnosFinalizadosPaciente(emailPaciente);
        if (!turnosFinalizados || turnosFinalizados.length === 0) {
            res.status(404).send('Turnos no encontrados.');
            return;
        }
        res.json(turnosFinalizados);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar turnos.');
    }
});

//ENCONTRAR UN TURNO ACTIVO POR PROFESIONAL
app.post('/buscarTurnosActivosPorProfesional', async (req, res) => {
    var profesional = req.body.profesional;
    
    if (!profesional) {
        res.status(400).send('Faltan parámetros: nombre y apellido del profesional es obligatorio.');
        return;
    }
  
    try {
        let turnosActivos = await aplicacion.buscarTurnosActivosPorProfesional(profesional);
        if (!turnosActivos || turnosActivos.length === 0) {
            res.status(404).send('Turnos no encontrados.');
            return;
        }
        res.json(turnosActivos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar turnos.');
    }
});

//ENCONTRAR TODOS LOS TURNOS
app.post('/buscarTurnosDisponibles', async (req, res) => {
    try {
        let turnosDisponibles = await buscarTurnosDisponibles();
        if (!turnosDisponibles || turnosDisponibles.length === 0) {
            res.status(404).send('Turnos no encontrados.');
            return;
        }
        res.json(turnosDisponibles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar turnos.');
    }
});

//CALIFICAR PROFESIONALES
app.post('/calificarProfesional', async (req, res) => {
    var turno = req.body.turno;
    var calificacion = req.body.calificacion;
    
    aplicacion.calificarProfesional(turno, calificacion);
  });

async function buscarTodosProfesionales(estado) {
    try {
        let profesionalesEncontrados = await aplicacion.buscarTodosProfesionales(estado);
        return profesionalesEncontrados;
    } catch (error) {
        console.error('Error al buscar profesionales:', error);
        throw error;
    }
}

async function buscarPaciente(emailPaciente, passwordPaciente) {
  try {
      let pacienteEncontrado = await aplicacion.buscarPaciente(emailPaciente, passwordPaciente);
      return pacienteEncontrado;
  } catch (error) {
      console.error('Error en buscarPaciente:', error);
      throw error;
  }
}

async function buscarProfesionalPorEmailyPass(emailProfesional, passwordProfesional) {
    try {
        let profesionalEncontrado = await aplicacion.buscarProfesional(emailProfesional, passwordProfesional);
        return profesionalEncontrado;
    } catch (error) {
        console.error('Error en buscarProfesional:', error);
        throw error;
    }
}

async function buscarProfesionalPorEstado(estadoProfesional) {
    try {
        let profesionalEncontrado = await aplicacion.buscarProfesionalPorEstado(estadoProfesional);
        return profesionalEncontrado;
    } catch (error) {
        console.error('Error en buscar Profesional:', error);
        throw error;
    }
  }

async function buscarGerente(emailGerente, passwordGerente) {
  try {
      let gerenteEncontrado = await aplicacion.buscarGerente(emailGerente, passwordGerente);
      return gerenteEncontrado;
  } catch (error) {
      console.error('Error en buscarGerente:', error);
      throw error;
  }
}

async function buscarTodosTurnosActivos() {
    try {
        let todosTurnosActivos = await aplicacion.buscarTodosTurnosActivos();
        return todosTurnosActivos;
    } catch (error) {
        console.error('Error al buscar turnos:', error);
        throw error;
    }
}

async function buscarTurnosActivos(emailPaciente) {
    try {
        let turnosEncontrados = await aplicacion.buscarTurnosActivos(emailPaciente);
        return turnosEncontrados;
    } catch (error) {
        console.error('Error al buscar turnos:', error);
        throw error;
    }
}

async function buscarTurnosDisponibles() {
    try {
        let turnosEncontrados = await aplicacion.buscarTurnosDisponibles();
        return turnosEncontrados;
    } catch (error) {
        console.error('Error al buscar turnos:', error);
        throw error;
    }
}
