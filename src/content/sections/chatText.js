import {
  BUDGET_BRACKETS,
  HEADER_SUBTITLE,
  ROLES,
  SEARCH_STAGES,
  STRINGS,
  UNIT_TYPES,
  WHATSAPP_TEMPLATES,
} from "@/components/Chat/chatFlow";

/*
 * Every line of the chat widget, one section per language, built from the
 * defaults in src/components/Chat/chatFlow.js so the two can never drift.
 *
 * Field keys: the STRINGS key itself ("greetingTitle"), "headerSubtitle",
 * "wa-<template>" for the WhatsApp messages and "option-<group>-<id>" for
 * the answer buttons. The ids behind the buttons are fixed in code (the
 * server checks them); only their wording is editable.
 */
const TOKENS_HELP = "Keep any {{...}} placeholder as typed: it is filled in with the project name, the visitor's first name, and so on.";

function humanise(key) {
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const hasToken = (value) => typeof value === "string" && value.includes("{{");

function stringFields(language) {
  return Object.entries(STRINGS[language]).map(([key, value]) => ({
    key,
    label: humanise(key),
    type: "TEXT",
    ...(value.length > 80 ? { long: true } : {}),
    ...(hasToken(value) ? { helperText: TOKENS_HELP } : {}),
    defaultValue: value,
  }));
}

function optionFields(language) {
  const groups = [
    ["role", "Answer: I'm here as", ROLES],
    ["stage", "Answer: buying intent", SEARCH_STAGES],
    ["unit", "Answer: bedrooms", UNIT_TYPES],
    ["budget", "Answer: budget", BUDGET_BRACKETS],
  ];
  return groups.flatMap(([group, label, items]) =>
    items.flatMap((item) => [
      {
        key: `option-${group}-${item.id.replace(/_/g, "-")}`,
        label: `${label}: ${item.label.en}`,
        type: "TEXT",
        defaultValue: item.label[language],
      },
      ...(item.brokerLabel
        ? [
            {
              key: `option-${group}-${item.id.replace(/_/g, "-")}-broker`,
              label: `${label} (broker): ${item.brokerLabel.en}`,
              type: "TEXT",
              defaultValue: item.brokerLabel[language],
            },
          ]
        : []),
    ]),
  );
}

function templateFields(language) {
  return Object.entries(WHATSAPP_TEMPLATES).map(([name, text]) => ({
    key: `wa-${name.replace(/_/g, "-")}`,
    label: `WhatsApp message: ${name.replace(/_/g, " ")}`,
    type: "TEXT",
    long: true,
    helperText: TOKENS_HELP,
    defaultValue: text[language],
  }));
}

function chatTextFields(language) {
  return [
    { key: "headerSubtitle", label: "Header subtitle", type: "TEXT", defaultValue: HEADER_SUBTITLE[language] },
    ...stringFields(language),
    ...optionFields(language),
    ...templateFields(language),
  ];
}

export const CHAT_TEXT_EN_FIELDS = chatTextFields("en");
export const CHAT_TEXT_AR_FIELDS = chatTextFields("ar");

/*
 * Turns a section's merged content back into the shape Chat.js uses:
 * { strings, headerSubtitle, labels: { role: { buyer: "..." } },
 *   brokerLabels: { stage: {...} }, templates: { hot: "..." } }.
 * A blank value falls back to the code default, so a cleared field never
 * leaves a button or a message empty.
 */
export function chatTextFromContent(content, language) {
  const pick = (key, fallback) => {
    const value = content?.[key];
    return typeof value === "string" && value.trim() !== "" ? value : fallback;
  };

  const strings = {};
  for (const [key, value] of Object.entries(STRINGS[language])) strings[key] = pick(key, value);

  const labels = {};
  const brokerLabels = {};
  for (const [group, items] of [["role", ROLES], ["stage", SEARCH_STAGES], ["unit", UNIT_TYPES], ["budget", BUDGET_BRACKETS]]) {
    labels[group] = {};
    brokerLabels[group] = {};
    for (const item of items) {
      const base = `option-${group}-${item.id.replace(/_/g, "-")}`;
      labels[group][item.id] = pick(base, item.label[language]);
      if (item.brokerLabel) brokerLabels[group][item.id] = pick(`${base}-broker`, item.brokerLabel[language]);
    }
  }

  const templates = {};
  for (const [name, text] of Object.entries(WHATSAPP_TEMPLATES)) {
    templates[name] = pick(`wa-${name.replace(/_/g, "-")}`, text[language]);
  }

  return { strings, headerSubtitle: pick("headerSubtitle", HEADER_SUBTITLE[language]), labels, brokerLabels, templates };
}
