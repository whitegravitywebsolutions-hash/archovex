<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignPostSpecification extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $guarded = ['id'];

    public function designPost()
    {
        return $this->belongsTo(DesignPost::class);
    }
}
