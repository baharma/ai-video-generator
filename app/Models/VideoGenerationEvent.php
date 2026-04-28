<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoGenerationEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_generation_id',
        'user_id',
        'event_type',
        'from_status',
        'to_status',
        'message',
        'metadata',
        'raw_payload',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'raw_payload' => 'array',
        ];
    }

    public function videoGeneration(): BelongsTo
    {
        return $this->belongsTo(VideoGeneration::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
