import github from "@/assets/github.png";
import ShinyText from "@/components/external/ShinyText";
import { useStorage } from "@/components/providers/StorageProvider";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header({ className }: React.ComponentProps<"header">) {
  const { reset, clear } = useStorage();

  return (
    <header className={cn("flex items-center border-b p-4", className)}>
      <div className="flex flex-1 gap-4">
        <Button onClick={clear} variant={"secondary"}>
          Clear
        </Button>
        <Button onClick={reset} variant={"secondary"}>
          Reset to default
        </Button>
      </div>
      <h1 className="flex-1 text-center text-2xl">
        <ShinyText
          color="#f9fafb" //primary-foreground
          delay={0}
          direction="left"
          disabled={false}
          pauseOnHover={false}
          shineColor="#5227ff" // primary
          speed={2}
          spread={120}
          text="Tanstack Query Visualizer"
          yoyo={false}
        />
      </h1>
      <div className="flex flex-1 flex-row-reverse">
        <a
          className="inline-block"
          href={GITHUB_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="github icon"
            className="invert"
            height={24}
            src={github}
            width={24}
          />
        </a>
      </div>
    </header>
  );
}
