import { BROKER_LINKS, DEFAULT_CALL_NUMBER, PROJECT_NAME, PROJECT_SHORT_NAME, TEASER } from "@/components/Chat/chatFlow";

/*
 * The chat widget's settings: photos, project name, contact numbers, the
 * teaser bubble's timing and the broker links. Its wording, in English and
 * Arabic, is in the two Chat Text sections.
 *
 * Chat text is shown as plain text (any formatting is removed), because it
 * is mixed with what the visitor types.
 */
export const CHAT_AGENT_FIELDS = [
  {
    key: "agent-photo",
    label: "Intro card photo, shown before the chat opens (portrait)",
    type: "IMAGE",
    helperText: "Recommended 520×720px.",
    defaultValue: "/images/agent/avatar.webp",
  },
  {
    key: "agent-photo-square",
    label: "Chat header avatar, square",
    type: "IMAGE",
    helperText: "Recommended 80×80px.",
    defaultValue: "/images/agent/avatar-square.webp",
  },
  {
    key: "project-name",
    label: "Project name in full: chat header, messages, and the 'project' sent with each chat lead",
    type: "TEXT",
    defaultValue: PROJECT_NAME,
  },
  {
    key: "project-short-name",
    label: "Project name, shortened (teaser bubble, one broker question)",
    type: "TEXT",
    defaultValue: PROJECT_SHORT_NAME,
  },
  {
    key: "call-number",
    label: "'Call now' number",
    type: "TEXT",
    helperText: `International format, e.g. +97144230167. Blank: ${DEFAULT_CALL_NUMBER}.`,
    defaultValue: "",
  },
  {
    key: "whatsapp-number",
    label: "WhatsApp number",
    type: "TEXT",
    helperText: "International format, e.g. +971501234567. Blank: the WhatsApp buttons are hidden until a number is set.",
    defaultValue: "",
  },
  { key: "teaser-enabled", label: "Show the teaser bubble", type: "BOOLEAN", defaultValue: TEASER.enabled ? "true" : "false" },
  { key: "teaser-delay-seconds", label: "Teaser: show after this many seconds", type: "TEXT", defaultValue: String(TEASER.delaySeconds) },
  { key: "teaser-scroll-percent", label: "Teaser: or after scrolling this % of the page", type: "TEXT", defaultValue: String(TEASER.scrollPercent) },
  {
    key: "broker-links",
    label: "Links shown to brokers after they enquire",
    type: "LIST",
    itemLabel: "Link",
    itemFields: [
      { key: "label-en", label: "Label (English)", type: "TEXT" },
      { key: "label-ar", label: "Label (Arabic)", type: "TEXT" },
      { key: "url", label: "Link", type: "LINK" },
    ],
    defaultValue: BROKER_LINKS.map((link) => ({ "label-en": link.label.en, "label-ar": link.label.ar, url: link.url })),
  },
];
