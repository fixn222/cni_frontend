import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FilePlus,
  FileText,
  Globe2,
  Loader2,
  Mail,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { useApplications } from "../context/ApplicationContext";
import { useSession } from "../hooks/useSession";
import { ROUTES } from "../lib/routes";
import type { Application, UserActivity } from "../lib/applications-api";

const getStatusBadgeVariant = (status?: Application["status"]) => {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected") {
    return "destructive" as const;
  }

  return "outline" as const;
};

const getApplicationMetrics = (applications: Application[]) => {
  const hasApps = applications.length > 0;
  const latestApp = applications[0];

  return [
    {
      label: "Total applications",
      value: applications.length.toString(),
      detail:
        applications.length === 0
          ? "No applications submitted yet"
          : `${applications.length} visa application${applications.length > 1 ? "s" : ""} in progress`,
      icon: FileText,
    },
    {
      label: "Active destination",
      value: hasApps ? latestApp?.country?.name ?? "Unknown" : "None",
      detail: hasApps
        ? `${latestApp?.visaDetails?.visaType ?? "Unknown"} visa application`
        : "Choose a destination to get started",
      icon: Globe2,
    },
    {
      label: "Document readiness",
      value: hasApps ? "Pending" : "Not started",
      detail: "Upload required documents to complete your application",
      icon: FileCheck2,
    },
  ];
};

const getJourneySteps = (applications: Application[]) => {
  const hasApps = applications.length > 0;
  const latestStatus = applications[0]?.status ?? "pending";

  return [
    {
      title: "Account secured",
      detail: "Email verified and session ready for private application work.",
      status: "Completed" as const,
    },
    ...(hasApps
      ? [
          {
            title: "Application submitted",
            detail: `${applications.length} application${applications.length > 1 ? "s" : ""} submitted successfully.`,
            status: "Completed" as const,
          },
          {
            title: "Processing stage",
            detail: `Latest application status: ${latestStatus}. The team will contact you for more details when needed.`,
            status: "Current" as const,
          },
        ]
      : [
          {
            title: "Destination planning",
            detail: "Select the country and visa type before completing the full form.",
            status: "Current" as const,
          },
        ]),
    {
      title: "Review and follow-up",
      detail: "Communication and document updates appear in your activity feed.",
      status: "Pending" as const,
    },
  ];
};

const getProgress = (applications: Application[]) => {
  if (applications.length === 0) return 25;
  if (applications.some((application) => application.status === "approved")) return 100;
  if (applications.some((application) => application.status === "rejected")) return 60;
  return 75;
};

const checklistItems = [
  "Choose your destination country",
  "Complete your personal and passport details",
  "Upload passport copy and photo",
  "Add financial proof and travel plan",
  "Review before submission with CNI support",
];

const LoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <div className="h-4 w-24 rounded bg-muted/50 animate-pulse" />
          <div className="mt-2 h-6 w-16 rounded bg-muted/50 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full rounded bg-muted/50 animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorDisplay = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
    <CardContent className="flex flex-col items-center justify-center py-8">
      <AlertCircle className="mb-3 size-10 text-red-500" />
      <p className="mb-4 text-center text-red-600 dark:text-red-400">{message}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      ) : null}
    </CardContent>
  </Card>
);

