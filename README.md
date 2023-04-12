# Boilerplate

## Typescript + React + Remix + Prisma + React Native

Comes with user authentication included

- [React](https://github.com/facebook/react)
- [Prisma](https://www.prisma.io)
- [Remix](https://remix.run)
- Expo
- React Native
- TypeScript
- Postgres
- Tailwind
- ESLint
- Prettier
- Resend (emails)

& many more tasty treats

## Get Started

**Must have node and postgres installed and setup locally**

1. `npm i`
2. `createdb boilerplate`
3. `npm run db:migrate`

Make sure you have created a .env file in the api package with the right values, you can use .env.example as the template

## Development

`npm run build`
then
`npm run dev`

## Production

### Mailers

- Create a Resend account and set a RESEND_API_KEY environment variable in .env

### Deployment

We are using Fly.io

### Extra info

- [Remix Docs](https://remix.run/docs)
