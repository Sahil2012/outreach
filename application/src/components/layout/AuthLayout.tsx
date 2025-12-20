import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-30 dark:opacity-10" />

            {/* Header / Logo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        O
                    </div>
                    <span>Outreach</span>
                </Link>
            </div>

            <div className="w-full max-w-[400px] space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                    {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {children}
            </div>
        </div>
    );
}
