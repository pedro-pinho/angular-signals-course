import { Component, inject, input, output } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { ReactiveFormsModule } from '@angular/forms';
import { LessonsService } from '../../services/lessons.service';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'lesson-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  lesson = input.required<Lesson | null>();
  lessonUpdated = output<Lesson>();
  cancel = output();

  lessonService = inject(LessonsService);
  messagesService = inject(MessagesService);

  async onSave(description: string) {
    try {
      const lesson = this.lesson();
      if (!lesson) {
        throw new Error('No lesson provided to save');
      }
      const updatedLesson = await this.lessonService.saveLesson(lesson.id, {
        description,
      });
      this.lessonUpdated.emit(updatedLesson);
    } catch (e) {
      this.messagesService.showMessage('Failed to save lesson', 'error');
      console.error(e);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
