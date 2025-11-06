<?php

use App\Http\Controllers\AuctionItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page - show active auction items
Route::get('/', function () {
    $items = \App\Models\AuctionItem::where('status', 'active')
        ->orderBy('display_order')
        ->with(['files', 'bids', 'donor'])
        ->get()
        ->map(function ($item) {
            // Add current_bid to each item (null if no bids)
            $highestBid = $item->bids->max('amount');
            $item->current_bid = $highestBid ?: null;

            return $item;
        });

    // Get user's bids with auction item data if logged in
    $userBids = null;
    if (Auth::check()) {
        $userBids = \App\Models\Bid::where('user_id', Auth::id())
            ->with(['auctionItem.files'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    return Inertia::render('Home', [
        'auctionItems' => $items,
        'userBids' => $userBids,
    ]);
})->middleware('auth');

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Public auction item routes
Route::get('/auction-items', [AuctionItemController::class, 'index'])->name('auction-items.index');
Route::get('/auction-items/{id}', [AuctionItemController::class, 'show'])->name('auction-items.show');

// Bid routes - require authentication
Route::middleware(['auth'])->group(function () {
    Route::post('/auction-items/{id}/bids', [BidController::class, 'store']);
    Route::get('/auction-items/{id}/bids', [BidController::class, 'index']);
    Route::get('/api/user/bids', [BidController::class, 'userBids']);
});

// Admin routes - require authentication and admin role
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('AdminPage');
    })->name('admin');

    Route::get('/admin/items', function () {
        $items = \App\Models\AuctionItem::with(['files', 'bids', 'donor'])
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        $users = \App\Models\User::all();

        return Inertia::render('ItemPage', [
            'auctionItems' => $items,
            'users' => $users,
        ]);
    })->name('admin.items');

    // API endpoints for lazy loading admin data
    Route::get('/api/admin/items', function () {
        $items = \App\Models\AuctionItem::with(['files', 'bids'])
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return response()->json($items);
    });

    Route::get('/api/admin/users', function () {
        $users = \App\Models\User::all();

        return response()->json($users);
    });

    Route::get('/api/admin/reports', function () {
        // For now, return empty array since we don't have reports yet
        return response()->json([]);
    });

    // Auction item management (except index and show which are public)
    Route::post('/auction-items', [AuctionItemController::class, 'store'])->name('auction-items.store');
    Route::get('/auction-items/{id}/edit', [AuctionItemController::class, 'edit'])->name('auction-items.edit');
    Route::put('/auction-items/{id}', [AuctionItemController::class, 'update'])->name('auction-items.update');
    Route::delete('/auction-items/{id}', [AuctionItemController::class, 'destroy'])->name('auction-items.destroy');
    Route::get('/auction-items/create', [AuctionItemController::class, 'create'])->name('auction-items.create');

    // User management
    Route::get('/admin/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
    Route::put('/admin/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::put('/admin/users/{id}/assign-bidder-number', [UserController::class, 'assignBidderNumber']);

    // Settings management
    Route::put('/admin/settings', [\App\Http\Controllers\SettingController::class, 'update'])->name('admin.settings.update');

});
