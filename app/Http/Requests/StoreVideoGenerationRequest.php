<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVideoGenerationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'submit_video' => $this->boolean('submit_video', true),
            'audio' => $this->boolean('audio', false),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'video_type' => ['nullable', 'string', 'max:120'],
            'topic' => ['required', 'string', 'max:2000'],
            'keywords' => ['nullable', 'string', 'max:2000'],
            'target_audience' => ['nullable', 'string', 'max:255'],
            'tone' => ['nullable', 'string', 'max:120'],
            'duration' => ['nullable', 'string', 'max:120'],
            'prompt' => ['nullable', 'string', 'max:5000'],
            'submit_video' => ['boolean'],
            'name' => ['nullable', 'string', 'max:255'],
            'model' => [
                'nullable',
                'string',
                Rule::in([
                    'default',
                    'ltx-2',
                    'wan-2.2',
                    'seedance',
                    'seedance-2.0',
                    'kling-2.5',
                    'kling-3.0',
                    'veo3.1',
                    'veo3.1-lite',
                    'sora-2',
                ]),
            ],
            'resolution' => ['nullable', 'string', Rule::in(['480p', '720p', '1080p'])],
            'aspect_ratio' => ['nullable', 'string', Rule::in(['16:9', '9:16', '1:1'])],
            'audio' => ['boolean'],
        ];
    }
}
