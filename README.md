# Offer Auction

A modern, user-friendly auction platform designed for church bazaars and fundraising events. Built with Laravel, Inertia.js, React, and TypeScript.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.3
- **Frontend**: React 19, TypeScript 5.7, Inertia.js 2.0
- **Database**: SQLite
- **Package Manager**: Bun
- **Additional**: Laravel Wayfinder for type-safe routes

## Getting Started

### Prerequisites

- **PHP 8.2+** [https://www.php.net/manual/en/install.php](https://www.php.net/manual/en/install.php)
- **Composer** - [getcomposer.org](https://getcomposer.org/)
- **Bun** - [https://bun.sh/docs/installation](https://bun.sh/docs/installation)

### Installation

1. **Install dependencies**

```bash
bun install
composer install
```

2. **Set up environment**

```bash
php artisan key:generate
```

4. **Run migrations and seed the database**

```bash
php artisan migrate
php artisan db:seed  # Optional: adds sample data
```

### Running the Application

Start both the Laravel server and Vite dev server with a single command:

```bash
composer run dev
```

Then visit: **http://localhost:8000**

## Resetting Demo Data

To completely reset your database and demo data (useful during development):

```bash
# Wipe and rebuild everything with fresh seed data
php artisan migrate:fresh --seed
```

This will:
- Drop all database tables
- Run all migrations
- Seed users (admin + bidders)
- Seed auction items with images from `database/seeders/images/`

**Note**: Images are copied from `database/seeders/images/` to `storage/app/public/auction-items/` during seeding, so you can reset as many times as needed without losing your seed images.

## Test Credentials

The database is seeded with the following accounts for testing:

### Admin Account

- **Email**: `admin@example.com`
- **Password**: `password`
- **Role**: Admin

### Bidder Accounts

All bidder accounts use the password: `password`

| Email                 | Bidder Number | Name           |
| --------------------- | ------------- | -------------- |
| `john@example.com`    | 1         | John Doe       |
| `jane@example.com`    | 2         | Jane Smith     |
| `bob@example.com`     | 3         | Bob Johnson    |
| `alice@example.com`   | 4         | Alice Williams |
| `charlie@example.com` | 5         | Charlie Brown  |
