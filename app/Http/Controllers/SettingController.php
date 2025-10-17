<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Update system settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'event_name' => ['required', 'string', 'max:255'],
            'event_location' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'auction_start' => ['nullable', 'date'],
            'auction_end' => ['nullable', 'date', 'after:auction_start'],
        ]);

        $settings = Setting::get();
        $settings->update($validated);

        return back()->with('success', 'Settings updated successfully.');
    }
}
