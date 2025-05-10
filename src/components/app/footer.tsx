
import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="py-8 md:px-8 border-t border-border/60 bg-background/95 mt-12"> {/* Added mt-12 for spacing */}
      <div className="container flex flex-col items-center justify-center gap-5 md:h-28 md:flex-row md:justify-between">
        <p className="text-balance text-center text-base leading-relaxed text-muted-foreground md:text-left">
          Built with <Heart className="inline-block h-5 w-5 text-primary fill-primary/70 mx-1" /> by the ShelfSpot Team.
        </p>
        <p className="text-base text-muted-foreground">
          © {new Date().getFullYear()} ShelfSpot Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

    