<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitee extends Model
{
    protected $fillable = ['name', 'email', 'phone'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'visited_at' => 'datetime', 'visit_count' => 'integer'];
    }

    public function getRouteKeyName(): string
    {
        return 'token';
    }

    public function getStatusAttribute(): string
    {
        return ! $this->is_active ? 'Inactive' : ($this->visited_at ? 'Viewed' : 'Unopened');
    }
}
