# SimpleChat

This app is, as the name says, a simple chat app. It includes the following set of features:

- Google Sign-in
- Chat creation by searching a Gmail account
- A chats summary that updates in real-time, sets its order accordingly to the last sent or received message, and highlighs messages that are not read.
- Sending and receiving text in real-time
- Sending and receiving images in real-time, from the photo gallery or camera.
- Full-screening sent or received images on touch

## Toolkit

For this project, some tools that are worth a mentioning are:

- [expo](https://expo.dev/) - for building, signing, etc.
- [typescript](https://www.typescriptlang.org/) - javascript superset
- [@react-native-google-signin/google-signin](https://github.com/react-native-google-signin/google-signin) - provides methods to sign in with google
- [@react-native-firebase/app](https://rnfirebase.io/) - facilitates access to various firebase features. On this project, the following packages were used - [auth](https://rnfirebase.io/auth/usage) (for google authentication), [firestore](https://rnfirebase.io/firestore/usage) (for document-based real-time database) and [storage](https://rnfirebase.io/storage/usage) (for images). Worth mentioning that each package is installed separately.
- [date-fns](https://date-fns.org/) - for dealing with dates
- [react-native-toast-message](https://github.com/calintamas/react-native-toast-message) - simple toast component used for error messages
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker) - for dealing with camera and gallery image retrieving.

## Project structure

This project is in `kebab-case`.
As usual standard practice, i put most of the source code inside a `src` folder. The `src` folder contains four folders

- `contexts` - contains data that is shared globally. In this case, it holds the authentication context, or `auth`;
- `routes` - contains the screens of the application.
- `ui` - has two folders that deals with UI stuff - `components` and `hooks`. Also contains the `themes` file for some global style.
- `utils` - some utility functions.

Also, some files worth mentioning at the root of the application

- `App.tsx` - entry point of the application, contains some providers and the Google Sign In setup function.
- `app.json` - expo main configuration file, contains build instructions
- `eas.json` - some expo eas setup
- `google-services.json` and `GoogleService-Info.plist`- firebase configuration files

### contexts

Contains the `auth` context. The `auth` folder has the following structure

- `index.tsx` - exports the context, and the provider with the auth functions
- `model.ts` - types file
- `strings.ts` - has some error strings

### routes

The app screens are here. Has 3 folders, to each a screen - `sign-in`, `chats` (for the chats summary) and `chat` (for an individual chat). And a `index.tsx` file with the routes config.

Most folders here go by the pattern, with or without some folder/file

- domain
  - `index.tsx` - takes care of business logic, navigation, etc.
  - `template.tsx` - takes care of jsx and design
  - `model.ts` - types file
  - `strings.ts` - self explanatory
  - `components folder` - specific components of the domain
  - `hooks folder` - specific hooks of the domain

### ui

The `ui` folder holds the UI `components`, `hooks` and `themes`. Only components used in more than 1 screen goes here, and usually have `index.tsx` and `model.ts` files, since there is no business logic being handled here.

The `hooks` folder has the `useStyle` hook, used to share styles throughout the whole app. And then, there is the `themes` file, that contains colors, spacings and fontSizes values, that are passed to the components and templates through the `useStyle` hook. Even though it was not done here, this makes it easy to create and change to other themes (which can also be done with styled-components, I am aware).

### utils

General utilites.

- `format-date.ts` - self explanatory, uses date-fns
- `place-values.ts` - used to insert values in strings files
- `show-error-toast.ts` - imperatively calls a method from the Toast component, to show error toasts
- `validate-email.ts` - a regex to validate e-mails

## How to build and run the project

- run `yarn` to install dependencies
- run `yarn prebuild` to generate android and ios folders, and install pods
- run `yarn start` to start metro bundler
- run `yarn ios` or `yarn android` to build the app

## Video

The video was too big to upload here, about 2 mins

Uploaded it to Youtube - https://youtu.be/PgyLd5zoeEQ
