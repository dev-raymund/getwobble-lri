<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /**
     * This allows the review to figure out if it belongs to a User or Product
     */
    public function reviewable()
    {
        return $this->morphTo();
    }

    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
