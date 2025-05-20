<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy("order", "asc")->with("parent")->get(); // Eager load parent
        $parentCategories = Category::whereNull("parent_id")->orderBy("order", "asc")->get();

        return Inertia::render("Admin/Categories/Index", [
            "categories" => $categories,
            "parentCategories" => $parentCategories,
        ]);
    }

    public function create()
    {
        $parentCategories = Category::whereNull("parent_id")->orderBy("order", "asc")->get();

        return Inertia::render("Admin/Categories/Form", [
            "parentCategories" => $parentCategories, // Changed from 'categories' to 'parentCategories' for clarity
            "category" => null, // Pass null for create form
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:categories",
            "description" => "nullable|string",
            "parent_id" => "nullable|exists:categories,id",
            "is_active" => "boolean",
            "order" => "integer|min:0",
            "image_file" => "nullable|image|mimes:jpeg,png,gif|max:2048", // New field for actual file upload
        ]);

        $validatedData["is_active"] = $request->boolean("is_active");
        if (!isset($validatedData["order"])) {
            $maxOrder = Category::max("order") ?? 0;
            $validatedData["order"] = $maxOrder + 1;
        }

        $categoryDataToStore = collect($validatedData)->except(["image_file"])->all();

        if ($request->hasFile("image_file")) {
            $file = $request->file("image_file");
            $datePath = now()->format("Y/m/d");
            $randomName = Str::random(40) . "." . $file->getClientOriginalExtension();
            $baseFolder = "categories";
            $relativePath = $baseFolder . "/" . $datePath . "/" . $randomName;

            Storage::disk("public")->putFileAs($baseFolder . "/" . $datePath, $file, $randomName);
            $categoryDataToStore["image"] = $relativePath; // Store relative path
        }

        Category::create($categoryDataToStore);

        // Clear the categories cache to ensure the homepage shows the new category
        Cache::forget('active_categories');

        return redirect()->route("admin.categories.index")
            ->with("success", "Category created successfully.");
    }

    public function show(Category $category)
    {
        $category->load("parent", "children", "products");
        return Inertia::render("Admin/Categories/Show", ["category" => $category]);
    }

    public function edit(Category $category)
    {
        $parentCategories = Category::whereNull("parent_id")
            ->where("id", "!=", $category->id)
            ->orderBy("order", "asc")
            ->get();

        return Inertia::render("Admin/Categories/Form", [
            "category" => $category, // The existing category model will have the 'image' path
            "parentCategories" => $parentCategories,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:categories,slug," . $category->id,
            "description" => "nullable|string",
            "parent_id" => "nullable|exists:categories,id",
            "is_active" => "boolean",
            "order" => "integer|min:0",
            "image_file" => "nullable|image|mimes:jpeg,png,gif|max:2048", // For new image upload
            "remove_image" => "nullable|boolean" // To explicitly remove the image
        ]);

        if (isset($validatedData["parent_id"]) && $validatedData["parent_id"] == $category->id) {
            $validatedData["parent_id"] = null;
        }
        $validatedData["is_active"] = $request->boolean("is_active");

        $categoryDataToUpdate = collect($validatedData)->except(["image_file", "remove_image"])->all();

        if ($request->boolean("remove_image") && $category->image) {
            Storage::disk("public")->delete($category->image);
            $categoryDataToUpdate["image"] = null;
        }

        if ($request->hasFile("image_file")) {
            // Delete old image if it exists
            if ($category->image) {
                Storage::disk("public")->delete($category->image);
            }
            $file = $request->file("image_file");
            $datePath = now()->format("Y/m/d");
            $randomName = Str::random(40) . "." . $file->getClientOriginalExtension();
            $baseFolder = "categories";
            $relativePath = $baseFolder . "/" . $datePath . "/" . $randomName;

            Storage::disk("public")->putFileAs($baseFolder . "/" . $datePath, $file, $randomName);
            $categoryDataToUpdate["image"] = $relativePath;
        }

        $category->update($categoryDataToUpdate);

        // Clear the categories cache to ensure the homepage shows the updated category
        Cache::forget('active_categories');

        return redirect()->route("admin.categories.index")
            ->with("success", "Category updated successfully.");
    }

    // Removed uploadImage method as per requirements (FilePond UI only)

    public function destroy(Category $category)
    {
        if ($category->children()->count() > 0) {
            return back()->with("error", "Cannot delete category with subcategories.");
        }
        if ($category->products()->count() > 0) {
            return back()->with("error", "Cannot delete category with products.");
        }

        if ($category->image) {
            Storage::disk("public")->delete($category->image);
        }

        $category->delete();

        return redirect()->route("admin.categories.index")
            ->with("success", "Category deleted successfully.");
    }

    public function toggleis_active(Category $category)
    {
        $category->update(["is_active" => !$category->is_active]);

        // Clear the categories cache to ensure the homepage shows the updated status
        Cache::forget('active_categories');

        return back()->with("success", "Category status updated.");
    }

    public function reorder(Request $request)
    {
        $request->validate([
            "categories" => "required|array",
            "categories.*.id" => "required|exists:categories,id",
            "categories.*.order" => "required|integer|min:0",
        ]);

        foreach ($request->categories as $item) {
            Category::where("id", $item["id"])->update(["order" => $item["order"]]);
        }
        return response()->json(["success" => true]);
    }
}

