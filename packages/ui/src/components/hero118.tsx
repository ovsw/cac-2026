"use client";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Button } from "@workspace/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import { cn } from "@workspace/ui/lib/utils";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Circle } from "lucide-react";

const trustedBy = [
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    name: "Fictional Company 1",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    name: "Fictional Company 2",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    name: "Fictional Company 3",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    name: "Fictional Company 4",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    name: "Fictional Company 5",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    name: "Fictional Company 6",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
    name: "Fictional Company 7",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    name: "Fictional Company 1",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    name: "Fictional Company 2",
  },
  {
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    name: "Fictional Company 3",
  },
];

interface Hero118Props {
  className?: string;
}

const Hero118 = ({ className }: Hero118Props) => {
  return (
    <section
      className={cn(
        "overflow-hidden bg-background py-12 font-sans md:py-20",
        className
      )}
    >
      <div className="container max-w-[76.5rem]">
        <div className="flex flex-col gap-20">
          <div className="grid grid-cols-1 items-center justify-center gap-10 xl:grid-cols-2">
            <div>
              <div className="mx-auto flex w-full max-w-[52.5rem] flex-col items-start justify-center gap-10 xl:max-w-full">
                <div className="flex max-w-[42rem] flex-col items-start gap-6 xl:max-w-full">
                  <div className="mx-auto flex w-fit items-center gap-2 rounded-md bg-muted px-[0.625rem] py-1 md:mx-0">
                    <Circle className="h-2 w-2 fill-muted-foreground" />
                    <div className="font-mono text-xs leading-relaxed text-muted-foreground uppercase">
                      Coming Soon
                    </div>
                  </div>
                  <h1 className="text-center text-4xl leading-none font-semibold tracking-tighter text-foreground md:text-left md:text-7xl">
                    <span className="text-muted-foreground">
                      Valuable insights
                    </span>{" "}
                    to uncover true opportunities
                  </h1>
                  <div className="text-center text-base leading-snug text-foreground md:text-left md:text-lg">
                    Enter a new age of strategic decision-making. Horizon equips
                    businesses in the marketing sector with cutting-edge data
                    analytics.
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                  <div className="w-full flex-1 xl:w-fit xl:flex-initial">
                    <Button
                      asChild
                      variant="secondary"
                      className="border-muted2 block h-fit w-full rounded-xl border px-5 py-3 text-center text-[0.9375rem] leading-normal font-medium xl:w-fit"
                    >
                      <a href="/">Discover more</a>
                    </Button>
                  </div>
                  <div className="w-full flex-1 xl:w-fit xl:flex-initial">
                    <Button
                      asChild
                      className="group flex h-fit w-full items-center justify-center gap-1 rounded-xl py-3 pr-4 pl-5 text-[0.9375rem] leading-normal font-medium transition-all duration-300 hover:pr-7 xl:w-fit"
                    >
                      <a href="/">
                        <div>Get early access</div>
                        <ArrowRight className="size-6! transition-transform duration-300 group-hover:translate-x-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="border-muted2 overflow-hidden rounded-[1.25rem] border md:w-[63.4375rem]">
                <AspectRatio ratio={1.5378787878787878}>
                  <div className="size-full">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                      alt=""
                      className="size-full object-cover object-center"
                    />
                    <div className="absolute top-0 left-0 z-20 h-[0.125rem] w-full">
                      <div className="absolute h-full w-[20%] animate-slide-to-right bg-[linear-gradient(270deg,var(--color-primary)_0%,var(--color-transparent)_85%)] md:w-[14%]"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 z-20 h-full w-[0.125rem]">
                      <div className="absolute h-[24%] w-full animate-slide-to-top bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-transparent)_85%)] md:h-[17%]"></div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full bg-[radial-gradient(closest-side,var(--color-background)_54%,transparent)] bg-center py-12">
        <div className="container">
          <div className="mx-auto flex max-w-[72.5rem] flex-col gap-4">
            <p className="text-center text-lg text-foreground">
              Already trusted by industry leaders
            </p>
            <div className="py-14">
              <Carousel
                opts={{
                  loop: true,
                  align: "center",
                }}
                plugins={[
                  AutoScroll({
                    speed: 1,
                  }),
                  Autoplay({
                    playOnInit: true,
                    delay: 1000,
                  }),
                ]}
                className="relative w-full max-w-(--breakpoint-2xl) overflow-hidden"
              >
                <CarouselContent className="items-center">
                  {trustedBy.map((item, index) => (
                    <CarouselItem
                      key={`${item.name}-${index}`}
                      className="w-fit basis-auto px-7"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-8 w-full object-fill opacity-60"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero118 };
