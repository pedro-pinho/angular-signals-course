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
import { catchError, from, throwError } from 'rxjs';
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
  beginnersList = viewChild('beginnersList', {
    read: ElementRef
  });

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    this.loadCourses();
    effect(() => {
      console.log('Beginner list:', this.beginnersList());
    });
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
