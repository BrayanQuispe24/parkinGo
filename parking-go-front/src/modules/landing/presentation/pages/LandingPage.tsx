import { Navbar } from '../components/Navbar';
import { Calculator } from '../components/Calculator';
import { InteractiveMap } from '../components/InteractiveMap';
import { FeaturedParkingsCarousel } from '../components/FeaturedParkingsCarousel.tsx';
import { AnimatedCarAssistant } from '../components/AnimatedCarAssistant';

// Nuevos componentes importados
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { MobileShowcaseSection } from '../components/MobileShowcaseSection';
import { ExploreParkingTypesSection } from '../components/ExploreParkingTypesSection';
import { CroquisSection } from '../components/CroquisSection';
import { RolesSection } from '../components/RolesSection';
import { PlansSection } from '../components/PlansSection';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { Footer } from '../components/Footer';

// Hooks
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useRoleTabs } from '../hooks/useRoleTabs';

export function LandingPage() {
    useScrollReveal();
    useRoleTabs();

    return (
        <>
            <div className="top-scroll-fade-overlay" id="top-scroll-fade"></div>
            <Navbar />

            <main>
                <HeroSection />
                <FeaturedParkingsCarousel />
                <HowItWorksSection />
                <MobileShowcaseSection />
                <ExploreParkingTypesSection />
                <CroquisSection />
                <InteractiveMap />
                <RolesSection />
                <Calculator />
                <PlansSection />
                <CtaBannerSection />
            </main>

            <Footer />
            <AnimatedCarAssistant />
        </>
    );
}
