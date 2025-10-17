<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        @php
            $settings = \App\Models\Setting::get();
            $primaryColor = $settings->primary_color;

            // Calculate darker shade for hover states
            // Convert hex to RGB
            $r = hexdec(substr($primaryColor, 1, 2));
            $g = hexdec(substr($primaryColor, 3, 2));
            $b = hexdec(substr($primaryColor, 5, 2));

            // Darken by reducing each component by 20%
            $r = max(0, floor($r * 0.8));
            $g = max(0, floor($g * 0.8));
            $b = max(0, floor($b * 0.8));

            $primaryColorDark = sprintf("#%02x%02x%02x", $r, $g, $b);
        @endphp

        <style>
            :root {
                --primary-color: {{ $primaryColor }};
                --primary-color-dark: {{ $primaryColorDark }};
            }
        </style>
    </head>
    <body>
        @inertia
    </body>
</html>
