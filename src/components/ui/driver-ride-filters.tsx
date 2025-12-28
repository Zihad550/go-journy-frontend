import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { IRideFilters } from "@/types";
import {
	MapPin,
	DollarSign,
	User,
	Navigation,
	Filter,
	X,
	Slash,
} from "lucide-react";
import { useSearchParams } from "react-router";

interface DriverRideFiltersProps {
	filters: IRideFilters;
	onFiltersChange: (filters: IRideFilters) => void;
	onClearFilters: () => void;
	isMobile?: boolean;
}

export function DriverRideFilters({
	filters,
	onFiltersChange,
	onClearFilters,
	isMobile = false,
}: DriverRideFiltersProps) {
	const [searchParams, setSearchParams] = useSearchParams();

	const updateFilter = (
		key: keyof IRideFilters,
		value: string | number | undefined,
	) => {
		const updated = { ...filters, [key]: value };
		onFiltersChange(updated);

		const params = new URLSearchParams(searchParams);
		if (value !== undefined && value !== "") {
			params.set(key, value.toString());
		} else {
			params.delete(key);
		}
		setSearchParams(params);
	};

	const handleUseMyLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					updateFilter("pickupLat", position.coords.latitude.toString());
					updateFilter("pickupLng", position.coords.longitude.toString());
				},
				(error) => {
					console.error("Geolocation error:", error);
				}
			);
		}
	};

	const clearIndividualFilter = (key: keyof IRideFilters) => {
		updateFilter(key, undefined);
	};

	const getActiveFiltersCount = () => {
		return Object.entries(filters).filter(
			([, value]) => value !== undefined && value !== ""
		).length;
	};

	const activeFilterBadges = Object.entries(filters)
		.filter(([, value]) => value !== undefined && value !== "")
		.map(([key, value]) => (
			<Badge key={key} variant="secondary" className="gap-1 text-xs">
				{key}: {typeof value === "number" ? value : value}
				<X
					className="w-3 h-3 cursor-pointer"
					onClick={() => clearIndividualFilter(key as keyof IRideFilters)}
				/>
			</Badge>
		));

	const filterContent = (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Filter className="h-5 w-5 text-primary" />
					<CardTitle className="text-lg">Filter Rides</CardTitle>
				</div>
				{getActiveFiltersCount() > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearFilters}
						className="text-destructive"
					>
						<Slash className="h-4 w-4 mr-1" />
						Clear All
					</Button>
				)}
			</div>

			{activeFilterBadges.length > 0 && (
				<div className="flex flex-wrap gap-2 pb-4 border-b">
					{activeFilterBadges}
				</div>
			)}

			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<DollarSign className="h-4 w-4 text-primary" />
					<Label className="text-sm font-semibold">Price Range</Label>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="minPrice" className="text-xs text-muted-foreground">
							Minimum ($)
						</Label>
						<Input
							id="minPrice"
							type="number"
							placeholder="0"
							value={filters.minPrice ?? ""}
							onChange={(e) =>
								updateFilter(
									"minPrice",
									e.target.value
										? Number.parseFloat(e.target.value)
										: undefined
								)
							}
							className="h-9"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
							Maximum ($)
						</Label>
						<Input
							id="maxPrice"
							type="number"
							placeholder="1000"
							value={filters.maxPrice ?? ""}
							onChange={(e) =>
								updateFilter(
									"maxPrice",
									e.target.value
										? Number.parseFloat(e.target.value)
										: undefined
								)
							}
							className="h-9"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<User className="h-4 w-4 text-primary" />
					<Label className="text-sm font-semibold">Rider Name</Label>
				</div>
				<Input
					placeholder="Search by rider name..."
					value={filters.riderName ?? ""}
					onChange={(e) =>
						updateFilter("riderName", e.target.value || undefined)
					}
					className="h-9"
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-chart-2" />
						<Label className="text-sm font-semibold">Pickup Location</Label>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={handleUseMyLocation}
						className="h-7 text-xs"
					>
						<Navigation className="h-3 w-3 mr-1" />
						 Near Me
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="pickupLat" className="text-xs text-muted-foreground">
							Latitude
						</Label>
						<Input
							id="pickupLat"
							type="number"
							step="any"
							placeholder="e.g., 64 for 64.965"
							value={filters.pickupLat ?? ""}
							onChange={(e) =>
								updateFilter(
									"pickupLat",
									e.target.value || undefined
								)
							}
							className="h-9"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="pickupLng" className="text-xs text-muted-foreground">
							Longitude
						</Label>
						<Input
							id="pickupLng"
							type="number"
							step="any"
							placeholder="e.g., -74 for -74.006"
							value={filters.pickupLng ?? ""}
							onChange={(e) =>
								updateFilter(
									"pickupLng",
									e.target.value || undefined
								)
							}
							className="h-9"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<MapPin className="h-4 w-4 text-destructive" />
					<Label className="text-sm font-semibold">Destination Location</Label>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="destLat" className="text-xs text-muted-foreground">
							Latitude
						</Label>
						<Input
							id="destLat"
							type="number"
							step="any"
							placeholder="e.g., 64 for 64.965"
							value={filters.destLat ?? ""}
							onChange={(e) =>
								updateFilter("destLat", e.target.value || undefined)
							}
							className="h-9"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="destLng" className="text-xs text-muted-foreground">
							Longitude
						</Label>
						<Input
							id="destLng"
							type="number"
							step="any"
							placeholder="e.g., -74 for -74.006"
							value={filters.destLng ?? ""}
							onChange={(e) =>
								updateFilter("destLng", e.target.value || undefined)
							}
							className="h-9"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
				</div>
			</div>
		</div>
	);

	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm" className="gap-2">
						<Filter className="h-4 w-4" />
						Filters
						{getActiveFiltersCount() > 0 && (
							<Badge
								variant="secondary"
								className="h-5 px-1 text-xs"
							>
								{getActiveFiltersCount()}
							</Badge>
						)}
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-full sm:max-w-md">
					{filterContent}
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Card className="border shadow-sm">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-base">
					<Filter className="h-5 w-5 text-primary" />
					Filter Options
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">{filterContent}</CardContent>
		</Card>
	);
}
