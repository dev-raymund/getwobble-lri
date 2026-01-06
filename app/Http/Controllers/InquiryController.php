<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InquiryController extends Controller
{
    /**
     * Store an inquiry (simple handling: validate and log).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'message' => 'required|string|max:2000',
            'type' => 'required|string|in:therapist,vendor,general',
            'target_id' => 'nullable|integer',
        ]);

        // For now, log the inquiry so admins can review it. This is a simple placeholder
        // implementation; later we can persist to DB or send an email/notification.
        Log::info('New inquiry received via bookings page', $data);

        return redirect()->back()->with('success', 'Inquiry sent — we will contact you shortly.');
    }
}
