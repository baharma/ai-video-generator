<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoGenerationScene extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_generation_id',
        'scene_number',
        'duration',
        'start_seconds',
        'end_seconds',
        'visual',
        'voice_over',
        'text_overlay',
        'image_prompt',
        'image_url',
        'video_clip_url',
        'metadata',
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
            'scene_number' => 'integer',
            'start_seconds' => 'decimal:2',
            'end_seconds' => 'decimal:2',
        ];
    }

    public function videoGeneration(): BelongsTo
    {
        return $this->belongsTo(VideoGeneration::class);
    }
}
