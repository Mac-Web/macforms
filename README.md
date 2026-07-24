# [MacForms](https://macforms.macweb.app)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)

MacForms, an app under the [MacWeb](https://macweb.app) collection of online apps, is a simple form creation tool with a ton of features while still being easy to use.

## Features

- Form creation
- Cross domain auth using the main MacWeb auth & account system
- More coming soon!

## Tech stack

This is a [Next.js](https://nextjs.org) app hosted on [Vercel](https://vercel.com) and [Neon](https://neon.com), built with [React](https://react.dev), [TypeScript](https://typescriptlang.org), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), and [Tailwind](https://tailwindcss.com), and the libraries [Better Auth](https://www.better-auth.com), [Framer Motion](https://motion.dev), and [React Icons](https://react-icons.github.io). The app folder contains the frontend page routes and the backend API endpoints. The components folder contains frontend layout and UI components. The prisma folder contains the Prisma schema, and the lib and types folders contain extra stuff for data processing and dependency setup. Finally, the public folder contains frontend assets like icons and logos.

## Development

1. Clone the repo `git clone https://github.com/Mac-Web/macforms.git`
2. Create a `.env` file with the following variabls:

```
DATABASE_URL=YOUR_DATABASE_URL
BETTER_AUTH_URL="http://macforms.macweb.com:3001"
BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET
NEXT_PUBLIC_ROOT_DOMAIN="http://macweb.com:3000"
```

3. Edit your computer's `hosts` files (`/etc/hosts` for Linux) to point `127.0.0.1` to the local `macweb.com` domain to simulate cross domain locally
4. Make sure you've cloned and set up the root MacWeb repo by following its [README](https://github.com/Mac-Web/macweb-next/blob/main/README.md) as well
5. Run `npm install` to install the necessary dependencies for the app
6. In the MacWeb root folder, run `npm run dev -- -p 3000` to get the auth server running at `macweb.com:3000`
7. In the MacForms folder, run `npm run dev -- -p 3001` to get the app running at `macforms.macweb.com:3001`
8. Go to `https://macforms.macweb.com:3001` and ignore the browser's warning (since it uses a self-signed certificate to enforce https), and MacForms should be working properly on your local setup!

## Contribution

Any kind of contribution is welcome (but why?), but please follow the guideline below!

- Submit an issue if there's a bug/issue or if you want to suggest new features/subscriptions to be added.
- Submit a pull request if you want to add or improve the code base!
- Commit messages should be specific and address the issue
- Please don't submit random issues that aren't specific
- Please don't submit pull requests that "fix typo" or "improve formatting"
