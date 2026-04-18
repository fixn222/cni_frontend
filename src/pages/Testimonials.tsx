// Responsive refresh: testimonials and the feedback dialog now fit smaller screens and use subtle reveal motion.
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Star, ThumbsUp, Verified } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BorderGlow from "../components/BorderGlow";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { feedBackFormSchema } from "../types";

type FeedbackFormValues = z.infer<typeof feedBackFormSchema>;

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  country: string;
  feedback: string;
  rating: number;
  avatar?: string;
  highlight?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "James Anderson",
    role: "Student Visa Applicant",
    country: "Canada",
    feedback:
      "The entire visa process was smooth and stress-free. The AI updates and WhatsApp notifications kept me informed at every step.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    highlight: true,
  },
  {
    id: "2",
    name: "Sophia Williams",
    role: "Tourist Visa Applicant",
    country: "Australia",
    feedback:
      "I was amazed by how fast everything was processed. The dashboard made tracking my visa incredibly easy.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "Liam Johnson",
    role: "Work Visa Applicant",
    country: "United Kingdom",
    feedback:
      "Professional service and excellent communication. The team handled everything efficiently.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: "4",
    name: "Emily Brown",
    role: "Student Visa Applicant",
    country: "Germany",
    feedback:
      "Uploading documents and tracking progress was super easy. Highly recommend this service!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    highlight: true,
  },
  {
    id: "5",
    name: "Noah Davis",
    role: "Tourist Visa Applicant",
    country: "France",
    feedback:
      "Great experience overall. The automation saved me a lot of time and confusion.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "6",
    name: "Olivia Martinez",
    role: "Work Visa Applicant",
    country: "United States",
    feedback:
      "Fast, reliable, and very modern system. Loved the real-time updates and clean interface.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const FeedbackCard = ({
  name,
  role,
  country,
  feedback,
  rating,
}: Testimonial) => {
  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#050816"
      borderRadius={28}
      glowRadius={40}
      glowIntensity={1}
      coneSpread={25}
      animated
      colors={["#c084fc", "#f472b6", "#38bdf8"]}
    >
      <div className="flex h-full min-h-[250px] flex-col justify-between gap-5 p-6 text-left sm:min-h-[280px] sm:p-8">
        <div>
          <p className="text-sm font-semibold text-primary">{country}</p>
          <h3 className="mt-3 text-xl font-bold sm:text-2xl">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{role}</p>
          <p className="mt-4 text-sm leading-7 text-foreground/90 sm:text-base">
            {feedback}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }
            />
          ))}
        </div>
      </div>
    </BorderGlow>
  );
};

const Testimonials = () => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedBackFormSchema),
    defaultValues: {
      name: "",
      feedback: "",
    },
  });

  const onSubmit = (_values: FeedbackFormValues) => {
    form.reset();
  };

  return (
    <section
      id="testimonials"
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-7xl flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-2 backdrop-blur-2xl">
          <Verified size={18} />
          <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
            TESTIMONIALS
          </span>
        </div>

        <h2 className="mt-5 max-w-[14ch] text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Trusted by clients around the world
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          The section keeps the same hierarchy on small screens while adding a
          cleaner card rhythm and light entrance animation.
        </p>

        <div className="mt-8 w-full">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((user) => (
                <CarouselItem
                  key={user.id}
                  className="basis-full pl-4 sm:basis-1/2 xl:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full"
                  >
                    <FeedbackCard {...user} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-6 hidden justify-end gap-3 sm:flex">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>

        <div className="mt-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl px-5 py-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <ThumbsUp />
                Give us your thoughts
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-2xl p-0 sm:max-w-lg">
              <div className="p-5 sm:p-6">
                <DialogHeader className="space-y-3 text-center">
                  <DialogTitle className="text-2xl font-bold sm:text-3xl">
                    Give us your feedback
                  </DialogTitle>
                  <DialogDescription>
                    Rate our service based on your experience.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                  <Form {...form}>
                    <form
                      className="space-y-5"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            {fieldState.error && (
                              <p className="text-sm text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="feedback"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Feedback</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us what worked well"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            {fieldState.error && (
                              <p className="text-sm text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="h-11 w-full rounded-xl">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
