import { Search } from 'lucide-react'
import { Input } from "./input"

export function SearchBar() {
    return (
        <div className="relative ">
            <Search className="absolute left-3 top-5 -translate-y-1/2 h-[23px] w-[23px] text-muted-foreground" />
            <Input
                placeholder="Search Something....."
                className="pl-9 w-full h-[40px] max-w-[320px] bg-white"
            />
        </div>
    )
}

