<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VideoGeneration extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'video_type',
        'topic',
        'keywords',
        'target_audience',
        'tone',
        'duration',
        'prompt',
        'title',
        'summary',
        'script',
        'cta',
        'scenes',
        'raw_ai_response',
        'script_provider',
        'video_provider',
        'provider_project_id',
        'provider_project_name',
        'provider_project_type',
        'provider_status',
        'provider_created_at',
        'video_url',
        'video_url_expires_at',
        'downloads',
        'download',
        'width',
        'height',
        'fps',
        'start_seconds',
        'end_seconds',
        'enabled',
        'estimated_frame_cost',
        'total_frame_cost',
        'credits_charged',
        'status',
        'error_message',
        'raw_video_submit_response',
        'raw_video_project_response',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scenes' => 'array',
            'downloads' => 'array',
            'download' => 'array',
            'raw_video_submit_response' => 'array',
            'raw_video_project_response' => 'array',
            'enabled' => 'boolean',
            'provider_created_at' => 'datetime',
            'video_url_expires_at' => 'datetime',
            'width' => 'integer',
            'height' => 'integer',
            'fps' => 'integer',
            'estimated_frame_cost' => 'integer',
            'total_frame_cost' => 'integer',
            'credits_charged' => 'integer',
            'start_seconds' => 'decimal:2',
            'end_seconds' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scenes(): HasMany
    {
        return $this->hasMany(VideoGenerationScene::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(AiUsageLog::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(VideoGenerationEvent::class);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isGeneratingScript(): bool
    {
        return $this->status === 'generating_script';
    }

    public function isScriptGenerated(): bool
    {
        return $this->status === 'script_generated';
    }

    public function isVideoSubmitted(): bool
    {
        return $this->status === 'video_submitted';
    }

    public function isVideoProcessing(): bool
    {
        return $this->status === 'video_processing';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function hasVideo(): bool
    {
        return !empty($this->video_url);
    }

    public function hasProviderProject(): bool
    {
        return !empty($this->provider_project_id);
    }

    public function isVideoUrlExpired(): bool
    {
        return $this->video_url_expires_at && now()->greaterThan($this->video_url_expires_at);
    }
}
