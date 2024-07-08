import {Component, contentChild, effect, ElementRef, model} from '@angular/core';
import {CourseCategory} from "../models/course-category.model";

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {
  value = model.required<CourseCategory>(); //Two way binding

  title = contentChild.required<ElementRef>('title'); //Content projection

  onCategoryChange(category: string) {
    this.value.set(category as CourseCategory);
  }
}
