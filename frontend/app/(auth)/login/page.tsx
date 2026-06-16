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

const loginSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(4, 'Le mot de passe doit contenir au moins 4 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.username, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Nom d\'utilisateur ou mot de passe invalide.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-8" accent>
      <div className="flex flex-col gap-2 text-center mb-6">
        <h2 className="font-serif font-bold text-2xl text-[#171c1f]">Ouvrir le Grimoire</h2>
        <p className="text-xs text-[#393E41]/70 font-sans">
          Connectez-vous pour retrouver vos héros et poursuivre l'aventure.
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

        <Button type="submit" variant="primary" className="w-full font-bold py-3 mt-2" isLoading={isLoading}>
          Entrer dans le jeu
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#393E41]/80 font-sans">
        Nouveau sur Aethelgard ?{' '}
        <Link href="/register" className="text-primary font-bold hover:underline">
          Créer un compte
        </Link>
      </div>
    </Card>
  );
}
