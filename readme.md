## Guide to Learning Redux

Redux is a library for state management on single page applications. In a complex SPA with many different sources of data flowing left and right, you'll probably be asking yourself *where* you should store data. For instance:
- Where do I keep track of UI state? whether this modal is open? whether user selected "light" vs "dark" theme?
- If multiple components need access to the same source of data, where should I keep the data? As a property on the parent component? or as a property on a service?

Redux's approach is to keep state in a single place, called a `store`, which can be accessed from anywhere in your SPA. It's not located on any individual component, and is most similar to having an Angular service dedicated purely to UI state. Although Redux was initially made for React, Angular has its own implementation of Redux called `ngrx/store`.

In learning how to use `ngrx/store`, it's very important to understand the philosophy behind the original Redux and how it actually works. For a true understanding of Redux's approach, I'd recommend starting out with the [free video tutorials](https://egghead.io/courses/getting-started-with-redux) on Egghead from Dan Abramov (creator of redux). The key is to understand what the `store` is, how to functionally alter state (immutable data, never any mutation), and what `actions` and `reducers` are.

Once you're familiar with how redux itself works, check out `ngrx/store` [intro](https://gist.github.com/btroncone/a6e4347326749f938510), [docs](https://github.com/ngrx/store) and an [egghead.io video tutorial](https://egghead.io/courses/build-redux-style-applications-with-angular-rxjs-and-ngrx-store) on how to create an Angular2 app using `ngrx/store` and RxJs. Once you're done with that, check out an [example app](https://github.com/ngrx/example-app) that actually uses `ngrx/store`. Feel free to structure your app after that example one!

#### Additional Reading
One big question you'll have after learning `ngrx/store` is how we manage side-effects like HTTP requests. For this, read up on [`ngrx/effects`](https://github.com/ngrx/effects), refer back to the [example app](https://github.com/ngrx/example-app), and *make sure you understand Observables*.

===

## Introduction to `ngrx/store` in Angular2

Where do we keep track of state in an Angular2 application? There are probablly three approaches to this.

#### 1. On Closest Relevant Component

The immediately obvious approach is to keep things on components themselves. For example, if we had a 


#### 2. On a Service, mutating

#### 3. On a Service [using RxJs](https://medium.com/front-end-developers/managing-state-in-angular-2-using-rxjs-b849d6bbd5a5)

#### 4. Redux/`ngrx/store`

In Redux, the `store` is the UI's immutable state. Events trigger `actions`, which in turn manipulate the `store` through `reducers`.