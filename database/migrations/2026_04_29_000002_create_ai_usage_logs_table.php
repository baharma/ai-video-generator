<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index()->constrained()->nullOnDelete();
            $table->foreignId('video_generation_id')->nullable()->index()->constrained()->nullOnDelete();

            $table->string('provider')->index();
            $table->string('action')->index();
            $table->string('model')->nullable();
            $table->string('endpoint')->nullable();
            $table->string('http_method')->nullable();
            $table->unsignedInteger('http_status')->nullable()->index();
            $table->boolean('success')->default(false)->index();

            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->text('error_message')->nullable();

            $table->unsignedInteger('prompt_token_count')->nullable();
            $table->unsignedInteger('candidates_token_count')->nullable();
            $table->unsignedInteger('total_token_count')->nullable();
            $table->unsignedInteger('thoughts_token_count')->nullable();

            $table->unsignedInteger('estimated_frame_cost')->nullable();
            $table->unsignedInteger('total_frame_cost')->nullable();
            $table->unsignedInteger('credits_charged')->nullable();

            $table->unsignedInteger('duration_ms')->nullable();

            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
    }
};
