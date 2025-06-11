"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Users, User, Search, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Id } from "~/_generated/dataModel";

interface ClassroomMessagesProps {
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomMessages({
  subjectTeacherId,
}: ClassroomMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual message queries
  const conversations = [
    {
      id: "1",
      type: "individual",
      participant: {
        name: "John Doe",
        avatar: "/placeholder.svg",
        lastSeen: "2 hours ago",
      },
      lastMessage: "Thank you for the feedback on my assignment",
      timestamp: "2 hours ago",
      unread: 2,
    },
    {
      id: "2",
      type: "individual",
      participant: {
        name: "Sarah Smith",
        avatar: "/placeholder.svg",
        lastSeen: "1 day ago",
      },
      lastMessage: "When is the next quiz scheduled?",
      timestamp: "1 day ago",
      unread: 0,
    },
  ];

  const classMessages = [
    {
      id: "1",
      sender: "You",
      message: "Don't forget about tomorrow's quiz on Chapter 5",
      timestamp: "2 hours ago",
      type: "announcement",
    },
    {
      id: "2",
      sender: "John Doe",
      message: "Will the quiz cover the entire chapter?",
      timestamp: "1 hour ago",
      type: "question",
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">
            Communicate with your students
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <Tabs defaultValue="class" className="w-full">
        <TabsList>
          <TabsTrigger value="class" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Class Discussion
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Individual Chats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Class Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 max-h-96 space-y-4 overflow-y-auto">
                {classMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp}
                        </span>
                        {msg.type === "announcement" && (
                          <Badge variant="secondary" className="text-xs">
                            Announcement
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message to the class..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px]"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversation.participant.avatar || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {conversation.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate font-medium">
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last seen {conversation.participant.lastSeen}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {conversations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  No conversations yet
                </h3>
                <p className="text-muted-foreground">
                  Start a conversation with your students to provide support and
                  guidance.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