const EmptyApplications = () => (
  <Card className="border-border/80 bg-background/90">
    <CardHeader>
      <CardTitle>Your Applications</CardTitle>
      <CardDescription>
        Track the status and details of your visa applications.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <FilePlus className="size-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No applications yet</h3>
      <p className="mb-6 max-w-md text-center text-muted-foreground">
        Start your visa application journey by selecting a destination country and completing the application form.
      </p>
      <Button asChild>
        <Link to={ROUTES.APPLICATION}>
          <PlaneTakeoff className="mr-2 size-4" />
          Start Application
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const ApplicationCard = ({ app }: { app: Application }) => {
  const purpose = app?.visaDetails?.purpose ?? "Not specified";
  const travelDate = app?.visaDetails?.travelDate
    ? new Date(app.visaDetails.travelDate).toLocaleDateString()
    : "Not specified";
  const createdDate = app?.createdAt
    ? new Date(app.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <div className="rounded-2xl border border-border/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Globe2 className="size-4" />
          </div>
          <div>
            <p className="font-medium">{app?.country?.name ?? "Unknown Country"}</p>
            <p className="text-sm text-muted-foreground">
              {app?.visaDetails?.visaType ?? "Unknown Type"} • Submitted {createdDate}
            </p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(app?.status)}>{app?.status ?? "pending"}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <span className="text-muted-foreground">Applicant: </span>
          <span className="font-medium">{app?.clientDetails?.fullName ?? "N/A"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Travel Date: </span>
          <span className="font-medium">{travelDate}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Purpose: </span>
          <span className="font-medium">{purpose}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Duration: </span>
          <span className="font-medium">{app?.visaDetails?.duration ?? "Not specified"}</span>
        </div>
      </div>
    </div>
  );
};

const UpdatesList = ({
  activities,
  onDelete,
  onSeeMore,
}: {
  activities: UserActivity[];
  onDelete: (id: string) => Promise<void>;
  onSeeMore: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return activities.filter((activity) => {
      if (!query) {
        return true;
      }

      return [activity.title, activity.subject, activity.description, activity.actorName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [activities, searchQuery]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);

  return (
    <Card className="border-border/80 bg-background/90">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Updates and communication</CardTitle>
            <CardDescription>
              Track admin responses, status changes, and your own messages in one place.
            </CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search updates"
              className="h-11 rounded-xl border-border/70 bg-background/70 pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleActivities.map((activity, index) => (
          <div key={activity._id || `${activity.type}-${index}`}>
            <div className="rounded-2xl border border-border/70 p-4 transition-colors hover:bg-muted/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant="outline">
                      {activity.type.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  {activity.subject ? (
                    <p className="mt-2 text-sm font-medium">{activity.subject}</p>
                  ) : null}
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {activity.description}
                  </p>
                  {activity.actorName || activity.actorEmail ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {activity.actorName ?? "System"}
                      {activity.actorEmail ? ` • ${activity.actorEmail}` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {activity.createdAt
                      ? new Date(activity.createdAt).toLocaleString()
                      : "Unknown"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void onDelete(activity._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
            {index < visibleActivities.length - 1 ? <Separator className="my-3" /> : null}
          </div>
        ))}

        {visibleActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No updates match your search right now.
          </p>
        ) : null}

        {filteredActivities.length > visibleCount ? (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => {
              setVisibleCount((current) => current + 5);
              onSeeMore();
            }}
          >
            See more
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

const ClientDashboard = () => {
  const { user, signOut, isLoading: sessionLoading } = useSession();
  const {
    applications: applicationState,
    activities,
    loading,
    error,
    messaging,
    refreshApplications,
    deleteActivity,
    contactAdmin,
  } = useApplications();
  const applications = applicationState ?? [];
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const displayName = user?.name?.trim() ?? "Client";
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "CN";

  const journeySteps = getJourneySteps(applications);
  const progress = getProgress(applications);
  const latestApplicationId = applications[0]?._id;

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      return;
    }

    await contactAdmin({
      applicationId: latestApplicationId,
      subject: messageSubject.trim(),
      message: messageBody.trim(),
    });

    setIsMessageModalOpen(false);
    setMessageSubject("");
    setMessageBody("");
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-[linear-gradient(180deg,rgba(41,168,154,0.08),transparent_24%),linear-gradient(180deg,#ffffff,rgba(248,250,252,0.92))] px-4 pb-16 pt-28 sm:px-6 lg:px-8 dark:bg-[linear-gradient(180deg,rgba(41,168,154,0.12),transparent_24%),linear-gradient(180deg,#0f172a,rgba(15,23,42,0.96))]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <Card className="border-border/80 bg-background/90 shadow-md backdrop-blur">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="size-14 border-primary/20 bg-primary/10">
                  <AvatarFallback className="bg-transparent text-base font-semibold text-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                      Welcome back, {displayName}
                    </h1>
                    <Badge variant="secondary">Visa workspace</Badge>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Manage destination planning, document preparation, and application progress from one place.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button asChild variant="outline" className="h-11 rounded-xl px-4">
                  <Link to={ROUTES.APPLICATION}>
                    <PlaneTakeoff />
                    Start application
                  </Link>
                </Button>
                <Button
                  className="h-11 rounded-xl px-4"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <Mail />
                  Contact admin
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl px-4"
                  onClick={() => void signOut()}
                >
                  <ShieldCheck />
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorDisplay message={error} onRetry={refreshApplications} />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {getApplicationMetrics(applications).map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="border-border/80 bg-background/90">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardDescription>{item.label}</CardDescription>
                          <CardTitle className="mt-2 text-xl">{item.value}</CardTitle>
                        </div>
                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                          <Icon className="size-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_340px]">
            <div className="space-y-6">
              <Card className="border-border/80 bg-background/90">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>Application journey</CardTitle>
                      <CardDescription>
                        The next steps match your actual visa workflow: destination, documents, review, and follow-up.
                      </CardDescription>
                    </div>
                    <Badge variant="success">Guided flow</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium">Workspace readiness</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="mt-3" />
                  </div>

                  <div className="space-y-4">
                    {journeySteps.map((item, index) => (
                      <div key={item.title}>
                        <div className="flex items-start gap-4">
                          <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                            <CheckCircle2 className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{item.title}</p>
                              <Badge
                                variant={
                                  item.status === "Completed"
                                    ? "secondary"
                                    : item.status === "Current"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                        {index < journeySteps.length - 1 ? (
                          <Separator className="my-4" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {loading ? null : applications.length === 0 ? (
                <EmptyApplications />
              ) : (
                <Card className="border-border/80 bg-background/90">
                  <CardHeader>
                    <CardTitle>Your Applications</CardTitle>
                    <CardDescription>
                      Track the status and details of your visa applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {applications.map((app: Application) => (
                      <ApplicationCard key={app._id} app={app} />
                    ))}
                  </CardContent>
                </Card>
              )}

              <UpdatesList
                activities={activities}
                onDelete={deleteActivity}
                onSeeMore={() => undefined}
              />
            </div>

            <div className="space-y-6">
              <Card className="border-border/80 bg-background/90">
                <CardHeader>
                  <CardTitle>Applicant profile</CardTitle>
                  <CardDescription>
                    Your account details are the base for the rest of the visa workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-sm text-muted-foreground">Full name</p>
                    <p className="mt-1 font-medium">{displayName}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-sm text-muted-foreground">Email address</p>
                    <p className="mt-1 font-medium">{user?.email ?? "Not available"}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-sm text-muted-foreground">Account status</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <p className="font-medium">Verified and ready for application setup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-background/90">
                <CardHeader>
                  <CardTitle>Preparation checklist</CardTitle>
                  <CardDescription>
                    Keep the high-friction visa tasks visible and simple.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <div key={item}>
                      <div className="flex items-start gap-3 rounded-2xl border border-border/70 p-4">
                        <ShieldCheck className="mt-0.5 size-4 text-primary" />
                        <p className="text-sm leading-6">{item}</p>
                      </div>
                      {index < checklistItems.length - 1 ? <Separator className="my-3" /> : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Send Email to Admin</DialogTitle>
            <DialogDescription>
              Ask for help, share missing details, or respond to a processing update.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={messageSubject}
                onChange={(event) => setMessageSubject(event.target.value)}
                placeholder="Application update"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder="Write your message to the admin team"
                className="min-h-36 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button disabled={messaging} onClick={() => void handleSendMessage()}>
              {messaging ? "Sending..." : "Send Message"}
              <Mail />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDashboard;
