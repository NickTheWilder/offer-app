<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Show the user detail page.
     *
     * @param  mixed  $id
     * @return Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        // Load user's bids with auction item details
        $bids = $user->bids()
            ->with(['auctionItem.files'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($bid) {
                return [
                    'id' => $bid->id,
                    'amount' => $bid->amount,
                    'auction_item_id' => $bid->auction_item_id,
                    'auction_item_name' => $bid->auctionItem->name,
                    'auction_item' => $bid->auctionItem,
                    'created_at' => $bid->created_at,
                ];
            });

        return Inertia::render('Users/UserDetail', [
            'user' => $user,
            'bids' => $bids,
        ]);
    }

    /**
     * Update the user.
     *
     * @param  mixed  $id
     * @return RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'role' => ['required', 'in:admin,bidder'],
            'bidder_number' => ['nullable', 'string', 'max:20', 'unique:users,bidder_number'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Only update password if provided
        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Assign a new bidder number to the user.
     *
     * @param  mixed  $id
     * @return RedirectResponse
     */
    public function assignBidderNumber($id)
    {
        $user = User::findOrFail($id);

        DB::transaction(function () use ($user) {
            $maxBidderNumber = User::where('role', 'bidder')
                ->lockForUpdate()
                ->max('bidder_number');
            $nextBidderNumber = $maxBidderNumber ? (int) $maxBidderNumber + 1 : 1;

            $user->bidder_number = (string) $nextBidderNumber;
            $user->save();
        });

        return back()->with([
            'success' => 'Bidder number '.$user->bidder_number.' assigned successfully.',
            'nextBidderNumber' => $user->bidder_number,
        ]);
    }
}
