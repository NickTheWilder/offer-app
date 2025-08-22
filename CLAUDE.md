# Church Bazaar Auction Software - Development Agent

## Project Overview

You are assisting with the development of a church bazaar auction software MVP designed to compete with platforms like Give Smart and Greater Giving. The goal is to provide a cleaner, more intuitive interface with simplified workflows and better mobile experience.

### Frontend (You Are Here)

- **Repository**: [NickTheWilder/offer-app](https://github.com/NickTheWilder/offer-app)
- **Stack**: React 18 + TypeScript, Wouter routing, React Query, CSS Modules
- **Status**: MVP implemented with mock services, ready for backend integration

### Backend (In Development)

- **Repository**: [NickTheWilder/offer-api](https://github.com/NickTheWilder/offer-api)
- **Stack**: ASP.NET Core 8+ Web API, Hot Chocolate GraphQL, PostgreSQL + EF Core
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

### Item Management

- Required fields: name, starting bid, category
- Optional fields: description, image URL, buy-now price
- Status tracking throughout auction lifecycle
- Simple categorization and filtering

### Code Style Preferences

- Prioritize readability over micro-optimizations
- Include helpful comments where complexity exists
- Use senior-level React patterns and practices
- Maintain consistency with existing frontend C# models

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

## Available Data Models

### User

- **ID**: Guid
- **Fields**: userName, email, phone, address, bidderNumber, role (Admin/Bidder/Volunteer), isActive
- **Constraints**: Unique email and bidderNumber

### AuctionItem

- **ID**: Guid
- **Fields**: name, description, imageURL, startingBid, minimumBidIncrement, buyNowPrice, estimatedValue, category, auctionType (Silent/Live), donorName, isDonorPublic, status, restrictions
- **Financial**: All monetary fields use decimal(18,2) precision

## GraphQL Operations

### Queries (Available)

```graphql
# Get all users with filtering, sorting, projection
users: [User!]!

# Get all auction items with filtering, sorting, projection
auctionItems: [AuctionItem!]!
```

### Mutations (Available)

```graphql
# User management
createUser(input: CreateUserInput!): MutationResult<User>!
updateUser(input: UpdateUserInput!): MutationResult<User>!

# Auction item management
createAuctionItem(input: CreateAuctionItemInput!): MutationResult<AuctionItem>!
updateAuctionItem(input: UpdateAuctionItemInput!): MutationResult<AuctionItem>!
```

### Mutation Response Pattern

All mutations return `MutationResult<T>` with:

- **success**: boolean
- **data**: The created/updated entity (if successful)
- **errors**: Array of ValidationError objects with field and message

## Input Types

### CreateUserInput

- userName, email, phone, address, bidderNumber, password, role (required)

### UpdateUserInput

- id (required), plus optional: userName, email, phone, address, role, isActive

### CreateAuctionItemInput

- name, startingBid, category (required)
- Optional: description, imageURL, minimumBidIncrement, buyNowPrice, estimatedValue, auctionType, donorName, isDonorPublic, restrictions

### UpdateAuctionItemInput

- id (required), plus any optional AuctionItem fields

## Validation System

- Comprehensive field-level validation with descriptive error messages
- Unique constraint validation for email and bidderNumber
- Required field validation
- Format validation (email, decimal precision)

## What's Missing (Not Yet Implemented)

### Authentication

- No JWT token generation/validation
- No login/register endpoints
- No authorization middleware
- No password verification

### Bidding System

- No Bid entity or mutations
- No current bid tracking
- No bid history queries

### Real-time Features

- No GraphQL subscriptions
- No real-time bid notifications

### Production Features

- No CORS configuration
- No rate limiting
- No caching

## Database Configuration

- **Connection String**: Uses PostgreSQL on localhost:5432
- **Username**: postgres
- **Password**: **\*\***\*\*\*\***\*\***
- **Migration Status**: 4 migrations applied, schema is current

## Development Setup

- **Docker**: PostgreSQL container available via docker-compose
- **Hot Reload**: Enabled for development
- **Logging**: Detailed logging configured
- **Testing**: Comprehensive test suite with in-memory database

## Integration Notes

1. **Start with**: User and auction item management (fully functional)
2. **Authentication**: Will need to be implemented before user sessions
3. **Bidding**: Core auction functionality requires bid entity implementation
4. **Real-time**: Subscriptions needed for live bid updates
5. **CORS**: Must be configured for frontend requests
6. **Data Types**: C# models align with TypeScript interfaces in frontend

## Ready for Integration

- ✅ User CRUD operations
- ✅ Auction item CRUD operations
- ✅ GraphQL client setup
- ✅ Validation and error handling
- ✅ Database schema and migrations

## Requires Implementation

- ❌ Authentication system
- ❌ Bidding functionality
- ❌ Real-time subscriptions
- ❌ CORS configuration
- ❌ Authorization policies
