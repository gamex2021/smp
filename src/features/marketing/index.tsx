/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDomain } from "@/context/DomainContext";
import { useMutation, useQuery } from "convex/react";
import {
  Eye,
  FileText,
  HelpCircle,
  ImageIcon as Image,
  Layout,
  Loader2,
  MessageSquare,
  Palette,
  Plus,
  Save,
  School,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { type Id } from "~/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import InitializeLandingPageButton from "./components/initialize-button";

export default function LandingPageCustomization() {
  const [activeTab, setActiveTab] = useState("general");
  const [schoolId, setSchoolId] = useState<Id<"schools"> | null>(null);

  // Get school info
  const { domain, user } = useDomain();

  useEffect(() => {
    if (user?.schoolId) {
      setSchoolId(user.schoolId);
    }
  }, [user]);

  // Check if landing page is initialized
  const initStatusQuery = useQuery(
    api.queries.landingPage.checkLandingPageInitialized,
    schoolId ? { schoolId } : "skip",
  );
  const initStatus = initStatusQuery;
  const checkingInit = initStatusQuery === undefined;

  // Get landing page data for admin
  const schoolInfo = useQuery(api.queries.school.findSchool, { domain });

  // Get landing page data if initialized
  const landingPageData = useQuery(
    api.queries.landingPage.getAdminLandingPageData,
    schoolInfo?.id ? { schoolId: schoolInfo.id } : "skip",
  );

  const isLoading =
    checkingInit || !schoolId || !schoolInfo || landingPageData === undefined;
  const isInitialized = initStatus?.initialized;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-lg font-medium">
            Loading landing page settings...
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized && schoolId) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-2 border-dashed border-gray-200 bg-white/50">
          <CardHeader>
            <CardTitle>Landing Page Not Set Up</CardTitle>
            <CardDescription>
              Your school landing page hasn&apos;t been initialized yet. Create
              a default landing page with placeholder content to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-10">
            <div className="max-w-md text-center">
              <Layout className="mx-auto mb-4 h-16 w-16 text-emerald-500 opacity-80" />
              <h3 className="mb-2 text-xl font-medium">
                Create Your School&apos;s Landing Page
              </h3>
              <p className="mb-6 text-gray-500">
                Initialize your landing page with professional placeholder
                content that you can customize later.
              </p>
              <InitializeLandingPageButton
                schoolId={schoolId}
                onInitialized={() => window.location.reload()}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Customization</h1>
          <p className="text-gray-500">
            Customize your school&apos;s public landing page
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Publish Changes
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 my-4"
      >
        <TabsList className="flex my-4 space-x-2 justify-around flex-wrap items-center">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Layout className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Sections</span>
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Palette className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Image className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger
            value="testimonials"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Testimonials</span>
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden md:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger
            value="admissions"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <School className="h-4 w-4" />
            <span className="hidden md:inline">Admissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {schoolInfo && landingPageData?.config && (
            <GeneralSettings
              config={landingPageData.config ?? {}}
              schoolId={schoolInfo.id}
            />
          )}
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          {schoolInfo && (
            <SectionsManager
              sections={landingPageData.sections}
              schoolId={schoolInfo.id}
            />
          )}
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          {schoolInfo && (
            <ThemeSettings
              config={landingPageData.config ?? {}}
              schoolId={schoolInfo.id}
            />
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentManager
            testimonials={landingPageData.testimonials}
            faqItems={landingPageData.faqItems}
            schoolId={schoolInfo?.id ?? ""}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          {schoolInfo && (
            <MediaManager
              sections={landingPageData.sections}
              schoolId={schoolInfo.id}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface GeneralSettingsProps {
  config: {
    metaData?: {
      title?: string;
      description?: string;
      keywords?: string[];
      ogImage?: string;
    };
    customCss?: string;
    customJs?: string;
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      fontFamily?: string;
      buttonStyle?: string;
      darkMode?: boolean;
    };
    logo?: string;
    favicon?: string;
  };
  schoolId: Id<"schools">;
}

function GeneralSettings({ config, schoolId }: GeneralSettingsProps) {
  const [formData, setFormData] = useState({
    title: config?.metaData?.title ?? "",
    description: config?.metaData?.description ?? "",
    keywords: config?.metaData?.keywords?.join(", ") ?? "",
    customCss: config?.customCss ?? "",
    customJs: config?.customJs ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLandingPageConfig = useMutation(
    api.mutations.landingPage.updateLandingPageConfig,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateLandingPageConfig({
        schoolId,
        theme: {
          primaryColor: config?.theme?.primaryColor ?? "#2E8B57",
          secondaryColor: config?.theme?.secondaryColor ?? "#4B6CB7",
          accentColor: config?.theme?.accentColor ?? "#F59E0B",
          fontFamily: config?.theme?.fontFamily ?? "Inter, sans-serif",
          // @ts-expect-error
          buttonStyle: config?.theme?.buttonStyle ?? "rounded",
          darkMode: config?.theme?.darkMode ?? false,
        },
        logo: config?.logo as Id<"_storage"> | undefined,
        favicon: config?.favicon as Id<"_storage"> | undefined,
        metaData: {
          title: formData.title,
          description: formData.description,
          keywords: formData.keywords.split(",").map((k) => k.trim()),
          // @ts-expect-error
          ogImage: config?.metaData?.ogImage,
        },
        customCss: formData.customCss,
        customJs: formData.customJs,
      });

      toast.success("General settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Optimize your landing page for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Your School Name - Quality Education"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description of your school (150-160 characters)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="school, education, learning, academy"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Customization</CardTitle>
          <CardDescription>
            Add custom CSS and JavaScript to your landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss"
              name="customCss"
              value={formData.customCss}
              onChange={handleChange}
              placeholder=".custom-class { color: blue; }"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customJs">Custom JavaScript</Label>
            <Textarea
              id="customJs"
              name="customJs"
              value={formData.customJs}
              onChange={handleChange}
              placeholder="document.addEventListener('DOMContentLoaded', function() { /* Your code here */ });"
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function ThemeSettings({
  config,
  schoolId,
}: {
  config: GeneralSettingsProps["config"];
  schoolId: Id<"schools">;
}) {
  const [formData, setFormData] = useState<{
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    buttonStyle: "rounded" | "pill" | "square";
    darkMode: boolean;
  }>({
    primaryColor: config?.theme?.primaryColor ?? "#2E8B57",
    secondaryColor: config?.theme?.secondaryColor ?? "#4B6CB7",
    accentColor: config?.theme?.accentColor ?? "#F59E0B",
    fontFamily: config?.theme?.fontFamily ?? "Inter, sans-serif",
    buttonStyle:
      (config?.theme?.buttonStyle as "rounded" | "pill" | "square") ??
      "rounded",
    darkMode: config?.theme?.darkMode ?? false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLandingPageConfig = useMutation(
    api.mutations.landingPage.updateLandingPageConfig,
  );

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateLandingPageConfig({
        schoolId,
        theme: {
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          accentColor: formData.accentColor,
          fontFamily: formData.fontFamily,
          buttonStyle: formData.buttonStyle,
          darkMode: formData.darkMode,
        },
        // @ts-expect-error
        logo: config?.logo,
        // @ts-expect-error
        favicon: config?.favicon
          ? { __tableName: "_storage", id: config.favicon }
          : undefined,
        // @ts-expect-error
        metaData: {
          title: config?.metaData?.title ?? "Default Title",
          description: config?.metaData?.description ?? "Default Description",
          keywords: config?.metaData?.keywords ?? [],
          ogImage: config?.metaData?.ogImage,
        }
          ? {
              ...config.metaData,
              // @ts-expect-error
              ogImage: config.metaData.ogImage as Id<"_storage"> | undefined,
            }
          : {
              title: "School Landing Page",
              description: "Welcome to our school website",
              keywords: ["school", "education"],
              ogImage: undefined,
            },
        customCss: config?.customCss,
        customJs: config?.customJs,
      });

      toast.success("Theme settings updated successfully");
    } catch (error: unknown) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>
            Customize the colors of your landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: formData.primaryColor }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <HexColorPicker
                      color={formData.primaryColor}
                      onChange={(color) => handleChange("primaryColor", color)}
                    />
                    <div className="p-2">
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) =>
                          handleChange("primaryColor", e.target.value)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-gray-500">
                Used for buttons, links, and primary elements
              </p>
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: formData.secondaryColor }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <HexColorPicker
                      color={formData.secondaryColor}
                      onChange={(color) =>
                        handleChange("secondaryColor", color)
                      }
                    />
                    <div className="p-2">
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          handleChange("secondaryColor", e.target.value)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-gray-500">
                Used for secondary elements and accents
              </p>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: formData.accentColor }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <HexColorPicker
                      color={formData.accentColor}
                      onChange={(color) => handleChange("accentColor", color)}
                    />
                    <div className="p-2">
                      <Input
                        value={formData.accentColor}
                        onChange={(e) =>
                          handleChange("accentColor", e.target.value)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-gray-500">
                Used for highlights and call-to-actions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography & UI</CardTitle>
          <CardDescription>Customize fonts and UI elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select
              value={formData.fontFamily}
              onValueChange={(value) => handleChange("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                <SelectItem value="Montserrat, sans-serif">
                  Montserrat
                </SelectItem>
                <SelectItem value="'Open Sans', sans-serif">
                  Open Sans
                </SelectItem>
                <SelectItem value="'Playfair Display', serif">
                  Playfair Display
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select
              value={formData.buttonStyle}
              onValueChange={(value) => handleChange("buttonStyle", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="darkMode"
              checked={formData.darkMode}
              onCheckedChange={(checked) => handleChange("darkMode", checked)}
            />
            <Label htmlFor="darkMode">Enable Dark Mode by Default</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

interface Section {
  _id: string;
  title: string;
  type: string;
  isActive: boolean;
}

function SectionsManager({
  sections = [],
  schoolId,
}: {
  sections: Section[];
  schoolId: Id<"schools">;
}) {
  const [sectionsList, setSectionsList] = useState(sections);
  const [isReordering, setIsReordering] = useState(false);

  const reorderSections = useMutation(
    api.mutations.landingPage.reorderLandingPageSections,
  );

  interface Section {
    _id: string;
    title: string;
    type: string;
    isActive: boolean;
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items: Section[] = Array.from(sectionsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (result.destination) {
      items.splice(result.destination.index, 0, reorderedItem as any);
    }

    // Update local state
    setSectionsList(items);

    // Update order in database
    setIsReordering(true);
    try {
      await reorderSections({
        schoolId,
        sectionIds: items.map(
          (section) => section._id as Id<"landingPageSections">,
        ),
      });
      toast.success("Sections reordered successfully");
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to reorder sections");
      // Revert to original order
      setSectionsList(sections);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Page Sections</CardTitle>
            <CardDescription>
              Drag and drop to reorder sections on your landing page
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {isReordering && (
            <div className="mb-4 flex items-center justify-center rounded-md bg-amber-50 p-4 text-amber-700">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating section order...
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {sectionsList.map((section, index) => (
                    <Draggable
                      key={section._id}
                      draggableId={section._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between rounded-md border bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{section.title}</h3>
                              <p className="text-sm capitalize text-gray-500">
                                {section.type} Section
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={section.isActive}
                              // Add handler for toggling section active state
                            />
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {sectionsList.length === 0 && (
            <div className="rounded-md border-2 border-dashed py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No sections yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first section
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

function ContentManager({
  testimonials = [],
  faqItems = [] as FAQItem[],
  schoolId,
}: {
  testimonials: any[];
  faqItems: FAQItem[];
  schoolId: string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>
              Manage testimonials displayed on your landing page
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-full bg-gray-200">
                      {testimonial.avatar && (
                        <img
                          src={`/api/convex/storage/${testimonial.avatar}`}
                          alt={testimonial.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{testimonial.content}</p>
              </div>
            ))}

            {testimonials.length === 0 && (
              <div className="col-span-2 rounded-md border-2 border-dashed py-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No testimonials yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add testimonials to build trust with visitors
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>FAQ Items</CardTitle>
            <CardDescription>Manage frequently asked questions</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <div key={faq._id} className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </div>
            ))}

            {faqItems.length === 0 && (
              <div className="rounded-md border-2 border-dashed py-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No FAQ items yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add frequently asked questions to help visitors
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MediaManager({
  sections = [],
  schoolId,
}: {
  sections: Section[];
  schoolId: Id<"schools">;
}) {
  return (
    <div>
      <p>Media Manager</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-48 items-center justify-center">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      Loading...
    </div>
  );
}
