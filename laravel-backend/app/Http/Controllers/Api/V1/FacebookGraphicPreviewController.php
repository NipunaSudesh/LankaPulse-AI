<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Services\FacebookGraphicGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class FacebookGraphicPreviewController extends Controller
{
    public function __construct(
        private FacebookGraphicGenerator $generator
    ) {}

    /**
     * Allow this preview only in local development.
     */
    private function ensureLocal(): void
    {
        abort_unless(app()->environment('local'), 404);
    }

    /**
     * Static test article based on the supplied Helakuru JSON.
     * This article is never saved to MySQL.
     */
    private function testArticle(): NewsArticle
    {
        $article = new NewsArticle();

        $article->forceFill([
            'id' => 124736,

            'title' => 'Cyberattack on Websites of 178 Leading Global Companies Including BBC, IKEA, and Air France',

            'title_si' => 'BBC, IKEA සහ Air France ඇතුළු ලොව ප්‍රධාන පෙළේ සමාගම් 178 ක වෙබ් අඩවිවලට සයිබර් ප්‍රහාරයක්',

            'summary' => 'Approximately 178 prominent websites worldwide have been affected by a cyberattack involving malicious JavaScript code injected into the Optimizely digital platform.',

            'summary_si' => 'Optimizely ඩිජිටල් වේදිකාවට හානිකර JavaScript කේත ඇතුළත් කිරීමෙන් ලොව ප්‍රකට වෙබ් අඩවි 178 කට පමණ සයිබර් ප්‍රහාරයක් එල්ල වී තිබේ.',

            'content' => 'Foreign media report that approximately 178 prominent websites worldwide have been subjected to a cyberattack after malicious JavaScript code was injected into the Optimizely digital platform. The attackers attempted to steal credit card numbers and cryptocurrency. Affected websites reportedly include Zoom, BBC, CNN, Salesforce, GitLab, IKEA, HSBC, Equifax, Air France-KLM, Ledger, and Peacock. Security researcher Scott Helme reported approximately USD 7,040 was credited to the attackers’ crypto wallets over about nine hours on November 16. Most affected websites have since removed the malicious code.',

            'content_si' => 'ලොව ප්‍රධාන පෙළේ සමාගම් භාවිත කරන Optimizely ඩිජිටල් වේදිකාවට හානිකර JavaScript කේත ඇතුළත් කිරීමෙන් වෙබ් අඩවි 178 කට පමණ සයිබර් ප්‍රහාරයක් එල්ල වී තිබේ. හැකර්වරුන් ණයපත් අංක සහ ක්‍රිප්ටෝ මුදල් සොරකම් කිරීමට උත්සාහ කර ඇති බව වාර්තා වේ. Zoom, BBC, CNN, Salesforce, GitLab, IKEA, HSBC, Equifax, Air France-KLM, Ledger සහ Peacock ඇතුළු වෙබ් අඩවි මෙම ලැයිස්තුවට ඇතුළත් වේ. ආරක්ෂක පර්යේෂක Scott Helme සඳහන් කළේ නොවැම්බර් 16 වැනිදා පැය නවයක පමණ කාලයක් තුළ ප්‍රහාරකයන්ගේ ක්‍රිප්ටෝ පසුම්බි වෙත ඇමෙරිකානු ඩොලර් 7,040 ක් පමණ බැර වූ බවයි. බලපෑමට ලක් වූ බොහෝ වෙබ් අඩවිවලින් හානිකර කේත ඉවත් කර ඇත.',

    'url' => 'https://www.helakuru.lk/esana/p/124736/',

'image_url' => 'https://helakuru.sgp1.cdn.digitaloceanspaces.com/esana/images/lib/cyber1-archived.jpg',

            'source_name' => 'Helakuru',

            'category' => 'Technology',

            'language' => 'si',

            'published_at' => Carbon::parse('2026-11-18 10:00:29'),
        ]);

        return $article;
    }

    /**
     * Display the live preview studio.
     */
    public function index()
    {
        $this->ensureLocal();

        $article = $this->testArticle();

        return view('facebook-graphic-preview', compact('article'));
    }

    /**
     * Generate and return the latest poster.
     */
    public function image()
    {
        $this->ensureLocal();

        $article = $this->testArticle();

        try {
            $path = $this->generator->generate($article);

            abort_unless(
                is_string($path) && file_exists($path),
                500,
                'Generated preview image was not found.'
            );

            return response()->file($path, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'no-store, no-cache, must-revalidate',
                'Pragma' => 'no-cache',
            ]);
        } catch (\Throwable $e) {
            Log::error('Facebook graphic preview failed', [
                'message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Return a version hash so the browser can detect code changes.
     */
    public function version(): JsonResponse
    {
        $this->ensureLocal();

        $generatorPath = app_path('Services/FacebookGraphicGenerator.php');

        abort_unless(file_exists($generatorPath), 500);

        return response()->json([
            'version' => hash_file('sha256', $generatorPath),
        ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
}
