
import { ShoppingBag, Sun, Moon } from 'lucide-react';
// import { useTheme } from 'next-themes'; // If you implement theme toggling
import { Button } from '@/components/ui/button'; // If you add theme toggle button

export function AppHeader() {
  // const { setTheme, theme } = useTheme(); // For theme toggling

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75 shadow-sm">
      <div className="container flex h-20 items-center justify-center"> {/* Changed justify-between to justify-center */}
        <div className="flex items-center group"> {/* Added group for coordinated hover effects */}
          <a href="/" className="flex items-center space-x-3 transition-opacity duration-300 ease-in-out group-hover:opacity-80">
            <ShoppingBag className="h-8 w-8 text-primary transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:text-accent" /> {/* Slightly larger icon, hover effect */}
            <span className="font-bold text-2xl sm:text-3xl tracking-tight transition-colors duration-300 ease-in-out group-hover:text-accent"> {/* Increased font size and tracking, hover effect */}
              ShelfSpot
            </span>
          </a>
        </div>
        {/* Placeholder for future elements like navigation or theme toggle 
        <nav className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>
        */}
      </div>
    </header>
  );
}

    
