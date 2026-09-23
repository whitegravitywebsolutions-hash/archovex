<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class AdminLeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with('city');

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")
                    ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json(['success' => true, 'data' => $leads]);
    }

    public function updateStatus(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:New,Contacted,Qualified,Converted,Closed',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json(['success' => true, 'message' => 'Lead updated successfully', 'data' => $lead]);
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Lead deleted successfully']);
    }
}
