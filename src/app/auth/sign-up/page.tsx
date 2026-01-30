"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
    image: z.any().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUp() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      image: null,
    },
  });

  // Watch image field for form validation
  watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<SignUpValues> = async (values) => {
    const { firstName, lastName, email, password, image } = values;
    await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      image: image ? await convertImageToBase64(image) : "",
      callbackURL: "/dashboard",
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <Card className="z-50 rounded-md rounded-t-none max-w-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  autoComplete="new-password"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("passwordConfirmation")}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                />
                {errors.passwordConfirmation && (
                  <p className="text-sm text-red-500">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Profile Image (optional)</Label>
                <div className="flex items-end gap-4">
                  {imagePreview && (
                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 w-full">
                    <Controller
                      control={control}
                      name="image"
                      render={({ field: { onChange, ...field } }) => (
                        <Input
                          {...field}
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                            handleImageChange(e);
                          }}
                          className="w-full"
                        />
                      )}
                    />
                    {imagePreview && (
                      <X
                        className="cursor-pointer"
                        onClick={() => {
                          setImagePreview(null);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center w-full border-t py-4">
              <p className="text-center text-xs text-neutral-500">
                Secured by <span className="text-orange-400">better-auth.</span>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
