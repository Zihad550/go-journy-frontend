import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQ_CATEGORIES_DATA, FAQ_DATA } from "@/constants/faq-constant";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";

function FAQSection() {
  const [search_query, set_search_query] = useState("");
  const [expanded_faqs, set_expanded_faqs] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    if (!search_query.trim()) return FAQ_DATA;
    const query = search_query.toLowerCase();
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [search_query]);

  const categorizedFAQs = useMemo(() => {
    return FAQ_CATEGORIES_DATA.map((category) => ({
      ...category,
      items: category.items.filter((item) => filteredFAQs.some((faq) => faq.id === item.id)),
    })).filter((category) => category.items.length > 0);
  }, [filteredFAQs]);

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expanded_faqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    set_expanded_faqs(newExpanded);
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={search_query}
          onChange={(e) => set_search_query(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQ Categories */}
      <Tabs defaultValue={categorizedFAQs[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {categorizedFAQs.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categorizedFAQs.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="space-y-4">
              {category.items.map((faq) => (
                <Card key={faq.id} className="backdrop-blur-sm bg-background/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center gap-2">
                        {faq.question}
                        {faq.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFAQ(faq.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expanded_faqs.has(faq.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {expanded_faqs.has(faq.id) && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredFAQs.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No FAQs found</p>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}

export default FAQSection;