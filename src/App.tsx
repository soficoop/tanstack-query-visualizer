import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Silk from "@/components/Silk";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { MutationList } from "./components/mutation/MutationList";
import { StorageProvider } from "./components/providers/StorageProvider";
import { QueryList } from "./components/query/QueryList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: () => {
        return "";
      },
    },
    mutations: {
      // biome-ignore lint/suspicious/useAwait: this func is just a placeholder
      mutationFn: async () => {
        return "";
      },
    },
  },
});

function Section({
  children,
  rgb,
  rotation,
  speed,
  title,
}: React.ComponentProps<"div"> & {
  title: string;
  rgb: string;
  rotation: number;
  speed: number;
}) {
  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-start">
      {/* BG */}
      <div className="absolute top-0 left-0 -z-50 h-full w-full">
        <Silk
          color={rgb}
          noiseIntensity={0.8}
          rotation={rotation}
          scale={0.6}
          speed={speed}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute -z-40 h-full w-full"
        style={{
          background:
            "radial-gradient(circle,rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1)  70%)",
        }}
      />

      <h2 className="my-6 text-xl">{title}</h2>
      {children}
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StorageProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <main className="flex h-screen w-screen flex-col">
            <Header />
            <div className="flex flex-1 gap-4 px-4">
              <Section rgb="#1c71d8" rotation={2.1} speed={5} title="Queries">
                <QueryList />
              </Section>
              <Separator className="" orientation="vertical" />
              <Section rgb="#a51d2d" rotation={2.6} speed={4} title="Mutations">
                <MutationList />
              </Section>
            </div>
          </main>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </StorageProvider>
    </QueryClientProvider>
  );
}

export default App;
