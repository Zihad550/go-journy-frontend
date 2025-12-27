import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FAQItem } from "@/components/ui/faq-item";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Input } from "@/components/ui/input";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import {
  CONTACT_INFO,
  FAQ_CATEGORIES_DATA,
  FAQ_DATA,
  FAQ_MESSAGING,
  POPULAR_FAQS,
} from "@/constants";
import { cn } from "@/lib/utils";
import { HelpCircle, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

// Create categories with "All Questions" option
const categories = [
  {
    id: "all",
    name: "All Questions",
    icon: HelpCircle,
    description: "Browse all frequently asked questions",
  },
  ...FAQ_CATEGORIES_DATA.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    description: category.description,
  })),
];

function Help() {
  const [search_term, set_search_term] = useState("");
  const [selected_category, set_selected_category] = useState<string>("all");

  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA;

    // Filter by category
    if (selected_category !== "all") {
      filtered = filtered.filter((faq) => faq.category === selected_category);
    }

    // Filter by search term
    if (search_term.trim()) {
      const searchLower = search_term.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower) ||
          faq.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Sort popular questions first
    return filtered.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  }, [search_term, selected_category]);

  const popularFAQs = useMemo(() => {
    return POPULAR_FAQS.slice(0, 6);
  }, []);

  return (
    <div className="min-h-screen">
      <GradientBackground>
        {/* Hero Section */}
        <SectionWrapper spacing="normal">
          <div className="relative">
            <div className="text-center">
              <Badge
                variant="secondary"
                className="mb-3 sm:mb-4 text-xs sm:text-sm"
              >
                Help Center
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
                {FAQ_MESSAGING.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
                {FAQ_MESSAGING.subtitle}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={FAQ_MESSAGING.searchPlaceholder}
                  value={search_term}
                  onChange={(e) => set_search_term(e.target.value)}
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 text-base sm:text-lg bg-background/50 backdrop-blur-sm border-2 focus:border-primary min-h-[48px]"
                />
              </div>
            </div>
          </div>
        </SectionWrapper>
      </GradientBackground>

      {/* Main Content */}
      <SectionWrapper spacing="compact">
        {/* Category Navigation - Mobile-responsive grid */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selected_category === category.id;

              return (
                <Card
                  key={category.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                    isActive && "ring-2 ring-primary bg-primary/5",
                  )}
                  onClick={() => set_selected_category(category.id)}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={cn(
                          "p-1.5 sm:p-2 rounded-lg",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-chart-1/10 text-chart-1",
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xs sm:text-sm font-medium">
                          {category.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs leading-tight">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Questions (shown when no search term and all categories)  */}
        {!search_term && selected_category === "all" && (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center">
              <span className="mr-2">🔥</span>
              Popular Questions
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {popularFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  searchTerm={search_term}
                />
              ))}
            </div>
          </div>
        )}

        {/* FAQ Results */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {search_term
                ? `Search Results (${filteredFAQs.length})`
                : selected_category === "all"
                  ? "All Questions"
                  : categories.find((c) => c.id === selected_category)?.name}
            </h2>
            {filteredFAQs.length > 0 && (
              <Badge variant="outline" className="w-fit">
                {filteredFAQs.length} question
                {filteredFAQs.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {filteredFAQs.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  searchTerm={search_term}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8 sm:py-12">
              <CardContent>
                <HelpCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  No questions found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2 sm:px-0">
                  {search_term
                    ? `${FAQ_MESSAGING.noResults} Try different keywords or browse by category.`
                    : "No questions available in this category."}
                </p>
                {search_term && (
                  <Button
                    variant="outline"
                    onClick={() => set_search_term("")}
                    className="w-full sm:w-auto"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Support Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5 border-primary/20 mb-6 sm:mb-8 md:mb-10">
          <CardContent className="py-6 sm:py-8">
            <div className="text-center">
              <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Still need help?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-2 sm:px-0">
                {FAQ_MESSAGING.contactFallback}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button asChild className="w-full sm:w-auto min-h-[44px]">
                  <Link to="/contact">Contact Support</Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  <a href={`mailto:${CONTACT_INFO.email}`}>Email Us</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

export default Help;
