
import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row md:justify-between">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with <Heart className="inline-block h-4 w-4 text-red-500 fill-red-500" /> by ShelfSpot Team.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ShelfSpot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
