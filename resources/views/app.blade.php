<!DOCTYPE html>
<html class="scroll-smooth size-screen font-modak">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    @routes
    @inertiaHead
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>

<body class="antialiased leading-none size-full ">
    @inertia
</body>

</html>