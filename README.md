# messenger-react

An example mobile web app, with a simple "chat/conversation" functionality. This is more of a playground to try and get a good user experience on a mobile device with web technologies, mainly through animations and performance.

Built with:

- [React](http://facebook.github.io/react)
- [Zynga Scroller](https://github.com/zynga/scroller)
- Pete Hunt's [react-touch](https://github.com/petehunt/react-touch-lib)

**NOTE**: This is a work in progress.

## Objectives

### Features

- Use "fake" data, packaged with the app
- Log in by selecting one of the preset "users"
- View recent messages (all conversations), click on a message to go to conversation thread
- Use menu to select a conversation or create a new one by giving it a name
- View conversation thread and reply
- Log out through menu to select another "user"

(Subject to change, trying to get something simple enough to implement, but not too trivial.)

### Animations

- Pages slide in/out from right/left (use **Zynga Scroller** and **react-touch**)
- Hamburger menu slides in from right or drops down (use **Zynga Scroller** and **react-touch**)
- Messages fade in when added (use React **ReactCSSTransitionGroup**)
- Scrollable area for page content (either use `-webkit-overflow-scrolling: touch` so works on desktop too, or **Zynga Scroller/react-touch** but doesn't work on desktop as-is)

### Constraints

- Use animations to give a good responsive experience on mobile
- Optimize for performance on mobile
- Make it usable on desktop (but doesn't have to be optimized for desktop)
- Target iPhone 5, nice if works well on other devices but not a necessity

## Quick start

Clone this repo and install dependencies:

```bash
$ npm install
```

Start development server with:

```bash
$ npm run-script develop
```

Point your browser to `http://localhost:3000`.

## Build

To build the production version run:

```bash
$ npm run-script build
```

To test the production build, start the static server:

```bash
$ npm run-script server
```

Point your browser to `http://localhost:3000`.
