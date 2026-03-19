"use client";

import { useState } from "react";
import {
  Users,
  UserRound,
  Church,
  Globe,
  User,
  Plus,
  MoreHorizontal,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sun,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { usePrayer } from "@/lib/prayer-context";
import type { PrayerGroup, PrayerRequest } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AddPrayerDialog } from "@/components/prayer/add-prayer-dialog";

const GROUPS: PrayerGroup[] = ["Family", "Friends", "Church", "World", "Self"];

const GROUP_CONFIG: Record<
  PrayerGroup,
  {
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  Family: {
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  Friends: {
    icon: UserRound,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  Church: {
    icon: Church,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  World: {
    icon: Globe,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  Self: {
    icon: User,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
};

function getDaysActive(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getLongestActive(requests: PrayerRequest[]): number {
  const active = requests.filter((r) => !r.is_answered);
  if (active.length === 0) return 0;
  return Math.max(...active.map((r) => getDaysActive(r.created_at)));
}

interface RequestRowProps {
  request: PrayerRequest;
  onEdit: (request: PrayerRequest) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string) => void;
}

function RequestRow({
  request,
  onEdit,
  onDelete,
  onMarkAnswered,
}: RequestRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isAnswered = request.is_answered;
  const daysActive = isAnswered && request.answered_date
    ? Math.floor(
        (new Date(request.answered_date).getTime() - new Date(request.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : getDaysActive(request.created_at);

  return (
    <>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
          isAnswered
            ? "border-amber-200 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20"
            : "border-border hover:bg-accent/50"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-sm text-foreground truncate">
              {request.subject}
            </p>
            {isAnswered && (
              <Badge
                variant="secondary"
                className="text-xs shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Answered
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-1.5">
            {request.request}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {isAnswered && request.answered_date
                ? `Answered after ${daysActive} day${daysActive !== 1 ? "s" : ""}`
                : `${daysActive} day${daysActive !== 1 ? "s" : ""} active`}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(request)}>
              Edit
            </DropdownMenuItem>
            {!isAnswered && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onMarkAnswered(request.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-600" />
                  Mark Answered
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prayer Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{request.subject}&rdquo;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(request.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface GroupSectionProps {
  group: PrayerGroup;
  activeRequests: PrayerRequest[];
  answeredRequests: PrayerRequest[];
  onEdit: (request: PrayerRequest) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string) => void;
  onAdd: (group: PrayerGroup) => void;
}

function GroupSection({
  group,
  activeRequests,
  answeredRequests,
  onEdit,
  onDelete,
  onMarkAnswered,
  onAdd,
}: GroupSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAnswered, setShowAnswered] = useState(false);
  const config = GROUP_CONFIG[group];
  const GroupIcon = config.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <div className={`flex items-center justify-between px-4 py-3 ${isOpen ? "border-b border-border" : ""}`}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <GroupIcon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-sm">{group}</span>
                {activeRequests.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeRequests.length} active
                  </Badge>
                )}
                {answeredRequests.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  >
                    {answeredRequests.length} answered
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-2 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(group);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <CardContent className="p-3 space-y-2">
            {activeRequests.length === 0 && answeredRequests.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No prayer requests yet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs text-muted-foreground"
                  onClick={() => onAdd(group)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add one
                </Button>
              </div>
            ) : (
              <>
                {activeRequests.map((req) => (
                  <RequestRow
                    key={req.id}
                    request={req}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMarkAnswered={onMarkAnswered}
                  />
                ))}

                {answeredRequests.length > 0 && (
                  <Collapsible
                    open={showAnswered}
                    onOpenChange={setShowAnswered}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 w-full">
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${showAnswered ? "rotate-180" : ""}`}
                        />
                        {showAnswered ? "Hide" : "Show"} {answeredRequests.length} answered
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {answeredRequests.map((req) => (
                        <RequestRow
                          key={req.id}
                          request={req}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onMarkAnswered={onMarkAnswered}
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function PrayerContent() {
  const { requests, isLoading, deletePrayerRequest, markAnswered } =
    usePrayer();
  const [addOpen, setAddOpen] = useState(false);
  const [addGroup, setAddGroup] = useState<PrayerGroup>("Family");
  const [editRequest, setEditRequest] = useState<PrayerRequest | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleAdd = (group: PrayerGroup) => {
    setAddGroup(group);
    setAddOpen(true);
  };

  const handleEdit = (request: PrayerRequest) => {
    setEditRequest(request);
    setEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-4 space-y-1.5">
                <Skeleton className="h-7 w-10" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const activeRequests = requests.filter((r) => !r.is_answered);
  const answeredRequests = requests.filter((r) => r.is_answered);
  const groupsInUse = new Set(activeRequests.map((r) => r.group_name)).size;
  const longestActive = getLongestActive(requests);

  const requestsByGroup = Object.fromEntries(
    GROUPS.map((g) => [
      g,
      {
        active: requests.filter((r) => r.group_name === g && !r.is_answered),
        answered: requests.filter((r) => r.group_name === g && r.is_answered),
      },
    ])
  ) as Record<PrayerGroup, { active: PrayerRequest[]; answered: PrayerRequest[] }>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Prayer
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bring everything before God in prayer
          </p>
        </div>
        <div className="sm:mt-0">
          <AddPrayerDialog
            initialGroup={addGroup}
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (!open) setAddGroup("Family");
            }}
            trigger={
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Prayer
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          {
            label: "Active",
            value: activeRequests.length,
            icon: Sun,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Answered",
            value: answeredRequests.length,
            icon: CheckCircle2,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
          },
          {
            label: "Groups in Use",
            value: groupsInUse,
            icon: LayoutGrid,
            color: "text-chart-2",
            bgColor: "bg-chart-2/10",
          },
          {
            label: "Longest Active",
            value: `${longestActive}d`,
            icon: Clock,
            color: "text-chart-3",
            bgColor: "bg-chart-3/10",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scripture parchment card */}
      <div className="rounded-xl border border-parchment-border bg-parchment px-5 py-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-serif text-sm leading-relaxed text-foreground/80 italic">
              &ldquo;First of all, then, I urge that supplications, prayers,
              intercessions, and thanksgivings be made for all people&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              1 Timothy 2:1
            </p>
          </div>
        </div>
      </div>

      {/* Group accordions */}
      <div className="space-y-3">
        {GROUPS.map((group) => (
          <GroupSection
            key={group}
            group={group}
            activeRequests={requestsByGroup[group].active}
            answeredRequests={requestsByGroup[group].answered}
            onEdit={handleEdit}
            onDelete={deletePrayerRequest}
            onMarkAnswered={markAnswered}
            onAdd={handleAdd}
          />
        ))}
      </div>

      {/* Edit dialog (controlled) */}
      {editRequest && (
        <AddPrayerDialog
          request={editRequest}
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditRequest(null);
          }}
        />
      )}
    </div>
  );
}
