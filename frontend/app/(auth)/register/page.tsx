'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(4, 'Le mot de passe doit contenir au moins 4 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerStore = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerStore(data.username, data.password, data.confirmPassword);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-8" accent>
      <div className="flex flex-col gap-2 text-center mb-6">
        <h2 className="font-serif font-bold text-2xl text-[#171c1f]">Inscrire son Nom</h2>
        <p className="text-xs text-[#393E41]/70 font-sans">
          Rejoignez Aethelgard et préparez-vous à guider vos héros.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom d'utilisateur"
          placeholder="Ex: Aragorn"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" variant="primary" className="w-full font-bold py-3 mt-2" isLoading={isLoading}>
          Créer un compte
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#393E41]/80 font-sans">
        Déjà inscrit ?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Se connecter
        </Link>
      </div>
    </Card>
  );
}
