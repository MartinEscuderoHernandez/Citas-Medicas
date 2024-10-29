import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./Pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tipo-cita',
    loadChildren: () => import('./Pages/tipo-cita/tipo-cita.module').then( m => m.TipoCitaPageModule)
  },
  {
    path: 'cronograma',
    loadChildren: () => import('./Pages/cronograma/cronograma.module').then( m => m.CronogramaPageModule)
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./Pages/confirmacion/confirmacion.module').then( m => m.ConfirmacionPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
