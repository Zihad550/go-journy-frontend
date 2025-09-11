import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  searchTerm?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function FAQItem({
  question,
  answer,
  searchTerm = '',
  defaultExpanded = false,
  className,
}: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader className="pb-2 sm:pb-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto text-left hover:bg-transparent min-h-[44px] sm:min-h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={`faq-answer-${question.slice(0, 20)}`}
        >
          <h3 className="text-sm sm:text-base font-medium leading-relaxed pr-3 sm:pr-4 text-left">
            {highlightText(question, searchTerm)}
          </h3>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          )}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent
          id={`faq-answer-${question.slice(0, 20)}`}
          className="pt-0 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="text-sm text-muted-foreground leading-relaxed border-t pt-3 sm:pt-4">
            {highlightText(answer, searchTerm)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
