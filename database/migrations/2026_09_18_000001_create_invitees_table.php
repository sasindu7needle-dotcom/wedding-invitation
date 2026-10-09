<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->boolean('is_admin')->default(false));
        Schema::create('invitees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->string('email')->nullable();
            $table->string('phone', 40)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('visited_at')->nullable();
            $table->unsignedBigInteger('visit_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitees');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_admin'));
    }
};
