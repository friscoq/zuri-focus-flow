import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import Preview from "@/components/Preview";
import Waitlist from "@/components/Waitlist";
import AccessibilityToggle from "@/components/AccessibilityToggle";
import FAQDrawer from "@/components/FAQDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AccessibilityToggle />
      
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <Preview />
        <Waitlist />
      </main>

      <FAQDrawer />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-text-subtle text-sm">
            Made with understanding for minds that think differently
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
