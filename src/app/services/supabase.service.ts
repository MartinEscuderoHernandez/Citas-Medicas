import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);
  constructor() {
  }

  async registerUser(data: any) { // Registra un nuevo usuario
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.contrasena, salt);

    const { error } = await this.supabase
      .from('pacientes')
      .insert([
        {
          nombre: data.nombre,
          apellidos: data.apellidos,
          cedula: data.cedula,
          telefono: data.telefono,
          correo: data.correo,
          contrasena: hashedPassword, // Contraseña encriptada
        }
      ]);

    if (error) {
      throw error;
    }
  }

  async loginUser(cedula: string, contrasena: string) { // Iniciar sesion de usuario
    const { data, error } = await this.supabase
      .from('pacientes')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (error) {
      throw error;
    }

    const isMatch = bcrypt.compareSync(contrasena, data.contrasena);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    return data.id_paciente; // Devuelve el id del usuario si todo es correcto
  }

  async logoutUser() {
    const { error } = await this.supabase.auth.signOut();  // Este método termina la sesión
    return { error };
  }

  async getPacienteByDocumento(cedula: string) {
    const { data, error } = await this.supabase
      .from('pacientes')
      .select('id_pacientes')
      .eq('cedula', cedula)
      .single();
    return { data, error };
  }

  async getDoctoresConHorariosDisponibles(especialidad: string): Promise<any> {
    // Primero obtenemos los horarios disponibles con el id_medico
    const { data: horarios, error: errorHorarios } = await this.supabase
      .from('horarios')
      .select('id_medico')
      .eq('disponible', true);
  
    if (errorHorarios) throw errorHorarios;
  
    // Extraemos solo los id_medico de los horarios disponibles
    const idMedicosDisponibles = horarios?.map((horarios) => horarios.id_medico) || [];
    console.log(idMedicosDisponibles)
  
    // Ahora usamos los id_medico disponibles para filtrar los doctores
    const { data: doctores, error: errorDoctores } = await this.supabase
      .from('medicos')
      .select('id_medico, nombre, apellidos')
      .eq('id_especialidad', especialidad)
      .in('id_medico', idMedicosDisponibles);
  
    if (errorDoctores) throw errorDoctores;
    return doctores;
  }

  async getMedicosByEspecialidad(especialidad: string) {
    const { data, error } = await this.supabase
      .from('medicos')
      .select('id_medico, nombre, apellidos')
      .eq('id_especialidad', especialidad);
    return { data, error };
  }
  
  async getFechasDisponiblesPorDoctor(idMedico: number): Promise<any> {
    // Obtenemos todas las fechas disponibles para el médico específico desde la fecha actual hacia adelante
    const { data, error } = await this.supabase
      .from('horarios')
      .select('fecha')
      .eq('id_medico', idMedico)
      .eq('disponible', true)
      .gte('fecha', new Date().toISOString())
      .order('fecha', { ascending: true });
  
    if (error) throw error;
  
    // Filtramos para que las fechas sean únicas
    const fechasUnicas = Array.from(new Set(data?.map(item => item.fecha))) || [];
    console.log(fechasUnicas)
    return fechasUnicas;
  }
  
  async getHorasDisponiblesPorFechaYDoctor(fecha: string, idMedico: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('horarios')
      .select('id_horario, hora_inicio, hora_fin')
      .eq('fecha', fecha)
      .eq('id_medico', idMedico)
      .eq('disponible', true);

    console.log(data)
    return {data, error};
  }

  async guardarCita(cita: any) {
    
    const { data: horarioDisponible, error: errorDisponibilidad } = await this.supabase
        .from('horarios')
        .select('id_horario')
        .eq('id_medico', cita.id_medico)
        .eq('fecha', cita.fecha)
        .eq('hora_inicio', cita.hora)
        .eq('disponible', true)
        .single(); // Devuelve un único registro si está disponible
    
    if (errorDisponibilidad || !horarioDisponible) {
        console.error("El horario ya está ocupado o hubo un error en la consulta.", errorDisponibilidad);
        return { success: false, message: "Horario no disponible." };
    }

    const { error: errorCita } = await this.supabase
      .from('citas')
      .insert([
        {
          id_paciente: cita.id_paciente,
          id_medico: cita.id_medico,
          id_horario: cita.id_horario,
          estado: 'agendada'
        }
      ])
      .select();
  
      if (errorCita) {
        console.error("Error al registrar la cita.", errorCita);
        return { success: false, message: "No se pudo agendar la cita." };
    }

    const { error: errorActualizarHorario } = await this.supabase
        .from('horarios')
        .update({ disponible: false })
        .eq('id_horario', horarioDisponible.id_horario);

    if (errorActualizarHorario) {
        console.error("Error al actualizar disponibilidad del horario.", errorActualizarHorario);
        return { success: false, message: "Error al actualizar el estado del horario." };
    }

    return { success: true, message: "Cita agendada correctamente." };
  }
  
}
