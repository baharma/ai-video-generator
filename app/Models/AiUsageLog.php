<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiUsageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'video_generation_id',
        'provider',
        'action',
        'model',
        'endpoint',
        'http_method',
        'http_status',
        'success',
        'request_payload',
        'response_payload',
        'error_message',
        'prompt_token_count',
        'candidates_token_count',
        'total_token_count',
        'thoughts_token_count',
        'estimated_frame_cost',
        'total_frame_cost',
        'credits_charged',
        'duration_ms',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'request_payload' => 'array',
            'response_payload' => 'array',
            'success' => 'boolean',
            'prompt_token_count' => 'integer',
            'candidates_token_count' => 'integer',
            'total_token_count' => 'integer',
            'thoughts_token_count' => 'integer',
            'estimated_frame_cost' => 'integer',
            'total_frame_cost' => 'integer',
            'credits_charged' => 'integer',
            'duration_ms' => 'integer',
            'http_status' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function videoGeneration(): BelongsTo
    {
        return $this->belongsTo(VideoGeneration::class);
    }

    public function isSuccessful(): bool
    {
        return $this->success === true;
    }

    public function isFailed(): bool
    {
        return !$this->isSuccessful();
    }

    public function usedCredits(): int
    {
        return (int) ($this->credits_charged ?? 0);
    }
}
