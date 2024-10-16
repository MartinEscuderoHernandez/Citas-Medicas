import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.page.html',
  styleUrls: ['./cronograma.page.scss'],
})
export class CronogramaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToSelectDoctor() {
    this.router.navigate(['/select-doctor']);
  }

  // Navega a la página de selección de Fecha
  goToSelectDate() {
    this.router.navigate(['/select-date']);
  }

  // Navega a la página de selección de Hora
  goToSelectTime() {
    this.router.navigate(['/select-time']);
  }

  // Navega a la siguiente página cuando todo esté seleccionado
  goToNextPage() {
    // Agrega la lógica para validar si ya seleccionaron todo
    this.router.navigate(['/confirmar-cita']);
  }

}
