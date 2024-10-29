import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.page.html',
  styleUrls: ['./cronograma.page.scss'],
})
export class CronogramaPage implements OnInit{
  especialidad: string="";
  doctorNombre: string ="";
  doctorApellidos: string="";

  doctores: any[] = [];
  fechas: any[] = [];
  horas: any[] = [];
  idHorario: any;

  selectedDoctor: any;
  selectedFecha: any;
  selectedHora: any;

  constructor(private router: Router, 
    private alertController: AlertController, 
    private route: ActivatedRoute,
    private supabaseService: SupabaseService) {
      this.route.queryParams.subscribe(params => {
        this.especialidad = params['especialidad'];
        console.log(this.especialidad)
      });
    }

    ngOnInit() {
      this.cargarDoctores();
    }

    async cargarDoctores() {
      // Cargar doctores con horarios disponibles según la especialidad seleccionada
      const { data: doctores } = await this.supabaseService.getMedicosByEspecialidad(this.especialidad);
      this.doctores = doctores || [];
    }

    async cargarFechasDisponibles() {
      // Cargar fechas disponibles según el doctor seleccionado y su disponibilidad
      const fechas = await this.supabaseService.getFechasDisponiblesPorDoctor(this.selectedDoctor.id_medico);
      this.fechas = fechas || [];
      console.log(fechas)
    }

    async cargarHorasDisponibles() {
      // Cargar horas disponibles según la fecha seleccionada y el doctor
      const { data: horas } = await this.supabaseService.getHorasDisponiblesPorFechaYDoctor(this.selectedFecha, this.selectedDoctor.id_medico);
      this.horas = horas || [];
      
  
      // Guardar el id del horario al seleccionar la hora
      this.idHorario = this.horas.length ? this.horas[0].id_horario : null;
      console.log(this.idHorario)
    }
  

  async guardarSeleccion() {
    if (this.selectedDoctor && this.selectedFecha && this.selectedHora) {
      const id_paciente = localStorage.getItem('id_paciente');
      this.doctorNombre = this.selectedDoctor.nombre;
      this.doctorApellidos = this.selectedDoctor.apellidos;
      const alert = await this.alertController.create({
        header: 'Confirmar Cita',
        message: `¿Confirmas la cita con ${this.selectedDoctor} el ${this.selectedFecha} a las ${this.selectedHora}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cita cancelada');
            },
          },
          {
            text: 'Confirmar',
            handler: async () => {
              // Aquí puedes manejar la lógica de guardar en la base de datos
              console.log(id_paciente, this.selectedDoctor.id_medico, this.idHorario)
              const cita = {
                id_paciente: id_paciente,
                id_medico: this.selectedDoctor.id_medico,   // Verifica que estés pasando el ID del médico
                id_horario: this.idHorario,            // Verifica el formato de la hora (HH:mm:ss)
                fecha: this.selectedFecha,
                hora: this.selectedHora.hora_inicio
              };
              const { success } = await this.supabaseService.guardarCita(cita);
              if (!success) {
                console.error('Error al guardar la cita:', success);
              } else {
                console.log(this.doctorNombre, this.doctorApellidos)
                console.log(`Cita confirmada con ${this.doctorNombre} ${this.doctorApellidos} el ${this.selectedFecha} a las ${this.selectedHora.hora_inicio}`);
              this.router.navigate(['/confirmacion'], {
                queryParams: {
                  doctorNombre: this.doctorNombre,
                  doctorApellidos: this.doctorApellidos,
                  fecha: this.selectedFecha,
                  hora: this.selectedHora.hora_inicio,
                },
              });
              }
            }
          },
        ]
      });

      await alert.present();
    } else {
      const alertWarning = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los datos antes de continuar',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cita cancelada');
            },
          }
        ]
      });

      await alertWarning.present();
    }
  }
}
