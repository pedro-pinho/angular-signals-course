import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LessonsService } from '../services/lessons.service';
import { Lesson } from '../models/lesson.model';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';

@Component({
  selector: 'lessons',
  standalone: true,
  imports: [LessonDetailComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  mode = signal<'master' | 'detail'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  lessonsService = inject(LessonsService);

  searchInput = viewChild.required<ElementRef>('search');

  onSearch() {
    const query = this.searchInput()?.nativeElement.value;

  }

  onLessonSelected(lesson: Lesson) {

  }

  onCancel() {

  }

  onLessonUpdated(lesson: Lesson) {

  }
}
