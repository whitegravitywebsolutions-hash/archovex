<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignPostImage extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_mobile' => 'boolean',
    ];

    public function designPost()
    {
        return $this->belongsTo(DesignPost::class);
    }
}
