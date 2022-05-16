# install React,ant, less and tailwind steps
## React
Install react typescript
```console
npx create-react-app . --template typescript
```
https://create-react-app.dev/docs/adding-typescript/

## tailwind
Install tailwind with postcss

```console
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

configure postcss with tailwind : create file postcss.config.js at the root of the project.
Add the following line in postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

configure tailwind : add the following in tailwind.config.js

```js
module.exports = {
  content: ["./src/**/*.{html,js,tsx}", './public/index.html'],
  theme: {
    extend: {

    },
  },
  plugins: [],
}
```

add tailwinds css in your file : create the file input.css, which are the entry point of the app css.
add the following lines in input.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
## ant
Install antd :
```console
npm install antd
```

import the css styles in input.css : add the following lines at the end of input.css

```css
@import '~antd/dist/antd.css';
```
https://tailwindcss.com/docs/installation/using-postcss

To modify theme of antd, we need to use less and modify webpack config.

## craco
Craco allow to modify webpack config of antd.

install craco :
```console
npm config set legacy-peer-deps true
npm install @craco/craco
```

use craco instead of react-scripts : In package.json, replace all react-scripts by 
Create the file craco.config.js at the root of the project and add the following lines inside.
```js
module.exports = {
  // ...
};
```
https://ant.design/docs/react/use-with-create-react-app

## less
To use less, we need the plugin craco craco-less :
```console
npm install craco-less
```

We need touse less file instead of css : modify the name of input.css to input.less, the import in app.tsx must ba adapted in input.less, and the import in input.less of antd must be adapted in @import '~antd/dist/antd.less';

we need to tell to craco to use craco-less : modify the file craco.config.js to the following

```js
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

```

the var to overwrite : https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less


https://ant.design/docs/react/use-with-create-react-app