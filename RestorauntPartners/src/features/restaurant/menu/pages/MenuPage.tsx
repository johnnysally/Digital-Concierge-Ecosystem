import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../../menu/services/menuService';

export default function MenuPage() {
  const { data } = useQuery({ queryKey: ['restaurant-menu'], queryFn: fetchMenu });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Menu Management</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage categories, meals, and featured promotions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.categories.map((category) => (
          <section key={category.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{category.name}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
            <div className="mt-4 space-y-3">
              {category.items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50">{item.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-900 dark:text-slate-50">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
