import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>({
    alias: 'data',
  });
  courseUpdated = output<Course>();
  courseDeleted = output<string>();

  dialog = inject(MatDialog);

  courseCards = viewChildren('courseCard', {
    read: ElementRef,
  });

  async onEditCourse(course: Course) {
    const editedCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Edit Course',
      course: course,
    });
    if (!editedCourse) {
      return;
    }
    this.courseUpdated.emit(editedCourse);
  }

  onCourseDelete(course: Course) {
    const confirm = window.confirm(
      'Are you sure you want to delete the course?'
    );
    if (confirm) {
      this.courseDeleted.emit(course.id);
    }
  }
}
