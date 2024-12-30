import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  [x: string]: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private logger: NGXLogger
  ) {}

  /**
   * Initialise les données du composants
   *
   * - charge les données du service
   * - s'abonne au service
   *
   */
  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }

  /**
   * Termine proprement lors de la destruction du composant.
   *
   * - Désabonne l'Observable.
   */
  ngOnDestroy(): void {
    this.logger.debug('Desctruction du composant');
    this.subscription.unsubscribe();
  }
}
