import { usePageTitle } from "@abdul-kissflow/app-ui";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    TrendingUp,
    Users
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

// Demo data — placeholder for the design. Replace with `useKf()` calls against
// your app's data models (see CLAUDE.md + agents/kissflow-sdk.md).
const KPIS = [
    { label: "Total records", value: "2,847", delta: "+12.5%", icon: FileText },
    { label: "Active", value: "1,210", delta: "+4.1%", icon: Users },
    { label: "Completed", value: "1,492", delta: "+18.2%", icon: CheckCircle2 },
    { label: "Avg. cycle time", value: "3.2d", delta: "-0.4d", icon: Clock }
];

const ACTIVITY = [
    { month: "Jan", created: 186, closed: 140 },
    { month: "Feb", created: 221, closed: 180 },
    { month: "Mar", created: 264, closed: 210 },
    { month: "Apr", created: 240, closed: 234 },
    { month: "May", created: 312, closed: 268 },
    { month: "Jun", created: 358, closed: 320 }
];

const chartConfig = {
    created: { label: "Created", color: "var(--chart-1)" },
    closed: { label: "Closed", color: "var(--chart-2)" }
};

const CATEGORIES = [
    { name: "Onboarding", value: 82 },
    { name: "Support", value: 64 },
    { name: "Finance", value: 47 },
    { name: "Operations", value: 31 }
];

const RECENT = [
    {
        id: "REC-1042",
        title: "Quarterly review",
        owner: "A. Sharma",
        status: "Active"
    },
    {
        id: "REC-1041",
        title: "Vendor onboarding",
        owner: "M. Iyer",
        status: "Pending"
    },
    {
        id: "REC-1039",
        title: "Budget approval",
        owner: "K. Rao",
        status: "Completed"
    },
    {
        id: "REC-1036",
        title: "Site inspection",
        owner: "S. Nair",
        status: "Active"
    }
];

const STATUS_VARIANT = {
    Active: "default",
    Pending: "secondary",
    Completed: "outline"
};

export default function Dashboard() {
    usePageTitle("Dashboard");

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your app's activity.
                    </p>
                </div>
                <Button size="sm" className="gap-1.5 self-start sm:self-auto">
                    <Plus className="size-4" /> New record
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {KPIS.map((k) => (
                    <Card key={k.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {k.label}
                            </CardTitle>
                            <k.icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div className="text-2xl font-semibold">
                                {k.value}
                            </div>
                            <Badge
                                variant="secondary"
                                className="gap-1 font-normal text-muted-foreground"
                            >
                                <TrendingUp className="size-3 text-primary" />
                                {k.delta}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart + breakdown */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Activity</CardTitle>
                        <CardDescription>
                            Created vs. closed over the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="h-[240px] w-full"
                        >
                            <AreaChart
                                data={ACTIVITY}
                                margin={{ left: 4, right: 4, top: 8 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Area
                                    dataKey="created"
                                    type="natural"
                                    stroke="var(--color-created)"
                                    fill="var(--color-created)"
                                    fillOpacity={0.2}
                                    stackId="a"
                                />
                                <Area
                                    dataKey="closed"
                                    type="natural"
                                    stroke="var(--color-closed)"
                                    fill="var(--color-closed)"
                                    fillOpacity={0.2}
                                    stackId="a"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top categories</CardTitle>
                        <CardDescription>
                            Share of open records.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {CATEGORIES.map((c) => (
                            <div key={c.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span>{c.name}</span>
                                    <span className="text-muted-foreground">
                                        {c.value}%
                                    </span>
                                </div>
                                <Progress value={c.value} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Recent records</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground"
                    >
                        View all <ArrowUpRight className="size-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="text-right">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {RECENT.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {r.id}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {r.title}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {r.owner}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant={STATUS_VARIANT[r.status]}
                                        >
                                            {r.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
