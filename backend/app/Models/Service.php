<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'gallery' => 'array',
        'is_featured' => 'boolean',
        'price_from' => 'decimal:2',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
