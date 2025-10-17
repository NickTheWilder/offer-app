# Church Bazaar Auction Software - Development Agent

## Project Overview

You are assisting with the development of a church bazaar auction software MVP designed to compete with platforms like Give Smart and Greater Giving. The goal is to provide a clean and intuitive interface with simplified workflows and exceptional mobile experiences.

### Architecture

- **Repository**: [NickTheWilder/offer-app](https://github.com/NickTheWilder/offer-app)
- **Stack**: Laravel application using React and Inertia.js
- **Database**: SQLite Database

## MVP Feature Requirements

### Silent Auction System

- Real-time bidding interface
- Current high bid display
- Outbid notification system via GraphQL subscriptions
- Mobile-optimized bidding experience

### Admin Dashboard

- Complete auction item management interface
- Bid monitoring and oversight
- Basic reporting capabilities
- Payment tracking system

## Code Style Preferences

- Prioritize readability over micro-optimizations
- Include helpful comments where complexity exists
- Use senior-level Laravel & React patterns and practices

## Code Quality Preferences
- **Pass only the minimum required parameters to functions** - don't pass entire objects when only specific properties/methods are needed
- **Always run `bun lint` and `bun types` after making changes** - fix all errors and warnings before considering work complete. This is mandatory, not optional.
- **Use meaningful variable names** - avoid single-letter variables and descriptive names for functions and classes
- **Follow the DRY principle** - avoid repeating code and use abstractions where possible
