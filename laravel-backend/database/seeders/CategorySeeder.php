<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Politics',
                'description' => 'Government, elections and public policy.',
                'img_url' => '/images/Politics.png',
                'sort_order' => 1,
            ],
            [
                'name' => 'Economy',
                'description' => 'Inflation, cost of living and financial news.',
                'img_url' => '/images/Economy.png',
                'sort_order' => 2,
            ],
            [
                'name' => 'Technology',
                'description' => 'AI, software and digital innovation.',
                'img_url' => '/images/Technology.png',
                'sort_order' => 3,
            ],
            [
                'name' => 'Crime',
                'description' => 'Police reports and public safety updates.',
                'img_url' => '/images/Crime.png',
                'sort_order' => 4,
            ],
            [
                'name' => 'Sports',
                'description' => 'Cricket and local and global sports.',
                'img_url' => '/images/Sports.png',
                'sort_order' => 5,
            ],
            [
                'name' => 'Culture',
                'description' => 'Arts, entertainment and cultural events.',
                'img_url' => '/images/Culture.png',
                'sort_order' => 6,
            ],
            [
                'name' => 'Health',
                'description' => 'Healthcare and public health updates.',
                'img_url' => '/images/Health.png',
                'sort_order' => 7,
            ],
            [
                'name' => 'Education',
                'description' => 'Schools, universities and education news.',
                'img_url' => '/images/Education.png',
                'sort_order' => 8,
            ],
            [
                'name' => 'Environment',
                'description' => 'Climate change, wildlife and environmental news.',
                'img_url' => '/images/Environment.png',
                'sort_order' => 9,
            ],
            [
                'name' => 'International',
                'description' => 'Global affairs and international developments.',
                'img_url' => '/images/International.png',
                'sort_order' => 10,
            ],
            [
                'name' => 'Public',
                'description' => 'Public services, transport and community news.',
                'img_url' => '/images/Public.png',
                'sort_order' => 11,
            ],
            [
                'name' => 'Weather',
                'description' => 'Weather forecasts and severe weather alerts.',
                'img_url' => '/images/Weather.png',
                'sort_order' => 12,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                [
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'img_url' => $category['img_url'],
                    'is_active' => true,
                    'sort_order' => $category['sort_order'],
                ]
            );
        }
    }
}