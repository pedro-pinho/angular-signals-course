import {Component, effect, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../models/course.model";
import {EditCourseDialogData} from "./edit-course-dialog.data.model";
import {CoursesService} from "../services/courses.service";
import {LoadingIndicatorComponent} from "../loading/loading.component";
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../models/course-category.model";
import { firstValueFrom } from 'rxjs';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  courseService = inject(CoursesService);
  messageServices = inject(MessagesService);
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    iconUrl: [''],
  });
  category = signal<CourseCategory>("BEGINNER");

  constructor() {
    this.form.patchValue({
      title: this.data.course?.title,
      longDescription: this.data.course?.longDescription,
      iconUrl: this.data.course?.iconUrl,
    });
    this.category.set(this.data.course?.category ?? "BEGINNER");
  }

  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();
    if (this.data.mode === 'update') {
      await this.saveCourse(this.data.course!.id, courseProps);
    } else if (this.data?.mode === "create") {
      await this.createCourse(courseProps);
    }
  }

  async saveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updatedCourse = await this.courseService.saveCourse(courseId, changes);
      this.messageServices.showMessage('Course saved successfully.', 'success');
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      this.messageServices.showMessage('Error saving the course.', 'error');
      console.error(error);
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      const newCourse = await this.courseService.createCourse(course);
      this.messageServices.showMessage('Course created successfully.', 'success');
      this.dialogRef.close(newCourse);
    } catch (err) {
      console.error(err);
      this.messageServices.showMessage('Error creating the course.', 'error');
    }
  }

}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '400px';
  dialogConfig.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, dialogConfig).afterClosed();

  return firstValueFrom(close$);
}
