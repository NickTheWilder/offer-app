import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

createInertiaApp({
    title: (title) => `${title} - Church Auction`,
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <TooltipProvider>
                <Toaster />
                <App {...props} />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
