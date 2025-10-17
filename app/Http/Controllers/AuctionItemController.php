<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use App\Models\AuctionItemFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuctionItemController extends Controller
{
    /**
     * Display a listing of active auction items.
     */
    public function index()
    {
        $items = AuctionItem::with(['files', 'currentHighBid.user'])
            ->where('status', 'active')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('AuctionItems/Index', [
            'items' => $items,
        ]);
    }

    /**
     * Show the form for creating a new auction item.
     */
    public function create()
    {
        return Inertia::render('AuctionItems/Create');
    }

    /**
     * Store a newly created auction item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starting_bid' => ['required', 'numeric', 'min:0'],
            'minimum_bid_increment' => ['required', 'numeric', 'min:0.01'],
            'buy_now_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'auction_type' => ['required', 'in:silent,live'],
            'donor_id' => ['nullable', 'exists:users,id'],
            'donor_name' => ['required', 'string', 'max:255'],
            'is_donor_public' => ['boolean'],
            'status' => ['required', 'in:draft,active,closed,paid,cancelled'],
            'restrictions' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'files.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,pdf', 'max:10240'], // Max 10MB per file
        ]);

        $auctionItem = AuctionItem::create($validated);

        // Handle file uploads
        if ($request->hasFile('files')) {
            $isPrimary = true; // First uploaded file is primary

            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();

                // Store file in storage/app/public/auction-items
                $file->storeAs('auction-items', $fileName, 'public');

                AuctionItemFile::create([
                    'auction_item_id' => $auctionItem->id,
                    'file_name' => $fileName,
                    'original_file_name' => $originalName,
                    'content_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'is_primary' => $isPrimary,
                ]);

                $isPrimary = false; // Only first file is primary
            }
        }

        // Load the created item with relationships for the response
        $auctionItem->load(['files', 'bids', 'donor']);

        return response()->json([
            'success' => true,
            'message' => 'Auction item created successfully!',
            'item' => $auctionItem
        ]);
    }

    /**
     * Display the specified auction item.
     */
    public function show(string $id)
    {
        $item = AuctionItem::with(['files', 'bids.user'])
            ->findOrFail($id);

        return Inertia::render('AuctionItems/Show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified auction item.
     */
    public function edit(string $id)
    {
        $item = AuctionItem::with('files')->findOrFail($id);

        return Inertia::render('AuctionItems/Edit', [
            'item' => $item,
        ]);
    }

    /**
     * Update the specified auction item in storage.
     */
    public function update(Request $request, string $id)
    {
        $auctionItem = AuctionItem::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starting_bid' => ['required', 'numeric', 'min:0'],
            'minimum_bid_increment' => ['required', 'numeric', 'min:0.01'],
            'buy_now_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'auction_type' => ['required', 'in:silent,live'],
            'donor_id' => ['nullable', 'exists:users,id'],
            'donor_name' => ['required', 'string', 'max:255'],
            'is_donor_public' => ['boolean'],
            'status' => ['required', 'in:draft,active,closed,paid,cancelled'],
            'restrictions' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'files.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,pdf', 'max:10240'], // Max 10MB per file
            'remove_files' => ['nullable', 'array'],
            'remove_files.*' => ['integer', 'exists:auction_item_files,id'],
        ]);

        $auctionItem->update($validated);

        // Handle file removal
        if ($request->has('remove_files')) {
            foreach ($request->input('remove_files') as $fileId) {
                $file = AuctionItemFile::where('auction_item_id', $auctionItem->id)
                    ->findOrFail($fileId);

                // Delete from storage
                Storage::disk('public')->delete('auction-items/' . $file->file_name);

                // Delete from database
                $file->delete();
            }
        }

        // Handle new file uploads
        if ($request->hasFile('files')) {
            // Check if any files remain to determine if new upload should be primary
            $hasPrimaryFile = AuctionItemFile::where('auction_item_id', $auctionItem->id)
                ->where('is_primary', true)
                ->exists();

            $isPrimary = !$hasPrimaryFile;

            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();

                // Store file in storage/app/public/auction-items
                $file->storeAs('auction-items', $fileName, 'public');

                AuctionItemFile::create([
                    'auction_item_id' => $auctionItem->id,
                    'file_name' => $fileName,
                    'original_file_name' => $originalName,
                    'content_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'is_primary' => $isPrimary,
                ]);

                $isPrimary = false; // Only first file is primary
            }
        }

        // Load the updated item with relationships for the response
        $auctionItem->load(['files', 'bids', 'donor']);

        return response()->json([
            'success' => true,
            'message' => 'Auction item updated successfully!',
            'item' => $auctionItem
        ]);
    }

    /**
     * Remove the specified auction item from storage.
     */
    public function destroy(string $id)
    {
        $auctionItem = AuctionItem::with('files')->findOrFail($id);

        // Delete all associated files from storage
        foreach ($auctionItem->files as $file) {
            Storage::disk('public')->delete('auction-items/' . $file->file_name);
        }

        // Delete the auction item (cascade will handle bids and files in database)
        $auctionItem->delete();

        return redirect()->back()
            ->with('success', 'Auction item deleted successfully!');
    }
}
