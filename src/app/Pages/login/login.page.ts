import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const userId = await this.supabaseService.loginUser(
          this.loginForm.value.cedula,
          this.loginForm.value.contrasena
        );
        const { data: pacienteData } = await this.supabaseService.getPacienteByDocumento(this.loginForm.value.cedula);
      if (pacienteData) {
        localStorage.setItem('id_paciente', pacienteData.id_pacientes);  // Guardar el ID del paciente en localStorage
        this.router.navigate(['/tipo-cita']);
      }
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error de autenticación',
          message: 'Número de documento o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
}
