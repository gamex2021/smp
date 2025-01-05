"use client";

import { Icons } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, { message: "Invalid password." }),
});

type FormSchema = z.infer<typeof formSchema>;

interface Props {
  domain: string;
}
export function SignInForm({ domain }: Props) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid w-full max-w-lg grid-cols-1 gap-2 rounded-md bg-background p-4"
      >
        <p className="text-xl font-semibold tracking-tight">Welcome back</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or ID number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link href="#" className="text-sm text-blue-600">
          Forgot password?
        </Link>
        <Button disabled={loading}>
          Sign in
          {loading && <Icons.spinner className="ml-2 size-5 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
