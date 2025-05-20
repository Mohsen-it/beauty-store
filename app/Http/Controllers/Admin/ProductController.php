<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage; // Assuming this model exists and has 'url' and 'product_id'
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['category','images'])   
            ->when($request->filled('search'), fn($q) => 
                $q->where(fn($query) => 
                    $query->where('name', 'like', "%{$request->search}%")
                          ->orWhere('description', 'like', "%{$request->search}%")
                          ->orWhere('slug', 'like', "%{$request->search}%")
                )
            )
            ->when($request->filled('category'), fn($q) => 
                $q->where('category_id', $request->category)
            )
            ->orderBy(
                $request->input('sort_field', 'created_at'), 
                $request->input('sort_direction', 'desc')
            )
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category', 'sort_field', 'sort_direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);
        
        $validatedData['featured'] = $request->boolean('featured');
        $validatedData['active'] = $request->boolean('active');

        $product = Product::create($validatedData);

        if ($request->hasFile('images')) {
            $imageFiles = $request->file('images');
            $request->validate([
                'images'   => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,gif|max:2048'
            ]);
            $this->saveUploadedImages($product, $imageFiles, 'products');
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => $product->load('category', 'images'),
        ]);
    }

    public function edit(Product $product)
    {
        // The original structure for 'product' data sent to the form:
        // It merges the product attributes and overwrites 'images' with an array of URL strings.
        // This is likely what the existing frontend form expects for FilePond initialization or display.
        return Inertia::render('Admin/Products/Form', [
            'product' => array_merge($product->load('images')->toArray(), [
                'images' => $product->images->pluck('url')->toArray(),
            ]),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
            'existing_images' => 'nullable|array', 
            'existing_images.*' => 'string', 
        ]);
        
        $productDataToUpdate = collect($validatedData)->except(['existing_images'])->all();
        $productDataToUpdate['featured'] = $request->boolean('featured');
        $productDataToUpdate['active'] = $request->boolean('active');
        
        $product->update($productDataToUpdate);

        $this->updateExistingImages($product, $request, 'products');

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $this->deleteAllAssociatedImages($product);
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function toggleFeatured(Product $product)
    {
        $product->update(['featured' => !$product->featured]);
        return back()->with('success', 'Product featured status updated.');
    }

   
    // This method was likely for FilePond server-side processing, which is to be avoided as per requirements.
    // The new approach handles images directly in store/update methods.
    // public function uploadImage(Request $request)
    // {
    //     $request->validate([
    //         'images' => 'required|image|max:2048',
    //     ]);
    //     $datePath = now()->format('Y/m/d');
    //     $randomName = Str::random(40) . '.' . $request->file('images')->getClientOriginalExtension();
    //     $path = $request->file('images')->storeAs('products/' . $datePath, $randomName, 'public');
    //     return response()->json(['url' => $path]);
    // }
    // public function uploadImage(Request $request)
    // {
    //     $request->validate([
    //         'images' => 'required|image|max:2048',
    //     ]);
        
    //     $path = $request->file('images')->store('public/products');
    //     $url = Storage::url($path);
        
    //     return response()->json(['url' => $url]);
    // }
    
    public function removeImage($id) 
    {
        $image = ProductImage::findOrFail($id);
        $this->deleteSingleImageFile($image->url);
        $image->delete();
        return response()->json(['success' => true]);
    }

    // ===== Helper Methods for Image Handling =====

    private function saveUploadedImages($model, array $imageFiles, string $baseFolder)
    {
        foreach ($imageFiles as $file) {
            $datePath = now()->format('Y/m/d');
            $randomName = Str::random(40) . '.' . $file->getClientOriginalExtension();
            
            // Define the directory path within the disk
            $directoryToStore = $baseFolder . '/' . $datePath;
            
            // Alternative: Use the storeAs method on the UploadedFile object
            // This method stores the file on the specified disk ('public')
            // in the given directory ($directoryToStore) with the specified name ($randomName).
            // It returns the path of the stored file relative to the disk's root.
            $storedPath = $file->storeAs($directoryToStore, $randomName, 'public');
            
            // The $storedPath is the relative path you want to save in the database.
            $model->images()->create(['url' => $storedPath]);
        }
        
    }
    
    private function updateExistingImages($model, Request $request, string $baseFolder)
    {
        $existingImagePathsToKeep = $request->input('existing_images', []);

        $currentImageModels = $model->images()->get(); // Fetch fresh from DB
        foreach ($currentImageModels as $imageModel) {
            if (!in_array($imageModel->url, $existingImagePathsToKeep)) {
                $this->deleteSingleImageFile($imageModel->url); 
                $imageModel->delete(); 
            }
        }

        if ($request->hasFile('images')) {
            $newImageFiles = $request->file('images');
            $request->validate([
                'images'   => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,gif|max:2048'
            ]);
            $this->saveUploadedImages($model, $newImageFiles, $baseFolder);
        }
    }

    private function deleteSingleImageFile($relativePath)
    {
        if (!empty($relativePath)) {
            Storage::disk('public')->delete($relativePath); 
        }
    }

    private function deleteAllAssociatedImages($model)
    {
        // Ensure images relation is loaded before accessing it, or query it.
        $imagesToDelete = $model->images()->get(); 

        foreach ($imagesToDelete as $imageModel) {
            $this->deleteSingleImageFile($imageModel->url);
            $imageModel->delete(); // This should also trigger any model events if defined
        }
    }
}

