
# Modern Angular With Signals Course

This repository contains the code of the [Modern Angular With Signals Course](https://angular-university.io/course/angular-signals-course).

This course repository is updated to Angular 18:

![Modern Angular With Signals](https://d3vigmphadbn9b.cloudfront.net/course-images/large-images/angular-signals-course.jpg)

## Installation pre-requisites

IMPORTANT: Please use Node 18 (Long Term Support version).

## Installing the Angular CLI

Start by doing a global installation of the Angular CLI:

    npm install -g @angular/cli

## Running the local backend server

In order to be able to provide more realistic examples, we will need in our playground a small REST API backend server.

We can start the sample application backend with the following command:

    npm run server

## To run the Frontend Server

To run the frontend part of our code, we will use the Angular CLI:

    npm start

You can also start the frontend application using the following command:

    ng serve

The application is visible in port 4200: [http://localhost:4200](http://localhost:4200)

## What did I learn doing this course?

Signals are a new reactive primitive introduced in Angular 18 that provide a way to handle reactivity in your Angular applications. They allow you to manage and react to state changes more efficiently compared to traditional methods like RxJS.

## Why Should Use Signals

1. Simplicity
Signals provide a simpler and more intuitive way to handle state changes compared to RxJS observables and other state management techniques.

2. Performance
Signals are designed to be highly performant. They minimize the amount of code that needs to re-run on state changes, leading to more efficient applications.

3. Fine-Grained Reactivity
Signals offer fine-grained reactivity, meaning that only the parts of your application that depend on a changed signal will re-run, reducing unnecessary computations.

4. Type Safety
Signals are fully type-safe, ensuring that you get type checking and auto-completion benefits in your development environment.

## Important Things to Keep in Mind

1. Immutable State
Signals encourage the use of immutable state. Instead of directly mutating objects or arrays, you should create new instances when updating state.

2. Single Source of Truth
Use signals as a single source of truth for your application's state. This makes it easier to reason about state changes and maintain consistency across your application.

3. Updating the DOM
Angular will only update the DOM when a signal changes and it's stable, meaning after the entire detection cycle has completed. Only then angular will trigger any computed signals or any dependent effects.
