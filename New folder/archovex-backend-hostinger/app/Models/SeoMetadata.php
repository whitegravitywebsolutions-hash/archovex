<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $table = 'seo_metadata';
    protected $guarded = ['id'];

    protected $casts = [
        'json_ld' => 'array',
    ];
}
