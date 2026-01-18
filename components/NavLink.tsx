"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
  /** Kept for API compatibility – Next.js δεν έχει pending state, απλά αγνοείται */
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      className,
      activeClassName,
      // pendingClassName, // not used, just for compat
      children,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();

    // basic active check – αν χρειαστεί μπορούμε μετά να κάνουμε startsWith για sections
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
