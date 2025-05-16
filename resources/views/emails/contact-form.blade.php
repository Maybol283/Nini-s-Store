@component('mail::message')
# New Message from {{ $data['name'] }}

**Email:** {{ $data['email'] }}

**Message:**
{{ $data['message'] }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent