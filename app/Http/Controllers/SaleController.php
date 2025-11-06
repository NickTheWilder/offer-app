<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    /**
     * Store a new sale.
     *
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'user_id' => ['required', 'exists:users,id'],
            'auction_item_id' => ['nullable', 'exists:auction_items,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'sale_source' => ['required', 'in:pre_sale,auction,raffle,day_of,other,underwriting'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
            'sale_date' => ['required', 'date'],
        ]);

        Sale::create($validated);

        return back()->with('success', 'Sale created successfully.');
    }

    /**
     * Delete a sale.
     *
     * @param  mixed  $id
     * @return RedirectResponse
     */
    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);

        $sale->delete();

        return back()->with('success', 'Sale deleted successfully.');
    }
}
