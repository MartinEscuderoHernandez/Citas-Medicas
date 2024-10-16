import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-cita',
  templateUrl: './tipo-cita.page.html',
  styleUrls: ['./tipo-cita.page.scss'],
})
export class TipoCitaPage implements OnInit {

  selectedCita: string = '';

  constructor(private router: Router) { }

  goToNextPage() {
    // Aquí puedes pasar los datos a la siguiente página
    console.log('Tipo de cita seleccionada:', this.selectedCita);
    this.router.navigate(['/cronograma'], { queryParams: { cita: this.selectedCita } });
  }

  ngOnInit() {
  }

}
