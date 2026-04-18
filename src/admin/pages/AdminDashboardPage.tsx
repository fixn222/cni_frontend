import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileClock,
  Globe2,
  MapPinPlus,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";

import { useAdmin } from "@admin/context/AdminContext";
import { AdminProvider } from "@admin/providers/AdminProvider";
import type { AdminApplication, AdminCountry, AdminUser } from "@admin/lib/admin-api";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const getStatusBadgeVariant = (status: AdminApplication["status"]) => {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected") {
    return "destructive" as const;
  }

  return "outline" as const;
};

const LoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {[1, 2, 3, 4].map((item) => (
      <Card key={item} className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <div className="h-4 w-24 rounded bg-muted/50 animate-pulse" />
          <div className="mt-2 h-8 w-14 rounded bg-muted/50 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full rounded bg-muted/50 animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
    <CardContent className="flex flex-col items-center justify-center gap-4 py-10">
      <AlertCircle className="size-10 text-red-500" />
      <p className="max-w-xl text-center text-sm text-red-600 dark:text-red-300">
        {message}
      </p>
      <Button variant="outline" onClick={() => void onRetry()}>
        Try Again
      </Button>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="border-border/80 bg-background/90">
    <CardContent className="flex flex-col items-center justify-center gap-3 py-14">
      <FileClock className="size-10 text-primary" />
      <h3 className="text-lg font-semibold">No applications found</h3>
      <p className="max-w-lg text-center text-sm text-muted-foreground">
        There are no visa applications matching the current filters.
      </p>
    </CardContent>
  </Card>
);

const AdminDashboardContent = () => {
  const { user } = useSession();
  const {
    applications,
    activities,
    users,
    countries,
    loading,
    error,
    emailSending,
    savingCountry,
    fetchAllApplications,
    updateStatus,
    deleteApplication,
    createCountry,
    deleteCountry,
    updateUserRole,
    deleteUser,
    sendEmail,
    deleteActivity,
  } = useAdmin();
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminApplication["status"]>("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [countryImage, setCountryImage] = useState("");
  const [countryVisaTypes, setCountryVisaTypes] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [activityVisibleCount, setActivityVisibleCount] = useState(6);

  const displayName = user?.name?.trim() || "Admin";
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const countryOptions = useMemo(
    () => {
      const countryNames = applications
        .map((application: AdminApplication) => application?.country?.name)
        .filter((countryName): countryName is string => Boolean(countryName));

      return [...new Set(countryNames)].sort((left, right) =>
        left.localeCompare(right),
      );
    },
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...applications]
      .filter((application: AdminApplication) => {
        const applicantName = application?.clientDetails?.fullName?.toLowerCase() ?? "";
        const countryName = application?.country?.name?.toLowerCase() ?? "";
        const matchesQuery =
          !normalizedQuery ||
          applicantName.includes(normalizedQuery) ||
          countryName.includes(normalizedQuery);
        const matchesStatus =
          statusFilter === "all" || application?.status === statusFilter;
        const matchesCountry =
          countryFilter === "all" || application?.country?.name === countryFilter;

        return matchesQuery && matchesStatus && matchesCountry;
      })
      .sort((left: AdminApplication, right: AdminApplication) => {
        const leftDate = new Date(left?.createdAt ?? 0).getTime();
        const rightDate = new Date(right?.createdAt ?? 0).getTime();
        return sortOrder === "newest" ? rightDate - leftDate : leftDate - rightDate;
      });
  }, [applications, countryFilter, searchQuery, sortOrder, statusFilter]);

  const selectedApplication =
    filteredApplications.find(
      (application: AdminApplication) => application._id === selectedId,
    ) ??
    filteredApplications[0] ??
    null;

  const communicationActivities = useMemo(() => {
    const selectedUserId = selectedApplication?.user?.id ?? "";

    return activities.filter((activity) => {
      if (!selectedUserId) {
        return false;
      }

      return (
        activity.userId === selectedUserId &&
        (activity.type === "email_sent" || activity.type === "support_message")
      );
    });
  }, [activities, selectedApplication?.user?.id]);

  const filteredActivities = useMemo(() => {
    const normalizedQuery = activitySearchQuery.trim().toLowerCase();

    return communicationActivities.filter((activity) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        activity.title,
        activity.subject,
        activity.description,
        activity.actorName,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [activitySearchQuery, communicationActivities]);

  const visibleActivities = filteredActivities.slice(0, activityVisibleCount);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = userSearchQuery.trim().toLowerCase();

    return users.filter((listedUser) => {
      if (!normalizedQuery) {
        return true;
      }

      return [listedUser.name, listedUser.email, listedUser.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [userSearchQuery, users]);

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (application: AdminApplication) => application?.status === "pending",
  ).length;
  const approvedApplications = applications.filter(
    (application: AdminApplication) => application?.status === "approved",
  ).length;
  const rejectedApplications = applications.filter(
    (application: AdminApplication) => application?.status === "rejected",
  ).length;
  const progressValue = totalApplications
    ? Math.round((approvedApplications / totalApplications) * 100)
    : 0;

  const overviewCards = [
    {
      label: "Total Applications",
      value: totalApplications,
      detail: "All submitted cases currently in the system.",
      icon: Globe2,
    },
    {
      label: "Pending Applications",
      value: pendingApplications,
      detail: "Requires admin review and processing decisions.",
      icon: Clock3,
    },
    {
      label: "Approved Applications",
      value: approvedApplications,
      detail: "Ready to move into the next visa processing step.",
      icon: CheckCircle2,
    },
    {
      label: "Rejected Applications",
      value: rejectedApplications,
      detail: "Needs follow-up, explanation, or resubmission work.",
      icon: XCircle,
    },
  ];

  const handleStatusUpdate = async (status: AdminApplication["status"]) => {
    if (!selectedApplication?._id) {
      return;
    }

    await updateStatus(selectedApplication._id, status);
  };

  const handleSendEmail = async () => {
    if (!selectedApplication?._id || !emailSubject.trim() || !emailMessage.trim()) {
      return;
    }

    await sendEmail({
      applicationId: selectedApplication._id,
      subject: emailSubject.trim(),
      message: emailMessage.trim(),
    });

    setIsEmailModalOpen(false);
    setEmailSubject("");
    setEmailMessage("");
  };

  const handleDeleteApplication = async () => {
    if (!selectedApplication?._id) {
      return;
    }

    await deleteApplication(selectedApplication._id);
    setSelectedId("");
  };

  const handleCreateCountry = async () => {
    const visaType = countryVisaTypes
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!countryName.trim() || !countryCode.trim() || !countryFlag.trim() || !countryImage.trim() || visaType.length === 0) {
      return;
    }

    await createCountry({
      name: countryName.trim(),
      code: countryCode.trim().toUpperCase(),
      flag: countryFlag.trim(),
      image: countryImage.trim(),
      visaType,
    });

    setCountryName("");
    setCountryCode("");
    setCountryFlag("");
    setCountryImage("");
    setCountryVisaTypes("");
  };

  return (
    <>
      <section className="min-h-screen bg-[linear-gradient(180deg,rgba(41,168,154,0.08),transparent_24%),linear-gradient(180deg,#ffffff,rgba(248,250,252,0.92))] px-4 pb-16 pt-28 sm:px-6 lg:px-8 dark:bg-[linear-gradient(180deg,rgba(41,168,154,0.12),transparent_24%),linear-gradient(180deg,#0f172a,rgba(15,23,42,0.96))]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <Card className="border-border/80 bg-background/90 shadow-md backdrop-blur">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="size-14 border-primary/20 bg-primary/10">
                  <AvatarFallback className="bg-transparent text-base font-semibold text-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                      Admin operations
                    </h1>
                    <Badge variant="secondary">Visa control center</Badge>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Review submissions, change processing status, and communicate
                    with applicants from one power-user workspace.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="mt-1 font-medium">{displayName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">Approval ratio</span>
                    <span className="text-muted-foreground">{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="mt-3" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Share of applications currently approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? <LoadingSkeleton /> : null}
          {!loading && error ? (
            <ErrorState message={error} onRetry={fetchAllApplications} />
          ) : null}
          {!loading && !error ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.label} className="border-border/80 bg-background/90">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardDescription>{card.label}</CardDescription>
                          <CardTitle className="mt-2 text-2xl">
                            {card.value}
                          </CardTitle>
                        </div>
                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                          <Icon className="size-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{card.detail}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
            <div className="space-y-6">
              <Card className="border-border/80 bg-background/90">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <CardTitle>Application management</CardTitle>
                      <CardDescription>
                        Search, filter, and review all applications in one queue.
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => void fetchAllApplications()}>
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_180px_180px_160px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by applicant or country"
                        className="h-11 rounded-xl border-border/70 bg-background/70 pl-9"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(
                          event.target.value as "all" | AdminApplication["status"],
                        )
                      }
                      className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select
                      value={countryFilter}
                      onChange={(event) => setCountryFilter(event.target.value)}
                      className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">All countries</option>
                      {countryOptions.map((country: string) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(event) =>
                        setSortOrder(event.target.value as "newest" | "oldest")
                      }
                      className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                    </select>
                  </div>

                  {filteredApplications.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-border/70">
                      <div className="hidden grid-cols-[1.4fr_1fr_1fr_140px_140px] gap-4 border-b border-border/70 bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:grid">
                        <span>Applicant</span>
                        <span>Country</span>
                        <span>Visa Type</span>
                        <span>Status</span>
                        <span>Created</span>
                      </div>

                      <div className="divide-y divide-border/70">
                        {filteredApplications.map((application: AdminApplication) => (
                          <button
                            key={application._id}
                            type="button"
                            onClick={() => setSelectedId(application._id)}
                            className={`grid w-full gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/30 lg:grid-cols-[1.4fr_1fr_1fr_140px_140px] ${
                              selectedApplication?._id === application._id
                                ? "bg-primary/5"
                                : "bg-background/60"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="font-medium">
                                {application?.clientDetails?.fullName ?? "Unknown applicant"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {application?.user?.email ?? "No email"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">
                                {application?.country?.name ?? "Unknown country"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {application?.country?.code ?? "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">
                                {application?.visaDetails?.visaType ?? "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {application?.visaDetails?.purpose ?? "No purpose"}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Badge variant={getStatusBadgeVariant(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application?.createdAt
                                ? new Date(application.createdAt).toLocaleDateString()
                                : "Unknown"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-background/90">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <CardTitle>Updates and communication</CardTitle>
                      <CardDescription>
                        Direct email thread for the selected user. Only manual admin and client messages appear here.
                      </CardDescription>
                    </div>
                    <div className="relative w-full max-w-sm">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={activitySearchQuery}
                        onChange={(event) => setActivitySearchQuery(event.target.value)}
                        placeholder="Search activity"
                        className="h-11 rounded-xl border-border/70 bg-background/70 pl-9"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!selectedApplication ? (
                    <p className="text-sm text-muted-foreground">
                      Select an application to view that user's communication thread.
                    </p>
                  ) : null}
                  {visibleActivities.map((activity: (typeof activities)[number], index: number) => (
                    <div key={activity._id || `${activity.type}-${index}`}>
                      <div className="rounded-2xl border border-border/70 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{activity.title}</p>
                              <Badge
                                variant={
                                  activity.type === "support_message"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {activity.type === "support_message"
                                  ? "Client message"
                                  : "Admin email"}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
                              onClick={() => void deleteActivity(activity._id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < visibleActivities.length - 1 ? (
                        <Separator className="my-3" />
                      ) : null}
                    </div>
                  ))}
                  {visibleActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication
                        ? "No manual communication matches this user or your search."
                        : "No communication selected."}
                    </p>
                  ) : null}
                  {filteredActivities.length > activityVisibleCount ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => setActivityVisibleCount((current) => current + 6)}
                    >
                      See more
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/80 bg-background/90 xl:sticky xl:top-28">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Application details</CardTitle>
                      <CardDescription>
                        Review the full case file and take action.
                      </CardDescription>
                    </div>
                    {selectedApplication ? (
                      <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                        {selectedApplication.status}
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!selectedApplication ? (
                    <p className="text-sm text-muted-foreground">
                      Select an application from the queue to review details.
                    </p>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-border/70 p-4">
                        <p className="text-sm text-muted-foreground">Applicant</p>
                        <p className="mt-1 font-medium">
                          {selectedApplication?.clientDetails?.fullName ?? "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedApplication?.user?.email ?? "No email"}
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <Button
                          variant="outline"
                          className="h-10 rounded-xl"
                          onClick={() => void handleStatusUpdate("approved")}
                        >
                          <CheckCircle2 />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="h-10 rounded-xl"
                          onClick={() => void handleStatusUpdate("rejected")}
                        >
                          <XCircle />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 rounded-xl"
                          onClick={() => void handleStatusUpdate("pending")}
                        >
                          <Clock3 />
                          Mark as Pending
                        </Button>
                        <Button
                          className="h-10 rounded-xl"
                          onClick={() => setIsEmailModalOpen(true)}
                        >
                          <Mail />
                          Send Email
                        </Button>
                        <Button
                          variant="destructive"
                          className="h-10 rounded-xl"
                          onClick={() => void handleDeleteApplication()}
                        >
                          <Trash2 />
                          Delete Application
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Country</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-lg">
                              {selectedApplication?.country?.flag ?? "🌍"}
                            </span>
                            <p className="font-medium">
                              {selectedApplication?.country?.name ?? "Unknown country"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Created date</p>
                          <p className="mt-1 font-medium">
                            {selectedApplication?.createdAt
                              ? new Date(selectedApplication.createdAt).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Client Details</p>
                          <div className="mt-2 space-y-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">Full name: </span>
                              <span className="font-medium">
                                {selectedApplication?.clientDetails?.fullName ?? "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Passport number: </span>
                              <span className="font-medium">
                                {selectedApplication?.clientDetails?.passportNumber ?? "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Nationality: </span>
                              <span className="font-medium">
                                {selectedApplication?.clientDetails?.nationality ?? "Unknown"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Visa Details</p>
                          <div className="mt-2 space-y-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">Purpose: </span>
                              <span className="font-medium">
                                {selectedApplication?.visaDetails?.purpose ?? "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Visa type: </span>
                              <span className="font-medium">
                                {selectedApplication?.visaDetails?.visaType ?? "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Travel date: </span>
                              <span className="font-medium">
                                {selectedApplication?.visaDetails?.travelDate
                                  ? new Date(
                                      selectedApplication.visaDetails.travelDate,
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Duration: </span>
                              <span className="font-medium">
                                {selectedApplication?.visaDetails?.duration ?? "Unknown"}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Notes: </span>
                              <span className="font-medium">
                                {selectedApplication?.visaDetails?.notes || "No notes"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="border-border/80 bg-background/90">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <UserCog className="size-5" />
                  </div>
                  <div>
                    <CardTitle>User management</CardTitle>
                    <CardDescription>
                      Review roles, search accounts, and remove users when needed.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={userSearchQuery}
                    onChange={(event) => setUserSearchQuery(event.target.value)}
                    placeholder="Search users"
                    className="h-11 rounded-xl border-border/70 bg-background/70 pl-9"
                  />
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((listedUser: AdminUser) => (
                    <div
                      key={listedUser.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{listedUser.name}</p>
                          <Badge variant={listedUser.role === "admin" ? "default" : "outline"}>
                            {listedUser.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{listedUser.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            void updateUserRole(
                              listedUser.id,
                              listedUser.role === "admin" ? "user" : "admin",
                            )
                          }
                        >
                          <Users className="size-4" />
                          {listedUser.role === "admin" ? "Make User" : "Make Admin"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void deleteUser(listedUser.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No users match your search.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-background/90">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <MapPinPlus className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Destination management</CardTitle>
                    <CardDescription>
                      Add new visa destinations and remove destinations that are no longer available.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={countryName}
                    onChange={(event) => setCountryName(event.target.value)}
                    placeholder="Country name"
                    className="h-11 rounded-xl"
                  />
                  <Input
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    placeholder="Country code"
                    className="h-11 rounded-xl"
                  />
                  <Input
                    value={countryFlag}
                    onChange={(event) => setCountryFlag(event.target.value)}
                    placeholder="Flag emoji"
                    className="h-11 rounded-xl"
                  />
                  <Input
                    value={countryImage}
                    onChange={(event) => setCountryImage(event.target.value)}
                    placeholder="Image URL"
                    className="h-11 rounded-xl"
                  />
                </div>
                <Input
                  value={countryVisaTypes}
                  onChange={(event) => setCountryVisaTypes(event.target.value)}
                  placeholder="Visa types, comma separated"
                  className="h-11 rounded-xl"
                />
                <Button disabled={savingCountry} onClick={() => void handleCreateCountry()}>
                  {savingCountry ? "Saving..." : "Add destination"}
                  <MapPinPlus />
                </Button>

                <div className="space-y-3">
                  {countries.map((country: AdminCountry) => (
                    <div
                      key={country.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">
                            {country.flag} {country.name}
                          </p>
                          <Badge variant="outline">{country.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {country.visaType.join(", ")}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void deleteCountry(country.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  ))}
                  {countries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No destinations available.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Contact {selectedApplication?.clientDetails?.fullName ?? "the client"} directly from the admin dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 p-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailSubject}
                onChange={(event) => setEmailSubject(event.target.value)}
                placeholder="Application update"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={emailMessage}
                onChange={(event) => setEmailMessage(event.target.value)}
                placeholder="Write the message to the applicant"
                className="min-h-36 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button
              disabled={emailSending || !selectedApplication?._id}
              onClick={() => void handleSendEmail()}
            >
              {emailSending ? "Sending..." : "Send Email"}
              <ShieldCheck />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AdminDashboardPage = () => (
  <AdminProvider>
    <AdminDashboardContent />
  </AdminProvider>
);

export default AdminDashboardPage;
