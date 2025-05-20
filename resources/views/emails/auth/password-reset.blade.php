@extends('emails.layouts.master')

@section('title', 'Reset Your Password')

@section('header', 'Reset Your Password')

@section('content')
    <p>Hello,</p>
    
    <p>You are receiving this email because we received a password reset request for your account.</p>
    
    <div class="order-details">
        <h3>Password Reset Instructions</h3>
        <p>Click the button below to reset your password. This link will expire in {{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes.</p>
        <p>If you did not request a password reset, no further action is required.</p>
    </div>
    
    <a href="{{ $url }}" class="btn">Reset Password</a>
    
    <p class="mt-4 text-sm text-gray-600">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
    <p class="text-xs text-gray-500 break-all">{{ $url }}</p>
@endsection
