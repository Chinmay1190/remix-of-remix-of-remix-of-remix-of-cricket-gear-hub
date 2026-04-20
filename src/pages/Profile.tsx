import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Strict validation:
// - full name: only letters, spaces, hyphens, apostrophes (no numbers/symbols)
// - phone: exactly 10 digits (Indian mobile), allows leading +91
// - address fields: required, sensible length
const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters')
    .regex(/^[A-Za-z][A-Za-z\s'-]*$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address: z.string().trim().min(5, 'Address is required (min 5 chars)').max(200),
  city: z.string().trim().min(2, 'City is required').max(60).regex(/^[A-Za-z][A-Za-z\s.-]*$/, 'City can only contain letters'),
  state: z.string().trim().min(2, 'State is required').max(60).regex(/^[A-Za-z][A-Za-z\s.-]*$/, 'State can only contain letters'),
  postal_code: z.string().trim().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) {
        setForm({
          full_name: data.full_name ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          postal_code: data.postal_code ?? '',
        });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [user]);

  // Live filters: block disallowed characters as user types
  const handleNameChange = (field: 'full_name' | 'city' | 'state', value: string) => {
    // Strip digits and most symbols (but keep spaces, hyphens, apostrophes, periods)
    const filtered = value.replace(/[^A-Za-z\s'.-]/g, '');
    setForm(prev => ({ ...prev, [field]: filtered }));
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits, +, space, hyphen
    const filtered = value.replace(/[^+\d\s-]/g, '').slice(0, 16);
    setForm(prev => ({ ...prev, phone: filtered }));
  };

  const handlePostalChange = (value: string) => {
    const filtered = value.replace(/\D/g, '').slice(0, 6);
    setForm(prev => ({ ...prev, postal_code: filtered }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = profileSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Partial<Record<keyof ProfileForm, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) newErrors[err.path[0] as keyof ProfileForm] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the errors before saving');
      return;
    }

    setErrors({});
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: result.data.full_name,
        phone: result.data.phone,
        address: result.data.address,
        city: result.data.city,
        state: result.data.state,
        postal_code: result.data.postal_code,
      })
      .eq('user_id', user.id);
    setIsSaving(false);

    if (error) {
      toast.error('Failed to save profile');
      console.error(error);
    } else {
      toast.success('Profile saved successfully');
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="font-display text-4xl mb-2">MY PROFILE</h1>
            <p className="text-muted-foreground">Update your personal information and shipping address</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input value={user?.email ?? ''} disabled className="pl-10" />
                </div>
              </div>

              {/* Full name */}
              <div>
                <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="full_name"
                    placeholder="Virat Kohli"
                    value={form.full_name}
                    onChange={(e) => handleNameChange('full_name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.full_name && <p className="text-sm text-destructive mt-1">{errors.full_name}</p>}
                <p className="text-xs text-muted-foreground mt-1">Letters only — no numbers or symbols</p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    inputMode="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                <p className="text-xs text-muted-foreground mt-1">10-digit mobile number, optionally prefixed with +91</p>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="House no., street, area"
                    value={form.address}
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value.slice(0, 200) }))}
                    className="pl-10 min-h-[80px]"
                    required
                  />
                </div>
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              </div>

              {/* City / State / Postal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => handleNameChange('city', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                  <Input
                    id="state"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={(e) => handleNameChange('state', e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code <span className="text-destructive">*</span></Label>
                  <Input
                    id="postal_code"
                    inputMode="numeric"
                    placeholder="400001"
                    value={form.postal_code}
                    onChange={(e) => handlePostalChange(e.target.value)}
                    className="mt-1"
                    required
                  />
                  {errors.postal_code && <p className="text-sm text-destructive mt-1">{errors.postal_code}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full gap-2" size="lg">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
