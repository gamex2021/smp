"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  onboardingSchema,
  OnboardingSchema,
} from "../../lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/app/config/siteConfig";
import { Button } from "@/components/ui/button";

const steps = ["School Information", "Administrator Details", "Confirmation"];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });

  function handleNext() {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }

  function handlePrev() {
    setCurrentStep((prev) => prev - 1);
  }

  let schooladdress = (
    <div className="space-y-3 py-3">
      <p className="text-sm font-semibold">School Address</p>
      <FormField
        control={form.control}
        name="school.address.line1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Line 1</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="school.address.line2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Line 2</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="school.address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school.address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="school.address.postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal code</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="school.address.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {siteConfig.operationalCountries.map((item) => (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  const schoolDetails = (
    <>
      <FormField
        control={form.control}
        name="school.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="school.domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School site domain</FormLabel>
            <FormControl>
              <Input placeholder="lsmc.schoolportal.com" {...field} />
            </FormControl>
            <FormDescription>
              This can be the initial of your school name, it will be used to
              access your school portal and cannot be changed once set.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>School logo</FormLabel>
        <Input type="file" accept="image/*" multiple={false} />
      </FormItem>

      <FormItem>
        <FormLabel>School registeration document</FormLabel>
        <Input type="file" accept="application/pdf" multiple={false} />
        <FormDescription>
          This could be the school registeration document, certificates of
          proprietorship etc.
        </FormDescription>
      </FormItem>

      {schooladdress}
    </>
  );

  const adminDetails = (
    <div className="space-y-3 py-3">
      <p className="text-sm font-semibold">Admin information</p>
      <FormField
        control={form.control}
        name="admin.firstname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="admin.lastname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="admin.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="admin.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case 0:
        return schoolDetails;
      case 1:
        return adminDetails;
      default:
        return <></>;
    }
  }

  return (
    <Form {...form}>
      <form className="grid w-full max-w-2xl grid-cols-1 gap-3">
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-xs">{step}</div>
              </div>
            ))}
          </div>
          <div className="bg-muted mt-4 h-2 rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        {renderStep()}
        <div className="flex items-center justify-end gap-2">
          {currentStep > 0 && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (currentStep === 0) {
                  form.trigger(["school.name", "school.logo", "school.domain",
                    "school.registeration_doc", "school.address"])
                }
                handlePrev();
              }}
            >
              Back{" "}
            </Button>
          )}{" "}
          {currentStep < steps.length && (
            <Button
              variant={currentStep === steps.length - 1 ? "default" : "outline"}
              type="button"
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  alert("form submitted.");
                  return;
                }
                handleNext();
              }}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
