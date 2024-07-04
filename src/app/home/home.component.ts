import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
type Counter = {
  value: number;
};
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
  counter = signal<Counter>({
    value: 0
  });
  values = signal<number[]>([0]);

  increment(): void {
    this.counter.update(counter => ({
      ...counter,
      value: counter.value + 1
    }));
  }

  appendValue(): void {
    this.values.update(values => [...values, values.length]);
  }
}
