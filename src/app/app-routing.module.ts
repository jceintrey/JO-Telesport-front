import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailsComponent } from './pages/details/details.component';

const routes: Routes = [
    // Page d'accueil de l'application avec un Dashboard global
  {
    path: '',
    component: HomeComponent,
  },
    // Détails statistique pour un pays
  {
    path: 'details',
    component: DetailsComponent,
  },
      // Autres chemins
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
