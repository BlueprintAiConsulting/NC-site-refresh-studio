import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  Image, 
  LogOut, 
  Users, 
  Calendar,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  const adminActions = [
    {
      title: 'Photo Gallery',
      description: 'Upload and manage church photos',
      icon: Image,
      href: '/admin/photos',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Newsletters',
      description: 'Upload and manage newsletters',
      icon: FileText,
      href: '/admin/newsletters',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Events',
      description: 'Create and manage church events',
      icon: Calendar,
      href: '/admin/events',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Ministries',
      description: 'Update ministry information',
      icon: Users,
      href: '/admin/ministries',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Analytics',
      description: 'View site statistics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Content',
      description: 'Edit page content',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-pink-500/10 text-pink-600',
    },
    {
      title: 'Settings',
      description: 'Site configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500/10 text-gray-600',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Events</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Gallery Photos</CardDescription>
                <CardTitle className="text-3xl">48</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Monthly Visitors</CardDescription>
                <CardTitle className="text-3xl">1.2k</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Ministries</CardDescription>
                <CardTitle className="text-3xl">8</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Action Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} to={action.href}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle>{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
