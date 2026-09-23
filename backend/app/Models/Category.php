<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function designPosts()
    {
        return $this->hasMany(DesignPost::class)->orderBy('sort_order', 'asc');
    }
}
