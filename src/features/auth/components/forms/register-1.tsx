"use client";

import React, { useState } from "react";
import {
    Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
    Tabs, TabsContent, TabsList, TabsTrigger,
    Input, Button, Label, Checkbox
} from "@/ui";
import {
    User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, Building2,
} from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    // Reusable Form Component to keep code clean
    const RegistrationForm = ({ type = "student" }: { type?: "student" | "center" }) => {
        return (
            <div className="space-y-4 mt-4">
                {/* Full Name / Center Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        {type === "student" ? "Full Name" : "Center Name"} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        {type === "student" ? (
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        ) : (
                            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        )}
                        <Input
                            id="name"
                            placeholder={type === "student" ? "Happy Kumar" : "Happy Computer Center"}
                            className="pl-10 h-11 bg-gray-50/50"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="happy@gmail.com"
                            className="pl-10 h-11 bg-gray-50/50"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="7488914700"
                            className="pl-10 h-11 bg-gray-50/50"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 h-11 bg-gray-50/50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2 py-2">
                    <Checkbox id="terms" />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                    >
                        I agree to the{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-purple-600 hover:underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>

                {/* Submit Button */}
                <Button className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md">
                    Create {type === "student" ? "Student" : "Center"} Account
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4 font-sans">
            <div className="w-full max-w-lg">

                {/* Top Logo Section */}
                <div className="flex flex-col items-center mb-6 space-y-2">
                    <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg text-white">
                        <ShieldCheck className="h-9 w-9" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Create Your Account
                    </h1>
                    <p className="text-gray-500 text-center">
                        Join thousands of learners and start your journey today
                    </p>
                </div>

                <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-0">
                        {/* यहाँ हमने Tabs लगाए हैं जैसा आपने माँगा था */}
                        <Tabs defaultValue="student" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 rounded-xl p-1">
                                <TabsTrigger
                                    value="student"
                                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm font-medium transition-all"
                                >
                                    Student Registration
                                </TabsTrigger>
                                <TabsTrigger
                                    value="center"
                                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm font-medium transition-all"
                                >
                                    Center Registration
                                </TabsTrigger>
                            </TabsList>

                            <CardContent className="pt-6 px-1">
                                <TabsContent value="student" className="mt-0">
                                    <RegistrationForm type="student" />
                                </TabsContent>
                                <TabsContent value="center" className="mt-0">
                                    <RegistrationForm type="center" />
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </CardHeader>

                    {/* Footer Area */}
                    <CardFooter className="flex flex-col space-y-4 bg-gray-50/50 pt-6 pb-8">
                        <div className="relative w-full flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <span className="relative bg-gray-50 px-2 text-xs text-gray-400 uppercase">
                                Already have an account?
                            </span>
                        </div>
                        <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-white hover:text-purple-700 hover:border-purple-200">
                            Sign In Instead
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}