# Tourist App (Frontend)

This project is the frontend for the "Pai Nai Dee" application, bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It allows users to discover tourist attractions, plan trips, and more.

## Tech Stack Overview

*   **React**: Core UI library.
*   **TypeScript**: For static typing and improved developer experience.
*   **Material-UI (MUI)**: UI component library for a consistent and modern look.
*   **React Router DOM**: For client-side routing.
*   **Axios**: For making HTTP requests to the backend API.
*   **ESLint**: For code linting to maintain code quality.
*   **Prettier**: For code formatting to ensure consistent style.

## Available Scripts

In the `tourist-app/` directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.
See the Create React App section on [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
For CI environments, tests are typically run with `npm test -- --watchAll=false`.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include hashes.
Your app is ready to be deployed!

### `npm run lint`

Runs ESLint to analyze the code for potential errors and style issues.
```bash
npm run lint
```

### `npm run format`

Formats the code using Prettier.
```bash
npm run format
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Environment Variables

The application uses environment variables for configuration, especially for connecting to the backend API.

1.  Create a `.env` file in the `tourist-app/` root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Modify the `.env` file with your specific configuration values.
    For example:
    ```env
    REACT_APP_BASE_API_URL=http://localhost:8000/api
    # REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    ```
    Variables must be prefixed with `REACT_APP_` to be embedded in the build by Create React App.

## Deployment

After building the application with `npm run build`, the `build/` directory will contain all the static assets for your application.

You can deploy this `build` folder to various static site hosting services, such as:

*   **Vercel**: Offers seamless deployment for React projects. Connect your Git repository for automatic deployments.
*   **Netlify**: Similar to Vercel, provides CI/CD and hosting for static sites.
*   **Firebase Hosting**: A good option if you're already using other Firebase services.
*   **AWS S3 & CloudFront**: For a more traditional cloud setup.
*   **GitHub Pages**: Suitable for simple projects and personal sites.

Ensure your hosting service is configured to serve `index.html` for all route requests if you are using client-side routing with React Router. This is often referred to as a "single-page application" (SPA) rewrite rule.

## Learn More

*   [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
*   [React documentation](https://reactjs.org/)
*   [Material-UI documentation](https://mui.com/material-ui/getting-started/)
*   [TypeScript documentation](https://www.typescriptlang.org/docs/)
