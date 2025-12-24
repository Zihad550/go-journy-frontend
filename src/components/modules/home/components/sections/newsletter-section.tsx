import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonSpinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { newsletterContent } from '@/constants/newsletter-constant';
import { animationClasses } from '@/lib/animations';

const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface NewsletterSectionProps {
  className?: string;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  className,
}) => {

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_NEWSLETTER_TEMPLATE_ID || import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          email: data.email,
          type: 'newsletter_subscription',
        },
        {
          publicKey: import.meta.env.VITE_APP_EMAILJS_KEY,
        },
      );

      toast.success(newsletterContent.successMessage);
      form.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(newsletterContent.errorMessage);
    }
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        className
      )}
      aria-labelledby="newsletter-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={cn("text-center mb-12", animationClasses.fadeIn)}>
          <div className="inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 mb-6">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Newsletter
            </span>
          </div>

          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {newsletterContent.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {newsletterContent.subtitle}
          </p>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={newsletterContent.emailPlaceholder}
                            className="h-12 text-center text-lg"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <ButtonSpinner />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        {newsletterContent.subscribeButton}
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {newsletterContent.privacyNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { NewsletterSection };