import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/Command";
import React from "react";
import { Button } from "../ui/Button";

interface GenreSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
}

export function GenreSelect({
  options,
  value,
  onValueChange,
}: GenreSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex justify-center items-center cursor-pointer space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            {"Current filter : " + value}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search genres..." />
            <CommandList>
              <CommandEmpty>No genres found.</CommandEmpty>
              {options.map((genre) => (
                <CommandItem
                  key={genre}
                  onSelect={() => {
                    onValueChange(genre);
                    setOpen(false);
                  }}
                >
                  {genre}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
