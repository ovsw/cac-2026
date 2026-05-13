"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { ColumnLink, NavigationData } from "@/types";
import { MenuLink } from "./elements/menu-link";
import { SanityButtons } from "./elements/sanity-buttons";
import { Logo } from "./logo";

export function MobileMenu({ navbarData, settingsData }: NavigationData) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  const { columns, buttons } = navbarData || {};
  const { logo, logoDarkMode, siteTitle } = settingsData || {};

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="text-primary hover:bg-primary/10 hover:text-primary"
          size="icon"
          variant="ghost"
        >
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col bg-background px-0 sm:max-w-sm"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between border-primary/20 border-b bg-brand-cream px-6 pb-4 dark:bg-card">
          <SheetTitle className={logo ? "sr-only" : undefined}>
            {siteTitle || "Menu"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
          {logo ? (
            <div className="flex h-10 w-40 items-center">
              <Logo
                alt={siteTitle || ""}
                className="h-10 w-40"
                darkImage={logoDarkMode}
                image={logo}
              />
            </div>
          ) : null}
          <SheetClose className="rounded-sm text-primary opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        {/* Navigation items - scrollable */}
        <nav className="grid flex-1 content-start gap-1 overflow-y-auto px-6 pt-4">
          <Accordion type="single" collapsible>
            {columns?.map((column) => {
              if (column.type === "link") {
                if (!column.href) return null;
                return (
                  <Link
                    className="flex items-center py-3 font-semibold text-brand-charcoal text-sm transition-colors hover:text-primary dark:text-foreground"
                    href={column.href}
                    key={column._key}
                    onClick={closeMenu}
                  >
                    {column.name}
                  </Link>
                );
              }

              if (column.type === "column") {
                return (
                  <AccordionItem
                    key={column._key}
                    value={column._key}
                    className="border-b-0"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {column.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-1 grid gap-1 border-primary/25 border-l-2 pl-4">
                        {column.links?.map((link: ColumnLink) => (
                          <MenuLink
                            description={link.description || ""}
                            href={link.href || ""}
                            icon={link.icon}
                            key={link._key}
                            name={link.name || ""}
                            onClick={closeMenu}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return null;
            })}
          </Accordion>
        </nav>

        {buttons?.length && (
          <SheetFooter className="border-primary/20 border-t bg-brand-cream/60 dark:bg-card/60">
            <SanityButtons
              buttonClassName="w-full justify-center font-bold"
              buttons={buttons || []}
              className="grid gap-3"
            />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
