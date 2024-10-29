import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
    }, { 
      validator: this.checkPasswords
    });
  }

  // Valida que las contraseñas coincidan
  checkPasswords(group: FormGroup) {
    let pass = group.get('contrasena')?.value;
    let confirmPass = group.get('confirmarContrasena')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        await this.supabaseService.registerUser(this.registerForm.value);
        const alert = await this.alertController.create({
          header: 'Registro Exitoso',
          message: 'Tu cuenta ha sido creada con éxito.',
          buttons: ['OK']
        });
        await alert.present();
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al registrar el usuario. Por favor, intenta nuevamente.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
}
