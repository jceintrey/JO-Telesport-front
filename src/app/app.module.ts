
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoggerLevel, LoggerModule } from 'ngx-logger';
import { DetailsComponent } from './pages/details/details.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, DetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // autres modules
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,  // Différents niveaux de log ici (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
     // serverLogLevel: NgxLoggerLevel.ERROR,
      // serverLoggingUrl: 'http://localhost:8080' // Serveur NXlog
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
