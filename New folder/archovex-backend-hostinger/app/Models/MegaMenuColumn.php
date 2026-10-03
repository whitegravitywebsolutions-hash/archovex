<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MegaMenuColumn extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function items()
    {
        return $this->hasMany(MegaMenuItem::class)->orderBy('sort_order', 'asc');
    }
}
