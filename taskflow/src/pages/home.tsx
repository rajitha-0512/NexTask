import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, LayoutList, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Soft background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300/30 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-indigo-200/40 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-6 h-6">
              <path d="M100 20 L40 100 H90 L80 180 L160 80 H110 L120 20 Z" fill="url(#blue-grad)" />
              <defs>
                <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">NexTask</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 relative z-10 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 text-sm font-medium">
            <Zap className="w-4 h-4" /> <span>The ultimate command center for your tasks</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Take control of your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              daily workflow.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            NexTask isn't just another to-do list. It's a premium environment
            designed to keep you organized and executing at your best.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              <Link href="/sign-up" className="flex items-center">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="grid md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl"
        >
          <div className="bg-white border border-border rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600">
              <LayoutList className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Fluid Organization</h3>
            <p className="text-muted-foreground">Quickly add, edit, and organize tasks with an interface that gets out of your way.</p>
          </div>

          <div className="bg-white border border-primary/20 rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary relative z-10">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3 relative z-10">Stay Focused</h3>
            <p className="text-muted-foreground relative z-10">A clean, distraction-free interface that keeps you dialed into your work.</p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Track Progress</h3>
            <p className="text-muted-foreground">Instantly see your stats. Know exactly what's pending, in progress, and completed.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
