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
        Schema::create('video_generations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->index()->constrained()->cascadeOnDelete();
            $table->string('video_type')->nullable()->index();
            $table->string('topic');
            $table->text('keywords')->nullable();
            $table->string('target_audience')->nullable();
            $table->string('tone')->nullable();
            $table->string('duration')->nullable();
            $table->longText('prompt')->nullable();

            $table->string('title')->nullable();
            $table->text('summary')->nullable();
            $table->longText('script')->nullable();
            $table->text('cta')->nullable();
            $table->json('scenes')->nullable();
            $table->longText('raw_ai_response')->nullable();

            $table->string('script_provider')->nullable()->index();
            $table->string('video_provider')->nullable()->index();
            $table->string('provider_project_id')->nullable()->unique();
            $table->string('provider_project_name')->nullable();
            $table->string('provider_project_type')->nullable();
            $table->string('provider_status')->nullable()->index();
            $table->timestamp('provider_created_at')->nullable();

            $table->longText('video_url')->nullable();
            $table->timestamp('video_url_expires_at')->nullable();
            $table->json('downloads')->nullable();
            $table->json('download')->nullable();

            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('fps')->nullable();
            $table->decimal('start_seconds', 8, 2)->nullable();
            $table->decimal('end_seconds', 8, 2)->nullable();
            $table->boolean('enabled')->default(true);

            $table->unsignedInteger('estimated_frame_cost')->nullable();
            $table->unsignedInteger('total_frame_cost')->nullable();
            $table->unsignedInteger('credits_charged')->nullable();

            $table->string('status')->default('draft')->index();
            $table->text('error_message')->nullable();

            $table->json('raw_video_submit_response')->nullable();
            $table->json('raw_video_project_response')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_generations');
    }
};
