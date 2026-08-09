"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerSettings } from "@/types/customer";

export function CustomerFirstLoginTour() {
  const settingsQuery = useCustomerQuery<CustomerSettings>("settings", "/customer/settings");
  const updateSettings = useCustomerMutation<Partial<CustomerSettings>, CustomerSettings>(
    "settings",
    (values) => ({ path: "/customer/settings", options: { method: "PATCH", body: values } })
  );

  useEffect(() => {
    if (!settingsQuery.data || settingsQuery.data.tour_completed) {
      return;
    }

    const tour = driver({
      showProgress: true,
      allowClose: true,
      doneBtnText: "Done",
      nextBtnText: "Next",
      prevBtnText: "Back",
      onDestroyed: () => updateSettings.mutate({ tour_completed: true }),
      steps: [
        { element: "[data-tour='customer-nav']", popover: { title: "Account areas", description: "Jump between orders, designs, wishlist, addresses, payments, and settings." } },
        { element: "[data-tour='customer-notifications']", popover: { title: "Live updates", description: "Order, message, and account alerts appear here in real time." } },
        { element: "[data-tour='customer-profile']", popover: { title: "Your profile", description: "Manage your profile, settings, and sign out from this menu." } }
      ]
    });

    const timeout = window.setTimeout(() => tour.drive(), 400);

    return () => {
      window.clearTimeout(timeout);
      tour.destroy();
    };
  }, [settingsQuery.data, updateSettings]);

  return null;
}
