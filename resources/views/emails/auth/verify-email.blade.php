@extends('emails.layouts.master')

@section('title', 'Verify Your Email Address')

@section('header', 'Verify Your Email Address')

@section('content')
    <p>Hello,</p>
    
    <p>Thank you for registering with {{ config('app.name') }}! Please verify your email address by clicking the button below.</p>
    
    <div class="order-details">
        <h3>Email Verification</h3>
        <p>Verifying your email address helps us ensure the security of your account and allows you to receive important notifications about your orders and account.</p>
        <p>This link will expire in {{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes.</p>
    </div>
    
    <a href="{{ $url }}" class="btn">Verify Email Address</a>
    
    <p class="mt-4 text-sm text-gray-600">If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:</p>
    <p class="text-xs text-gray-500 break-all">{{ $url }}</p>
    
    <p>If you did not create an account, no further action is required.</p>
@endsection
