import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle, Clock, UserX } from 'lucide-react';
import { OutreachStats } from '@/lib/types';

interface StatsCardsProps {
    stats?: OutreachStats;
    isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-24" />
                </Card>
            ))}
        </div>;
    }

    const data = [
        {
            label: 'Reached Out',
            value: stats?.reachedOut || 0,
            icon: Mail,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Referred',
            value: stats?.referred || 0,
            icon: MessageCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Follow Ups',
            value: stats?.followUps || 0,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Absconded',
            value: stats?.absconded || 0,
            icon: UserX,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item) => (
                <Card key={item.label}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                            <p className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
