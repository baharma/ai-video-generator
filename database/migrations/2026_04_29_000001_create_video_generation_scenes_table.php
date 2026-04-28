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
        Schema::create('video_generation_scenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_generation_id')->index()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('scene_number')->index();
            $table->string('duration')->nullable();
            $table->decimal('start_seconds', 8, 2)->nullable();
            $table->decimal('end_seconds', 8, 2)->nullable();
            $table->text('visual')->nullable();
            $table->text('voice_over')->nullable();
            $table->text('text_overlay')->nullable();
            $table->text('image_prompt')->nullable();
            $table->longText('image_url')->nullable();
            $table->longText('video_clip_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_generation_scenes');
    }
};
