<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply role filter
        if ($request->has('role') && $request->role) {
            if ($request->role === 'admin') {
                $query->where('is_admin', true);
            } elseif ($request->role === 'customer') {
                $query->where('is_admin', false);
            }
        }
        
        // Get paginated results
        $users = $query->latest()->paginate(10)->withQueryString();
        
        // Available roles for filter dropdown
        $roles = ['admin', 'customer'];
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = ['admin', 'customer'];
        
        return Inertia::render('Admin/Users/Form', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'boolean',
            'active' => 'boolean',
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => $request->is_admin,
            'active' => $request->active,
        ]);
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $roles = ['admin', 'customer'];
        
        return Inertia::render('Admin/Users/Form', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => $request->password ? ['confirmed', Rules\Password::defaults()] : '',
            'is_admin' => 'boolean',
            'active' => 'boolean',
        ]);
        
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'is_admin' => $request->is_admin,
            'active' => $request->active,
        ];
        
        // Only update password if provided
        if ($request->password) {
            $userData['password'] = Hash::make($request->password);
        }
        
        $user->update($userData);
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Toggle active status of a user.
     */
    public function toggleActive(User $user)
    {
        // Prevent deactivating own account
        if (auth()->id() === $user->id) {
            return back()->withErrors(['toggle' => 'You cannot deactivate your own account.']);
        }
        
        $user->update([
            'active' => !$user->active,
        ]);
        
        return back()->with('success', 'User status updated.');
    }
    
    /**
     * Assign role to a user.
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,customer',
        ]);
        
        // Prevent removing admin role from own account
        if (auth()->id() === $user->id && $request->role === 'customer') {
            return back()->withErrors(['role' => 'You cannot remove admin role from your own account.']);
        }
        
        $user->update([
            'is_admin' => $request->role === 'admin',
        ]);
        
        return back()->with('success', 'User role updated.');
    }
}
