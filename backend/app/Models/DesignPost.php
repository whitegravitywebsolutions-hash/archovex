<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignPost extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_featured' => 'boolean',
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'published_at' => 'datetime',
        'category_ids' => 'array',
        'city_ids' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function images()
    {
        return $this->hasMany(DesignPostImage::class)->orderBy('sort_order', 'asc');
    }

    public function primaryImage()
    {
        return $this->hasOne(DesignPostImage::class)->where('is_primary', true)->withDefault(function ($instance, $parent) {
            return $parent->images()->first();
        });
    }

    public function features()
    {
        return $this->hasMany(DesignPostFeature::class)->orderBy('sort_order', 'asc');
    }

    public function specifications()
    {
        return $this->hasMany(DesignPostSpecification::class)->orderBy('sort_order', 'asc');
    }

    public function relatedPosts()
    {
        return $this->belongsToMany(
            DesignPost::class,
            'design_post_related',
            'design_post_id',
            'related_design_post_id'
        )->withPivot('sort_order')->orderBy('design_post_related.sort_order', 'asc');
    }
}
