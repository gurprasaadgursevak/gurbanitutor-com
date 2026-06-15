// Small social links row used in every page footer.
// Order: YouTube · Instagram · WhatsApp Santhiya group.

const YOUTUBE_URL = "https://www.youtube.com/@gurprasaadgursevak";
const INSTAGRAM_URL = "https://instagram.com/gurbanitutor";
// Internal /santhiya page hosts the WhatsApp QR + join instructions.
const WHATSAPP_HREF = "/santhiya#whatsapp";

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M21.6 7.2c-.2-1-.9-1.8-1.9-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.7.4c-1 .2-1.7 1-1.9 2C2 9 2 12 2 12s0 3 .4 4.8c.2 1 .9 1.8 1.9 2 1.8.4 7.7.4 7.7.4s5.9 0 7.7-.4c1-.2 1.7-1 1.9-2 .4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 5.4c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm0 7.2c-1.6 0-2.8-1.2-2.8-2.8s1.2-2.8 2.8-2.8 2.8 1.2 2.8 2.8-1.2 2.8-2.8 2.8zm5.6-7.4c0 .6-.5 1-1 1s-1-.4-1-1 .5-1 1-1 1 .4 1 1z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.5 3.5A10.4 10.4 0 0 0 12 .5 10.4 10.4 0 0 0 1.6 11a10.3 10.3 0 0 0 1.4 5.2L1 23l6.9-1.8a10.4 10.4 0 0 0 4.1.8 10.4 10.4 0 0 0 10.4-10.4 10.4 10.4 0 0 0-1.9-8.1zM12 19.7a8.7 8.7 0 0 1-4.4-1.2l-.3-.2-4.1 1.1 1.1-4-.2-.3a8.6 8.6 0 0 1-1.3-4.6A8.6 8.6 0 0 1 12 1.9a8.6 8.6 0 0 1 6.1 14.7 8.6 8.6 0 0 1-6.1 3.1zm4.8-6.5c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4 0-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType;
  external: boolean;
};

const ITEMS: Item[] = [
  { href: YOUTUBE_URL, label: "Gurprasaad Gursevak on YouTube", Icon: YouTubeIcon, external: true },
  { href: INSTAGRAM_URL, label: "@GurbaniTutor on Instagram", Icon: InstagramIcon, external: true },
  { href: WHATSAPP_HREF, label: "Santhiya WhatsApp community", Icon: WhatsAppIcon, external: false },
];

export default function SocialLinks() {
  return (
    <div className="mt-3 flex items-center justify-center gap-3">
      {ITEMS.map(({ href, label, Icon, external }) => (
        <a
          key={href}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-amber-300 hover:text-amber-700"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
