<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the auth page (login/register).
     */
    public function showLogin()
    {
        return Inertia::render('Auth/AuthPage');
    }

    /**
     * Handle login attempt.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Show the auth page (login/register).
     */
    public function showRegister()
    {
        return Inertia::render('Auth/AuthPage');
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        // Generate bidder number - find the highest existing bidder number and increment
        $lastBidderNumber = User::whereNotNull('bidder_number')
            ->orderByRaw('CAST(SUBSTRING(bidder_number, 2) AS UNSIGNED) DESC')
            ->value('bidder_number');

        if ($lastBidderNumber) {
            // Extract number from B0001 format and increment
            $number = intval(substr($lastBidderNumber, 1)) + 1;
        } else {
            // Start at 1 if no bidders exist
            $number = 1;
        }

        $bidderNumber = 'B' . str_pad($number, 4, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'bidder_number' => $bidderNumber,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'role' => 'bidder', // Default role for new registrations
        ]);

        Auth::login($user);

        return redirect('/')->with('success', 'Registration successful! Your bidder number is ' . $bidderNumber);
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'You have been logged out.');
    }
}
