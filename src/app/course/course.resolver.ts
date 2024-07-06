import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { inject } from '@angular/core';
import { Course } from '../models/course.model';

export const courseResolver: ResolveFn<Course | null> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // This is where you would fetch the course data from an API
  // and return it to the component
  const courseId = route.paramMap.get('id');
  if (!courseId) {
    return null;
  }
  const coursesService = inject(CoursesService);
  return coursesService.getCourse(courseId);
};
