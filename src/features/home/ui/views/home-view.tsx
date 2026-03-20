import { HomeCta } from '../components/home-cta';
import { HomeFeatures } from '../components/home-features';
import { HomeFooter } from '../components/home-footer';
import { HomeHero } from '../components/home-hero';
import { HomeNavbar } from '../components/home-navbar';

export const HomeView = () => {
	return (
		<div className="min-h-screen bg-background">
			<HomeNavbar />
			<HomeHero />
			<HomeFeatures />
			<HomeCta />
			<HomeFooter />
		</div>
	);
};
