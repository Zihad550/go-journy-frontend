import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUpdateUserMutation } from '@/redux/features/user/user.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(200, 'Address must be less than 200 characters'),
});

interface UpdateProfileFormProps {
  className?: string;
  currentName?: string;
  currentAddress?: string;
}

export function UpdateProfileForm({
  className,
  currentName = '',
  currentAddress = '',
  ...props
}: UpdateProfileFormProps & React.HTMLAttributes<HTMLDivElement>) {
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentName,
      address: currentAddress,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    try {
      await updateProfile(data).unwrap();

      // Simulate API call for now

      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={cn('space-y-6', className)} {...props}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Update Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your profile information below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <FormField
             control={form.control}
             name="name"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Full Name</FormLabel>
                 <FormControl>
                   <Input
                     placeholder="Enter your full name"
                     {...field}
                     disabled={isLoading}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />

           <FormField
             control={form.control}
             name="address"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Address</FormLabel>
                 <FormControl>
                   <Input
                     placeholder="Enter your full address"
                     {...field}
                     disabled={isLoading}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />

           <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? 'Updating...' : 'Update Profile'}
           </Button>
        </form>
      </Form>
    </div>
  );
}
