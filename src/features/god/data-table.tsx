"use client";

import { cn } from "@/utils";
import { Badge, Button, Input } from "@/ui";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    title?: string;
    description?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    className?: string;
    pageSize?: number;
}

export function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    title,
    description,
    searchable = true,
    searchPlaceholder = "Search...",
    onRowClick,
    emptyMessage = "No data found",
    className,
    pageSize = 10,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search
    const filteredData = data.filter((item) => {
        if (!search) return true;
        return Object.values(item as Record<string, unknown>).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    const getValue = (item: T, key: keyof T | string): unknown => {
        if (typeof key === "string" && key.includes(".")) {
            return key.split(".").reduce((acc: unknown, part) => {
                if (acc && typeof acc === "object") {
                    return (acc as Record<string, unknown>)[part];
                }
                return undefined;
            }, item);
        }
        return item[key as keyof T];
    };

    return (
        <div
            className={cn(
                "rounded-xl border bg-card/50 backdrop-blur-sm",
                className
            )}
        >
            {/* Header */}
            {(title || searchable) && (
                <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                    {title && (
                        <div>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                    )}

                    {searchable && (
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={cn(
                                        "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                                        column.className
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={item.id ?? index}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        "border-b transition-colors last:border-0",
                                        "hover:bg-muted/50",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className={cn("px-4 py-3 text-sm", column.className)}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : String(getValue(item, column.key) ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of{" "}
                        {filteredData.length}
                    </p>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-8 w-8"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let page: number;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "ghost"}
                                        size="icon"
                                        onClick={() => setCurrentPage(page)}
                                        className="h-8 w-8"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Badge helper for status columns
export function StatusBadge({
    status,
    variant,
}: {
    status: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
}) {
    const getVariant = () => {
        const s = status.toLowerCase();
        if (["active", "completed", "issued", "pass", "success"].includes(s)) return "default";
        if (["inactive", "dropped", "revoked", "fail", "failed"].includes(s)) return "destructive";
        if (["pending", "on-leave"].includes(s)) return "secondary";
        return variant ?? "outline";
    };

    return (
        <Badge variant={getVariant()} className="capitalize">
            {status}
        </Badge>
    );
}
