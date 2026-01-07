"use client";

import { useActionState, useEffect } from "react";
import { addEmployee, EmployeeState } from "@/lib/actions/edu/employees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User, Mail, Phone as PhoneIcon, Shield, Activity } from "lucide-react";

interface AddEmployeeFormProps {
    onClose: () => void;
}

export function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
    const initialState: EmployeeState = {};
    const [state, dispatch] = useActionState(addEmployee, initialState);

    useEffect(() => {
        if (state.message === 'success') {
            onClose();
        }
    }, [state.message, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Add New Employee</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors opacity-70 hover:opacity-100">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form action={dispatch} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <div className="relative">
                            <Input name="name" placeholder="John Doe" required className="pl-9" />
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                        {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Input name="email" type="email" placeholder="john@example.com" required className="pl-9" />
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                        {state.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <div className="relative">
                            <Input name="phone" placeholder="9876543210" required className="pl-9" />
                            <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                        {state.errors?.phone && <p className="text-xs text-red-500">{state.errors.phone[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                                <Activity className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {state.message && state.message !== 'success' && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                            {state.message}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Create Employee
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
