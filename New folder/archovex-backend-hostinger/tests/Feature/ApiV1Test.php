<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\DesignPost;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiV1Test extends TestCase
{
    use RefreshDatabase;
    public function test_public_home_api_returns_success()
    {
        $response = $this->getJson('/api/v1/home');
        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_public_categories_api_returns_categories()
    {
        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'admin_test@archovex.com',
            'password' => bcrypt('password123'),
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin_test@archovex.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_protected_admin_routes_require_sanctum_auth()
    {
        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(401);
    }
}
