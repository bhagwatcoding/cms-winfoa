import { billCategories } from "./bill-validater"; // Import your data
import { Card } from "@/ui"; // Assuming shadcn card

export function BillCategoryGrid({ onSelect }: { onSelect: (id: string) => void }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {billCategories.map((cat) => {
                const Icon = cat.icon;

                return (
                    <Card
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className="cursor-pointer hover:border-primary transition-all p-4 flex flex-col items-center justify-center gap-3 text-center border-dashed"
                    >
                        {/* Dynamic Color Rendering */}
                        <div className={`p-3 rounded-full ${cat.color}`}>
                            <Icon size={24} />
                        </div>
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                            {cat.name}
                        </span>
                    </Card>
                );
            })}
        </div>
    );
}