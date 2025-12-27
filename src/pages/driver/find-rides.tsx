import { DriverHeroContent } from "@/components/modules/home/components/hero/driver-hero-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { MapPin, Search } from "lucide-react";

export default function FindRides() {
	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<GradientBackground className="rounded-3xl">
				<Card className="bg-card/95 backdrop-blur-sm border shadow-2xl rounded-3xl">
					<CardHeader className="border-b relative overflow-hidden">
						<div className="absolute inset-0 bg-grid-pattern opacity-5" />
						<div className="relative flex items-center gap-4">
							<div className="relative p-3 bg-card rounded-2xl shadow-lg border">
								<MapPin className="h-6 w-6 text-primary" />
								<div className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm" />
							</div>
							<div>
								<CardTitle className="text-2xl font-bold">
									Find Available Rides
								</CardTitle>
								<p className="text-muted-foreground mt-1">
									Filter and browse ride requests based on your preferences
								</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6">
						<div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border">
							<Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="font-semibold text-sm mb-1">
									Filter Options Available
								</h3>
								<p className="text-sm text-muted-foreground">
									Use the filters above to search rides by price range,
									rider name, pickup location, and destination
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</GradientBackground>

			<DriverHeroContent />
		</div>
	);
}