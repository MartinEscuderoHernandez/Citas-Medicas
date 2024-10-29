import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {

  doctorNombre: string ="";
  doctorApellidos: string ="";
  fecha: any;
  hora: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.doctorNombre = params['doctorNombre'];
      this.doctorApellidos = params['doctorApellidos'];
      this.fecha = params['fecha'];
      this.hora = params['hora'];
    });
  }
}
