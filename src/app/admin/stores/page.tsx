import { requireAdmin } from "@/lib/permissions/authorize";
import { getStores } from "@/actions/admin/stores";
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
import { StoreActions } from "@/components/admin/store-actions";

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function AdminStoresPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const stores = await getStores(params.search, params.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stores</h1>
          <p className="text-muted-foreground">Manage all stores</p>
        </div>
        <Link href="/admin/stores/new">
          <Button className="bg-[#1565C0] hover:bg-[#0D47A1]">
            <Plus className="mr-1 h-4 w-4" />
            New Store
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Stores</CardTitle>
            <div className="flex gap-2">
              <form className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="search"
                    placeholder="Search stores..."
                    className="pl-8"
                    defaultValue={params.search}
                  />
                </div>
                <select
                  name="status"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={params.status ?? ""}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button type="submit" variant="outline" size="sm">
                  Filter
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No stores found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store._id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>
                      <div>
                        <p>{store.ownerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {store.ownerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{store.whatsappNumber}</TableCell>
                    <TableCell>
                      {new Date(store.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={store.isActive ? "default" : "secondary"}>
                        {store.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StoreActions storeId={store._id} isActive={store.isActive} />
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
