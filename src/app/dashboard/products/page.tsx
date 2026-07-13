import { requireShopOwner } from "@/lib/permissions/authorize";
import { getProducts } from "@/actions/dashboard/products";
import { getCategories } from "@/actions/dashboard/categories";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { ProductActions } from "@/components/dashboard/product-actions";

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  await requireShopOwner();
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.category, params.search),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products (max 25)
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-[#1565C0] hover:bg-[#0D47A1]">
            <Plus className="mr-1 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Products ({products.length}/25)</CardTitle>
            <form className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search products..."
                  className="pl-8"
                  defaultValue={params.search}
                />
              </div>
              <select
                name="category"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={params.category ?? "all"}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline" size="sm">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No products found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.productCode && (
                            <p className="text-xs text-muted-foreground">
                              {product.productCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>
                      <div>
                        {product.offerPrice ? (
                          <>
                            <span className="font-medium">
                              Rs. {product.offerPrice.toLocaleString("en-LK")}
                            </span>
                            <span className="ml-1 text-xs text-muted-foreground line-through">
                              Rs. {product.regularPrice.toLocaleString("en-LK")}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">
                            Rs. {product.regularPrice.toLocaleString("en-LK")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ProductActions
                        productId={product._id}
                        isActive={product.isActive}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
