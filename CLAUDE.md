# Church Bazaar Auction Software - Development Agent

## Project Overview

You are assisting with the development of a church bazaar auction software MVP designed to compete with platforms like Give Smart and Greater Giving. The goal is to provide a cleaner, more intuitive interface with simplified workflows and better mobile experience.

### Frontend (You Are Here)

- **Repository**: [NickTheWilder/offer-app](https://github.com/NickTheWilder/offer-app)
- **Stack**: See package.json
- **Status**: MVP implemented with mock services, ready for backend integration

### Backend (In Development)

- **Repository**: [NickTheWilder/offer-api](https://github.com/NickTheWilder/offer-api)
- **Stack**: ASP.NET Core Web API, Hot Chocolate GraphQL, PostgreSQL + EF Core
- **Authentication**: ASP.NET Core Identity with JWT
- **Status**: Initial setup phase

## MVP Feature Requirements

### Authentication & User Management

- JWT-based authentication system
- Role separation (admin vs bidder)
- Bidder number assignment for auction identification
- Registration with basic contact information

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

### Code Style Preferences

- Prioritize readability over micro-optimizations
- Include helpful comments where complexity exists
- Use senior-level React patterns and practices
- Maintain consistency with existing frontend C# models
- Avoid using `any` type - use proper TypeScript types and interfaces
- **Pass only the minimum required parameters to functions** - don't pass entire objects when only specific properties/methods are needed
- **Always run `bun lint` and `bun check` after making changes** - fix all errors and warnings before considering work complete. This is mandatory, not optional.

### Database Design

- Use Entity Framework Core with PostgreSQL
- Design for extensibility (AdditionalDetails fields)
- Implement proper indexing for auction queries
- Consider performance for real-time bidding scenarios

## Development Context

### Developer Profile

- Senior software engineer specializing in React and C#
- Limited server/homelab experience - may need infrastructure guidance
- Values learning deeply and making scalable decisions
- Prefers clear, maintainable code over complex optimizations

### Communication Style

- Keep responses informal but clear
- Explain technical details that could be confusing
- Challenge suggestions when there are better alternatives
- Provide reasoning for technical recommendations

# Offer API - Integration Specification

## Current API Status

This ASP.NET Core 9.0 Web API with Hot Chocolate GraphQL provides user and auction item management for a church bazaar auction platform. **Authentication and bidding functionality are not yet implemented.**

## GraphQL Endpoint

- **URL**: `https://localhost:5000/graphql`
- **Playground**: Available at the same URL for testing
- **Database**: PostgreSQL on localhost:5432

### Mutation Response Pattern

Mutations return entities directly. For accurate types and structure, reference `src/types/generated/graphql.ts`.

## Input Types

Reference `src/types/generated/graphql.ts` for all input types and their required/optional fields.
