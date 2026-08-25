import type { ComponentProps } from "react";

import type { Book } from "#/data/catalog";
import { cn } from "#/lib/utils";

export type BookCoverProps = ComponentProps<"div"> & {
  book: Pick<Book, "title" | "author" | "genre">;
  tiny?: boolean;
};

export function BookCover({ book, tiny, className, ...props }: BookCoverProps) {
  return (
    <div
      className={cn(
        "book-cover relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-sm p-[10%] pl-[16%] text-white shadow-xl",
        tiny && "w-8 rounded-[2px] p-1 pl-1.5",
        className,
      )}
      style={{ backgroundColor: book.genre.color }}
      {...props}
    >
      <div className="book-spine" aria-hidden />
      <h2
        className={cn("relative text-sm font-bold leading-tight sm:text-lg", tiny && "text-[2px]")}
      >
        {book.title}
      </h2>
      <p className={cn("relative text-xs opacity-70", tiny && "text-[1px]")}>by {book.author}</p>
    </div>
  );
}
