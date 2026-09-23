<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function designPosts()
    {
        return $this->hasMany(DesignPost::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }
}
