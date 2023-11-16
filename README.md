# Rendezvous Backend

> book travel easily with others

This is the backend to a [webapp](https://github.com/specificlanguage/Rendezvous) intended to work with travel with others, providing a little more information to coordinate travel between other users, whether for flights, and hotels. It's a bit of a work in progress and to me it's a little of ambitious side project I'm slowly working on over the past couple months. Eventually, this would be nice as a fully deployed app, but documentation for flight and hotel search and booking is [very cumbersome](https://amadeus4dev.github.io/developer-guides/resources/flights/#search-by-radius) and hard to come by, so development is pretty slow, unfortunately.

It's using primarily using Express, with Prisma, Amadeus, Duffel and Firebase used in various capacities. You may also want to checkout the [frontend repository](https://github.com/specificlanguage/Rendezvous)

### Building

1. Run `pnpm i` to install all items
2. Setup dependencies:
  2a. Setup a firebase app with authentication
  2b. Setup a database, fill out `DATABASE_URL` in `.env`, and run `prisma init`
  2c. Sign up for [Amadeus API](https://developers.amadeus.com/get-started/get-started-with-self-service-apis-335) (free) and [Duffel API](https://duffel.com/)
3. Fill out the rest of the fields in `.env` with fields similar to the `.env.example`
4. Run `pnpm dev` or `pnpm build`

**Please note that email integration & invites is located in [its own repository](https://github.com/specificlanguage/rendezvous-email-service), due to the use of React-Email.

### Todos:

- [x] Login/Trip creation
- [x] Display users from backend
- [ ] Create an import page to search flights
    - [x] Show flights
    - [ ] Correctly show the times for each time zone (it's only doing the local time zone to the user right now, which isn't good)
    - [ ] Allow user to select flight that will be imported
- [ ] Send email notifications about flights
- [ ] Write tests for all previous information
- [ ] (Phase 2) Flight & hotel booking
