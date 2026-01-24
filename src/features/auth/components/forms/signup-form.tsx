"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signupAction } from "@/actions/auth/signup.form";
import {
  Button,
  Label,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Checkbox,
} from "@/ui";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "center">("student");

  return (
    <Card className="border-2 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Join thousands of learners and start your journey today
        </CardDescription>
      </CardHeader>

      <Tabs
        defaultValue="student"
        onValueChange={(v) => setRole(v as "student" | "center")}
        className="w-full"
      >
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2 h-11">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="center">Center</TabsTrigger>
          </TabsList>
        </div>

        <form action={formAction}>
          <input type="hidden" name="role" value={role} />
          
          <CardContent className="space-y-5 mt-4">
            {state?.error && (
              <Alert variant="destructive" className="border-2">
                <AlertDescription className="font-medium">
                  {state.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                {role === "student" ? "Full Name" : "Center Name"}
              </Label>
              <div className="relative">
                {role === "student" ? (
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                ) : (
                  <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                )}
                <Input
                  id="name"
                  name="name"
                  placeholder={
                    role === "student" ? "John Doe" : "Happy Computer Center"
                  }
                  className="pl-11 h-12 border-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-11 h-12 border-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="1234567890"
                  className="pl-11 h-12 border-2 focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-11 pr-11 h-12 border-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-11 h-12 border-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  );
}
