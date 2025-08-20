import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Video,
  Plus,
  Search,
  Filter,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { useMeetService } from "@/services/meet/hooks";
import { CreateMeetingModal } from "@/components/CreateMeetingModal";
import { MeetingCard } from "@/components/MeetingCard";
import useAuthStore from "@/store/authStore";



export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [roomId, setRoomId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    useCreateRoom,
    useCreateSolanaRoom,
    useGetCreatedMeetings,
    useGetPublicMeetings,
    useGetMeetingStats,
  } = useMeetService();

  const { mutate: createWeb2, isLoading: isCreatingWeb2 } = useCreateRoom();
  const { mutate: createSolana, isLoading: isCreatingSolana } = useCreateSolanaRoom();

  // Get meetings data
  const { data: createdMeetingsData, isLoading: loadingCreated, refetch: refetchCreated, error: errorCreated } = 
    useGetCreatedMeetings({ page: 1, limit: 10, status: filterStatus !== "all" ? filterStatus : undefined });
  
  const { data: publicMeetingsData, isLoading: loadingPublic, refetch: refetchPublic, error: errorPublic } = 
    useGetPublicMeetings({ page: 1, limit: 10, type: filterType !== "all" ? filterType : undefined });

  const { data: statsData, isLoading: loadingStats, error: errorStats } = useGetMeetingStats();

  const createdMeetings = createdMeetingsData?.data?.data?.meetings || [];
  const publicMeetings = publicMeetingsData?.data?.data?.meetings || [];
  const stats = statsData?.data?.data || {};

  // Debug logging
  console.log("Dashboard Data:", {
    createdMeetings,
    publicMeetings,
    stats,
    loadingCreated,
    loadingPublic,
    errorCreated,
    errorPublic
  });

  const createWeb2Meeting = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  const createSolanaMeeting = () => {
    createSolana();
  };

  const joinRoom = () => {
    if (roomId) navigate(`/room/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };

  const refreshAllData = () => {
    refetchCreated();
    refetchPublic();
  };

  const handleMeetingCreated = (newMeeting) => {
    // Refresh all data to show the new meeting
    refreshAllData();
    // Switch to "My Meetings" tab to show the newly created meeting
    setActiveTab("created");
    // No toast needed as the success dialog will handle this
  };

  const filteredPublicMeetings = publicMeetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your meetings and discover new ones</p>
        </div>
        <div className="flex gap-2">
          <CreateMeetingModal
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Meeting
              </Button>
            }
            onSuccess={handleMeetingCreated}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="created">My Meetings</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Created Meetings</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalCreated || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Joined Meetings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalJoined || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loadingStats ? "..." : stats.upcomingMeetings || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loadingStats ? "..." : stats.ongoingMeetings || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Web2 Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Create Web2 Meeting</CardTitle>
                <p className="text-muted-foreground">Start a new meeting instantly</p>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={createWeb2Meeting}
                  // disabled={isCreatingWeb2}
                >
                  {/* {isCreatingWeb2 ? "Creating..." : "Create Meeting"} */}
            Create Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Create Solana Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Solana Gated Meeting</CardTitle>
                <p className="text-muted-foreground">Meeting for Solana wallet holders</p>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={createSolanaMeeting}
                  disabled={isCreatingSolana}
                >
                  {isCreatingSolana ? "Creating..." : "Create Solana Meeting"}
                </Button>
              </CardContent>
            </Card>

            {/* Join by Room ID */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Join Meeting</CardTitle>
                <p className="text-muted-foreground">Enter Room ID to join</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => {
              if (roomId) navigate(`/room/${roomId}`);
              else {
                alert("Please provide a valid room id");
              }
            }}
          >
            Join Web2 Room
          </Button>
          <Button
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
            onClick={() => {
              if (roomId) navigate(`/solana-room/${roomId}`);
              else {
                alert("Please provide a valid room id");
              }
            }}
                >
                  Join Solana Gated Room
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Meetings Tab */}
        <TabsContent value="created" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Created Meetings</h2>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingCreated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : errorCreated ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-red-600 mb-4">
                  Error loading created meetings: {errorCreated.message}
                </div>
                <Button onClick={() => refetchCreated()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : createdMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  variant="created"
                  onUpdate={refreshAllData}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first meeting to get started
                </p>
                <CreateMeetingModal
                  trigger={<Button>Create Your First Meeting</Button>}
                  onSuccess={handleMeetingCreated}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-2xl font-bold">Discover Public Meetings</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="web2">Web2</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingPublic ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : errorPublic ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-red-600 mb-4">
                  Error loading public meetings: {errorPublic.message}
                </div>
                <Button onClick={() => refetchPublic()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredPublicMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPublicMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  variant="public"
                  onUpdate={refreshAllData}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No public meetings found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "Be the first to create a public meeting!"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
