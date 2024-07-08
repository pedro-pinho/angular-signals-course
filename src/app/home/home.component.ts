import {
  afterNextRender,
  Component,
  computed,
  effect,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, interval, startWith, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  coursesService = inject(CoursesService);
  dialog = inject(MatDialog);
  messageServices = inject(MessagesService);
  injector = inject(Injector);
  beginnersList = viewChild('beginnersList', {
    read: ElementRef,
  });

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  courses$ = from(this.coursesService.loadAllCourses());

  // toObservable can only be used withing an injection context such as a constructor, a factory function, a field initializer or a function used within runInjectionContext
  // Other way to avoid errors is to pass a second argument to the toObservable function, like this: injector = inject(Injector); toObservable(this.#courses, { injector: this.injector })
  // Internally, toObservable uses `effect` to subscribe to the signal and return its values over time

  toObservableExample() {
    // In this example, only the number 5 will be printed to the console
    const numbers = signal<number>(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);
    const numbers$ = toObservable(numbers, { injector: this.injector });
    numbers.set(4);
    numbers$.subscribe((number) => {
      console.log('Number:', number);
    });
    numbers.set(5);
  }

  toSignalExample() {
    const numbers$ = interval(1000).pipe(startWith(0));
    const numbers = toSignal(numbers$, {
      injector: this.injector, //this is to avoid memory leaks when the component gets destroyed, angular needs to clean this up
      requireSync: true, // this is to make sure that the signal is always in sync with the observable
    });
    effect(
      () => {
        console.log('Numbers:', numbers());
      },
      { injector: this.injector }
    );
  }

  toSignalsExampleWithError() {
    try {
      const courses$ = from(this.coursesService.loadAllCourses()).pipe(
        catchError((error) => {
          console.log('Error caught in the catchError', error);
          throw error;
        })
      );
      const courses = toSignal(courses$, {
        injector: this.injector,
      });
      effect(
        () => {
          console.log('Courses:', courses());
        },
        { injector: this.injector }
      );
    } catch (error) {
      console.log('Error in the catch block', error);
    }
  }

  constructor() {
    this.loadCourses();
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messageServices.showMessage('Failed to load courses', 'error');
      console.error(error);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(deletedCourseId: string) {
    const courses = this.#courses();
    const newCourses = courses.filter(
      (course) => course.id !== deletedCourseId
    );
    try {
      await this.coursesService.deleteCourse(deletedCourseId);
      this.messageServices.showMessage(
        'Course deleted successfully',
        'success'
      );
      this.#courses.set(newCourses);
    } catch (error) {
      this.messageServices.showMessage('Error deleting course', 'error');
      console.error(error);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create Course',
    });
    const courses = this.#courses();
    if (!newCourse) {
      return;
    }
    this.#courses.set([...courses, newCourse]);
  }
}
