import { z } from "zod";
import rawConfig from "@/content/site-config.json";

const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

const serviceTimeSchema = z.object({
  name: z.string(),
  time: z.string(),
  day: z.string(),
  description: z.string().optional(),
});

const siteConfigSchema = z.object({
  church: z.object({
    name: z.string(),
    address: addressSchema,
    contact: z.object({
      phone: z.string(),
      email: z.string(),
    }),
  }),
  serviceTimes: z.array(serviceTimeSchema),
  emergencyAlert: z.object({
    enabled: z.boolean(),
    message: z.string(),
    type: z.enum(["info", "warning", "error", "success"]).catch("info"),
  }),
  socialMedia: z.object({
    facebook: z.string(),
    youtube: z.string(),
    liveStream: z.string(),
  }),
  googleCalendar: z.object({
    enabled: z.boolean(),
    calendarId: z.string(),
  }),
  heroImage: z.object({
    url: z.string(),
    alt: z.string().optional(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type ServiceTime = z.infer<typeof serviceTimeSchema>;

const siteConfig = siteConfigSchema.parse(rawConfig);

const formatCityStateZip = (address: SiteConfig["church"]["address"]) =>
  `${address.city}, ${address.state} ${address.zip}`;

export const formatAddressLines = (
  address: SiteConfig["church"]["address"] = siteConfig.church.address,
) => [address.street, formatCityStateZip(address)];

export const formatFullAddress = (
  address: SiteConfig["church"]["address"] = siteConfig.church.address,
) => `${address.street}, ${formatCityStateZip(address)}`;

export const getGoogleMapsEmbedUrl = (
  address: SiteConfig["church"]["address"] = siteConfig.church.address,
) => `https://www.google.com/maps?q=${encodeURIComponent(formatFullAddress(address))}&output=embed`;

export const getGoogleMapsDirectionsUrl = (
  address: SiteConfig["church"]["address"] = siteConfig.church.address,
) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatFullAddress(address))}`;

export default siteConfig;
