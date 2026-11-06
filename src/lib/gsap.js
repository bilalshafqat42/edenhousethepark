"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// One registration for the whole site, shared by the page motion and the chat.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
