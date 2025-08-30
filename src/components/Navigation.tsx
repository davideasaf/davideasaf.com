import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";
import { Brain, Code2, Home, Mail, Menu, User, X } from "lucide-react";
import { type ComponentType, type SVGProps, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const sectionIds = ["hero", "about", "projects", "neural-notes", "contact"];
	const activeSection = useActiveSection(sectionIds, 100);

	const goHome = () => {
		if (location.pathname !== "/") {
			navigate("/");
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		setIsOpen(false);
	};

	const goToHash = (sectionId: string) => {
		if (location.pathname !== "/") {
			navigate(`/#${sectionId}`);
		} else {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			} else {
				// Fallback: update hash to trigger ScrollToHash in App
				window.location.hash = sectionId;
			}
		}
		setIsOpen(false);
	};

	type IconType = ComponentType<SVGProps<SVGSVGElement>>;
	type NavItem =
		| { id: string; label: string; icon: IconType; type: "hash" }
		| { id: string; label: string; icon: IconType; type: "link"; path: string };

	const navItems: NavItem[] = [
		{ id: "hero", label: "Home", icon: Home, type: "hash" },
		{ id: "about", label: "About", icon: User, type: "hash" },
		{ id: "projects", label: "Projects", icon: Code2, type: "hash" },
		{ id: "neural-notes", label: "Neural Notes", icon: Brain, type: "hash" },
		{ id: "contact", label: "Contact", icon: Mail, type: "hash" },
	];

	return (
		<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<button
						type="button"
						onClick={goHome}
						className="flex items-center focus:outline-none"
					>
						<Brain className="h-8 w-8 text-primary mr-2" />
						<span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							AI Engineer
						</span>
					</button>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => {
							const isActive =
								item.type === "hash"
									? activeSection === item.id
									: location.pathname === item.path;

							return item.type === "link" ? (
								<Link
									key={item.id}
									to={item.path}
									className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
										isActive ? "text-primary" : "text-muted-foreground"
									}`}
								>
									<item.icon className="h-4 w-4" />
									<span>{item.label}</span>
								</Link>
							) : (
								<button
									type="button"
									key={item.id}
									onClick={() => goToHash(item.id)}
									className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
										isActive ? "text-primary" : "text-muted-foreground"
									}`}
								>
									<item.icon className="h-4 w-4" />
									<span>{item.label}</span>
								</button>
							);
						})}
						<Button
							variant="glow"
							size="sm"
							onClick={() => goToHash("contact")}
						>
							Let's Connect
						</Button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden pb-4">
						<div className="flex flex-col space-y-2">
							{navItems.map((item) => {
								const isActive =
									item.type === "hash"
										? activeSection === item.id
										: location.pathname === item.path;

								return item.type === "link" ? (
									<Link
										key={item.id}
										to={item.path}
										onClick={() => setIsOpen(false)}
										className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-accent ${
											isActive
												? "text-primary bg-accent"
												: "text-muted-foreground"
										}`}
									>
										<item.icon className="h-4 w-4" />
										<span>{item.label}</span>
									</Link>
								) : (
									<button
										type="button"
										key={item.id}
										onClick={() => goToHash(item.id)}
										className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-accent ${
											isActive
												? "text-primary bg-accent"
												: "text-muted-foreground"
										}`}
									>
										<item.icon className="h-4 w-4" />
										<span>{item.label}</span>
									</button>
								);
							})}
							<Button
								variant="glow"
								size="sm"
								className="mt-2"
								onClick={() => goToHash("contact")}
							>
								Let's Connect
							</Button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
