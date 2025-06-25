"use client";

import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink 
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Settings, 
  History, 
  Plus,
  Sparkles,
  User
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [open, setOpen] = useState(false);
  
  const links = [
    {
      label: "New Chat",
      href: "#",
      icon: <Plus className="text-foreground/70 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Chat History",
      href: "#",
      icon: <History className="text-foreground/70 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-foreground/70 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="h-screen flex bg-background">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Your Account",
                href: "#",
                icon: <User className="text-foreground/70 h-5 w-5 flex-shrink-0" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1">
        <AnimatedAIChat />
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-5 w-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-foreground whitespace-pre"
      >
        AI Assistant
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <div className="h-5 w-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  );
};
