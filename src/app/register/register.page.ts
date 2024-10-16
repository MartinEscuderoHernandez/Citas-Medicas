import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Formulario enviado');
    // Aquí puedes agregar la lógica para procesar el formulario
  }

}
