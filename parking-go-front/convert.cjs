const fs = require('fs');

let html = fs.readFileSync('PrototipoLandingPage/index.html', 'utf8');

// Extract everything between <header> and <footer> inclusive
let match = html.match(/<header[\s\S]*<\/footer>/i);
if (!match) {
    console.log('Could not find header/footer');
    process.exit(1);
}

let jsx = match[0];

// Remove all HTML comments
jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

// Replace class= with className=
jsx = jsx.replace(/class=/g, 'className=');

// Replace onclick= with onClick= (mocked)
jsx = jsx.replace(/onclick="[^"]*"/g, 'onClick={() => {}}');

// Replace for= with htmlFor=
jsx = jsx.replace(/for=/g, 'htmlFor=');

// Replace style="color: #ffffff;..." with style={{color: '#ffffff', ...}}
jsx = jsx.replace(/style="([^"]*)"/g, (match, styles) => {
    let objStr = styles.split(';').filter(s => s.trim()).map(s => {
        let [key, val] = s.split(':');
        if (!key || !val) return '';
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        return `${key}: '${val.trim()}'`;
    }).join(', ');
    return `style={{${objStr}}}`;
});

// Close void tags
jsx = jsx.replace(/<img([^>]*?)>/g, (m, p1) => p1.endsWith('/') ? m : `<img${p1}/>`);
jsx = jsx.replace(/<br([^>]*?)>/g, (m, p1) => p1.endsWith('/') ? m : `<br${p1}/>`);
jsx = jsx.replace(/<hr([^>]*?)>/g, (m, p1) => p1.endsWith('/') ? m : `<hr${p1}/>`);
jsx = jsx.replace(/<input([^>]*?)>/g, (m, p1) => p1.endsWith('/') ? m : `<input${p1}/>`);

// Fix SVG path fill
jsx = jsx.replace(/fill-rule/g, 'fillRule');
jsx = jsx.replace(/clip-rule/g, 'clipRule');
jsx = jsx.replace(/preserveAspectRatio/g, 'preserveAspectRatio');

// Replace the sections with my React Components
// Replace Map Section
jsx = jsx.replace(/<section className="section map-section" id="mapa-envivo">[\s\S]*?<\/section>/, '<InteractiveMap />');
// Replace Carousel Section
jsx = jsx.replace(/<section className="category-bar-section reveal-up">[\s\S]*?<\/section>\s*<section className="section listing-grid-section" id="explorar">[\s\S]*?<\/section>/, '<FeaturedParkingsCarousel />');
// Replace Calculator Section
jsx = jsx.replace(/<section className="section earning-calculator-section" id="calculadora">[\s\S]*?<\/section>/, '<Calculator />');

const componentStr = `
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Calculator } from '../components/Calculator';
import { InteractiveMap } from '../components/InteractiveMap';
import { FeaturedParkingsCarousel } from '../components/FeaturedParkingsCarousel';

export function useScrollReveal() {
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
        if (!revealElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}

export function LandingPage() {
    useScrollReveal();

    return (
        <>
            <div className="top-scroll-fade-overlay" id="top-scroll-fade"></div>
            ${jsx}
        </>
    );
}
`;

fs.writeFileSync('src/modules/landing/presentation/pages/LandingPage.tsx', componentStr);
console.log('Done!');
