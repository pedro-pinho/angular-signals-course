import {afterNextRender, Component, computed, effect, EffectRef, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  //Advantages of using signals: Improved change detection, better performance, and more predictable behavior.
  counter = signal(0);
  effectRef: EffectRef | null = null;
  injector = inject(Injector);

  constructor() {
    //The best place to create effects is in the constructor of a component or service.
    //Effects are automatically cleaned up when the component or service is destroyed.
    //! Do not overuse effects, as they can make the code harder to understand.
    this.effectRef = effect((onCleanup) => {
      const counter = this.counter();
      const timeout = setTimeout(() => {
        console.log('Counter value:', counter);
      }, 2000);
      //Writing to signals is not allowed inside effects by default.
      // This is to prevent infinite loops and other side effects.
      // If write to a signal is an absolute must inside an effect, you can use allowSignalWrites: true.
      onCleanup(() => {
        console.log('Cleaning up effect');
        clearTimeout(timeout);
      });
    }, {
      allowSignalWrites: false
    });

    afterNextRender(() => {
      // If we need to define an effect that depends on a value that is not available when the component is created,
      // we can use afterNextRender, or on some other part of the code, to ensure that the effect is executed after the first render.
      // But then we need to use an injector to tell angular when to do the cleanup.
      effect(() => {
        console.log('Other counter value:', this.counter());
      }, {
        injector: this.injector
      });
    });
  }

  manualCleanUpEffect() {
    //If we need to manually clean up an effect, we can call the cleanup function that the effect returns.
    //This is useful when we need to clean up resources that are not automatically cleaned up by the framework.
    this.effectRef?.destroy();
  }

  increment(): void {
    this.counter.update(val => (val + 1));
  }
}
