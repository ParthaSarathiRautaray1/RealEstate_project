import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ defaultQuery = "", defaultType = "" }: { defaultQuery?: string; defaultType?: string }) {
  return (
    <form action="/properties" className="glass grid gap-3 rounded-lg p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_180px_160px]">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input name="q" defaultValue={defaultQuery} placeholder="Search city, neighborhood, or property" className="pl-9" />
      </div>
      <select name="type" defaultValue={defaultType} className="h-10 rounded-md border bg-background px-3 text-sm">
        <option value="">All types</option>
        <option value="Villa">Villa</option>
        <option value="Penthouse">Penthouse</option>
        <option value="Apartment">Apartment</option>
        <option value="Townhouse">Townhouse</option>
      </select>
      <Button type="submit">Search</Button>
    </form>
  );
}
