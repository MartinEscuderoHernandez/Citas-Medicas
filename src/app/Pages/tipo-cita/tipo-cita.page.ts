import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController} from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-tipo-cita',
  templateUrl: './tipo-cita.page.html',
  styleUrls: ['./tipo-cita.page.scss'],
})
export class TipoCitaPage {

  especialidad: string = '';

  constructor(private platform: Platform, 
    private alertController: AlertController, 
    private router: Router,
    private supabaseService: SupabaseService) { }

    ionViewDidEnter() {
      // Detectar el botón "Atrás" o gesto de retroceso
      this.platform.backButton.subscribeWithPriority(10, async () => {
        await this.mostrarAlertaCerrarSesion();
      });
    }


    async logout() {
      try {
        const { error } = await this.supabaseService.logoutUser();  // Llama al método de cierre de sesión
        if (error) {
          console.error('Error cerrando sesión:', error.message);
        } else {
          console.log('Sesión cerrada correctamente');
          this.router.navigate(['/login']);  // Redirige a la página de login
        }
      } catch (error) {
        console.error('Error cerrando sesión:', error);
      }
    }

  async mostrarAlertaCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            // Aquí puedes agregar la lógica para cerrar sesión
            localStorage.removeItem('id_paciente')
            this.logout()
          }
        }
      ]
    });

    await alert.present();
  }

  goToNextPage() {
    // Aquí puedes pasar los datos a la siguiente página
    console.log('Tipo de cita seleccionada:', this.especialidad);
    this.router.navigate(['/cronograma'], { queryParams: { especialidad: this.especialidad } });
  }

}
